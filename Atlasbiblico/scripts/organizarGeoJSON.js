// scripts/organizarGeoJSON.js
// Ejecutar: node scripts/organizarGeoJSON.js
// Nota: package.json debe contener "type": "module" para poder usar import/ESM o usar node >=14 con --experimental-modules.

import fs from "fs";
import path from "path";

/* ---------------- CONFIG ---------------- */
const RAW_DIR = path.join(process.cwd(), "scripts", "raw"); // donde pusiste los .geojson originales
const OUT_BASE = path.join(process.cwd(), "public", "data"); // salida: public/data/{categoria}
const INDEX_FILE = path.join(OUT_BASE, "index.json");
const LOG_FILE = path.join(OUT_BASE, "organizar_log.json");

// Categorías objetivo
const CATEGORIES = ["ciudades", "rios", "regiones", "desconocido"];

// Config de duplicados: tolerancia en grados para considerar coordenadas iguales
const COORD_TOLERANCE = 0.0001; // ~10m a nivel del ecuador (aprox. muy pequeño)

/* ------------- UTILIDADES --------------- */

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function limpiarNombre(nombre) {
  if (!nombre) return null;
  return nombre
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function textoContiene(text = "", regex) {
  if (!text) return false;
  return regex.test(text.toString().toLowerCase());
}

function firstName(props) {
  // Intenta extraer name, else title, else id
  return props?.name || props?.title || props?.nombre || null;
}

function coordEquals(a, b, tol = COORD_TOLERANCE) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  // a and b can be [lon, lat] or nested
  return Math.abs(a[0] - b[0]) <= tol && Math.abs(a[1] - b[1]) <= tol;
}

function normalizeFeatureMainCoord(feature) {
  const g = feature.geometry;
  if (!g) return null;
  if (g.type === "Point") return g.coordinates;
  // para polygon o linestring devolvemos primer punto
  if (Array.isArray(g.coordinates) && g.coordinates.length > 0) {
    // polygon: coordinates[0][0] ; linestring: coordinates[0]
    if (g.type === "Polygon" || g.type === "MultiPolygon") {
      // polygon: first ring first coord
      const c = g.coordinates[0];
      if (Array.isArray(c) && c.length > 0) return c[0];
    } else {
      // LineString or MultiLineString -> first coord
      const c = g.coordinates[0];
      if (Array.isArray(c) && c.length > 0) return Array.isArray(c[0]) ? c[0] : c;
    }
  }
  return null;
}

function bboxAreaApprox(bbox) {
  // bbox = [minX, minY, maxX, maxY] OR array of points produce approx area (deg^2)
  if (!bbox || bbox.length !== 4) return 0;
  const dx = Math.abs(bbox[2] - bbox[0]);
  const dy = Math.abs(bbox[3] - bbox[1]);
  return dx * dy;
}

/* ------------- REGLAS DE CLASIFICACIÓN --------------- */

function heuristicaPorNombreYTexto(props) {
  const name = (props?.name || "").toString().toLowerCase();
  const desc = (props?.description || props?.desc || props?.notes || "").toString().toLowerCase();

  // palabras clave fuertemente indicativas
  if (textoContiene(name + " " + desc, /\b(río|rio|wadi|stream|river|brook|nahr|nāḥal|nahal)\b/)) return "rios";
  if (textoContiene(name + " " + desc, /\b(monte|monte|mount|hill|berg|mountain|mt\.|mt|summit)\b/)) return "regiones";
  if (textoContiene(name + " " + desc, /\b(valle|valley|plain|desierto|desert|tierra|land|región|region|province|territory|territorio)\b/)) return "regiones";
  if (textoContiene(name + " " + desc, /\b(mar|sea|gulf|bay|lagoon|lago|lake)\b/)) return "regiones";

  // conteo de palabras sencillo: 1 -> ciudad; 2+ -> región (heurística)
  const words = name.trim().split(/\s+/).filter(Boolean).length;
  if (words === 1) return "ciudades";
  if (words === 2) return "regiones";

  return null;
}

function heuristicaPorStyleAndIcon(props) {
  const style = (props?.styleUrl || "").toString().toLowerCase();
  const icon = (props?.icon || props?.iconUrl || "").toString().toLowerCase();

  if (textoContiene(style + " " + icon, /\b(river|stream|wad|water)\b/)) return "rios";
  if (textoContiene(style + " " + icon, /\b(point|pin|marker|landpoint)\b/)) return "ciudades";
  if (textoContiene(style + " " + icon, /\b(region|isobands|isoband|polygon|area|fill)\b/)) return "regiones";
  if (textoContiene(style + " " + icon, /\b(mountain|mt|peak)\b/)) return "regiones";

  return null;
}

function heuristicaPorGeometryAndSize(feature) {
  const geo = feature.geometry;
  if (!geo) return null;
  const type = geo.type;
  if (type === "Point") return "ciudades";
  if (type === "LineString" || type === "MultiLineString") return "rios";
  if (type === "Polygon" || type === "MultiPolygon") {
    // compute bbox from coordinates quick
    // We'll try to approximate bbox if available
    const coords = geo.coordinates;
    // crude bbox calc: find min/max lon/lat across points (works for simple polygons)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    function scanArray(arr) {
      if (!Array.isArray(arr)) return;
      if (typeof arr[0] === "number") {
        const lon = arr[0], lat = arr[1];
        minX = Math.min(minX, lon);
        minY = Math.min(minY, lat);
        maxX = Math.max(maxX, lon);
        maxY = Math.max(maxY, lat);
      } else {
        for (const c of arr) scanArray(c);
      }
    }
    scanArray(coords);
    const bboxArea = (isFinite(minX) ? (maxX - minX) * (maxY - minY) : 0);
    // if polygon small -> maybe ciudad (rare), else region
    if (bboxArea > 0 && bboxArea < 0.01) {
      // very small polygon (e.g., an ancient tell) -> treat as ciudad
      return "ciudades";
    }
    return "regiones";
  }
  return null;
}

/* ------------- MAIN PROCESS ---------------- */

function generarIndexSkeleton() {
  const idx = {};
  for (const c of CATEGORIES) idx[c] = [];
  return idx;
}

function uniqueNameInDir(dir, baseName) {
  let name = baseName;
  let i = 2;
  while (fs.existsSync(path.join(dir, name + ".geojson"))) {
    name = `${baseName}_${i}`;
    i++;
  }
  return name;
}

function findDuplicate(listOfFiles, targetCoord, targetName) {
  // listOfFiles: [{name, coord, path}]
  for (const item of listOfFiles) {
    if (item.name && targetName && item.name === targetName) return item;
    if (item.coord && targetCoord && coordEquals(item.coord, targetCoord)) return item;
  }
  return null;
}

function main() {
  console.log("Iniciando organizador inteligente de GeoJSON...");

  if (!fs.existsSync(RAW_DIR)) {
    console.error("Carpeta RAW no existe:", RAW_DIR);
    console.error("Creala y mové allí tus .geojson crudos, luego corre este script.");
    process.exit(1);
  }

  ensureDir(OUT_BASE);
  for (const c of CATEGORIES) ensureDir(path.join(OUT_BASE, c));

  const files = fs.readdirSync(RAW_DIR).filter(f => f.toLowerCase().endsWith(".geojson"));
  if (files.length === 0) {
    console.log("No hay archivos .geojson en RAW:", RAW_DIR);
    process.exit(0);
  }

  const index = generarIndexSkeleton();
  const processedList = []; // para detectar duplicados: {name, coord, path, category}
  const stats = { total: files.length, moved: 0, duplicates: 0 };

  for (const file of files) {
    try {
      const rawPath = path.join(RAW_DIR, file);
      const rawText = fs.readFileSync(rawPath, "utf8");
      const json = JSON.parse(rawText);

      const feature = json.features?.[0] || null;
      if (!feature) {
        console.warn("Sin features:", file);
        // mover a desconocido
        const dest = path.join(OUT_BASE, "desconocido", file);
        fs.copyFileSync(rawPath, dest);
        index.desconocido.push(`data/desconocido/${file}`);
        continue;
      }

      const props = feature.properties || {};
      const geom = feature.geometry || {};
      const geomType = geom.type || "";

      // 1) detectar por style/icon/desc/name keywords
      let categoria = null;

      // priority: style/icon
      categoria = heuristicaPorStyleAndIcon(props) || null;

      // next: description/name keywords
      if (!categoria) categoria = heuristicaPorNombreYTexto(props);

      // next: geometry and size
      if (!categoria) categoria = heuristicaPorGeometryAndSize(feature);

      // fallback: unknown
      if (!categoria) categoria = "desconocido";

      // Determine final filename base from properties.name
      const rawName = firstName(props) || path.parse(file).name;
      const cleaned = limpiarNombre(rawName) || path.parse(file).name;
      const destDir = path.join(OUT_BASE, categoria);

      // evitar duplicados: comparo coordenadas principales y nombres
      const mainCoord = normalizeFeatureMainCoord(feature);
      const dup = findDuplicate(processedList, mainCoord, cleaned);

      if (dup) {
        // Ya existe: incrementamos contador y renombramos nuevo archivo o lo fusionamos (aqui copiamos con sufijo)
        stats.duplicates++;
        const uniqueBase = uniqueNameInDir(destDir, cleaned);
        const newName = `${uniqueBase}.geojson`;
        const destPath = path.join(destDir, newName);
        fs.copyFileSync(rawPath, destPath);
        index[categoria].push(`data/${categoria}/${newName}`);
        processedList.push({ name: uniqueBase, coord: mainCoord, path: destPath, category: categoria });
        console.log(`DUPLICADO detectado: ${file} -> ${categoria}/${newName}`);
      } else {
        // nombre final único
        const uniqueBase = uniqueNameInDir(destDir, cleaned);
        const newName = `${uniqueBase}.geojson`;
        const destPath = path.join(destDir, newName);
        fs.copyFileSync(rawPath, destPath);
        index[categoria].push(`data/${categoria}/${newName}`);
        processedList.push({ name: uniqueBase, coord: mainCoord, path: destPath, category: categoria });
        stats.moved++;
        console.log(`OK: ${file} -> ${categoria}/${newName}`);
      }

    } catch (err) {
      console.error("ERROR procesando", file, err.message);
      // mover a desconocido por seguridad
      try {
        const dest = path.join(OUT_BASE, "desconocido", file);
        fs.copyFileSync(path.join(RAW_DIR, file), dest);
        index.desconocido.push(`data/desconocido/${file}`);
      } catch (e) {
        console.error("No se pudo mover a desconocido:", file, e.message);
      }
    }
  } // for files

  // Write index.json and log
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), "utf8");
  fs.writeFileSync(LOG_FILE, JSON.stringify({ stats, index, processed: processedList.length }, null, 2), "utf8");

  console.log("\nProceso completado.");
  console.log("Estadísticas:", stats);
  console.log("index.json generado en:", INDEX_FILE);
  console.log("log generado en:", LOG_FILE);
}

main();
