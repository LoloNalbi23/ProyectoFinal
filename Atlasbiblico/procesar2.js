// procesar2.js
// ---------------------------------------------------------
// Lee all.kml y genera:
//   - geojson/<Libro>.json  (puntos y polígonos)
//   - lugares-por-libro.json (lista de lugares por libro)
// ---------------------------------------------------------

import fs from "fs";
import { parseStringPromise } from "xml2js";

const BIBLE_REF_REGEX = /([1-3]?[A-Za-z]+)\.?\s*([0-9]+:[0-9]+)/g;

// ---------------------------------------------------------
// Recorrer todos los niveles en busca de Placemark
// ---------------------------------------------------------
function collectPlacemarks(node) {
    const results = [];

    if (!node || typeof node !== "object") return results;

    if (node.Placemark) {
        for (const pm of node.Placemark) {
            results.push(pm);
        }
    }

    if (node.Folder) {
        for (const f of node.Folder) {
            results.push(...collectPlacemarks(f));
        }
    }

    return results;
}

// ---------------------------------------------------------
function extractBibleReferences(text = "") {
    const matches = [...text.matchAll(BIBLE_REF_REGEX)];
    return matches.map(m => ({
        book: m[1],
        verse: m[2],
    }));
}

// ---------------------------------------------------------
function parsePolygon(coordsText) {
    const coords = coordsText
        .trim()
        .split(/\s+/)
        .map(pair => {
            const [lon, lat] = pair.split(",").map(Number);
            return [lon, lat];
        });

    return {
        type: "Polygon",
        coordinates: [coords],
    };
}

// ---------------------------------------------------------
function parsePoint(coordsText) {
    const [lon, lat] = coordsText.trim().split(",").map(Number);
    return {
        type: "Point",
        coordinates: [lon, lat],
    };
}

// ---------------------------------------------------------
async function main() {
    console.log("Procesando all.kml...");

    const xml = fs.readFileSync("all.kml", "utf8");
    const data = await parseStringPromise(xml);

    const root = data.kml.Document?.[0] || data.kml;
    const placemarks = collectPlacemarks(root);

    console.log("Placemarks encontrados:", placemarks.length);

    // Libro → Features
    const books = {};

    for (const pm of placemarks) {
        const name = pm.name?.[0] || "Sin nombre";
        const desc = pm.description?.[0] || "";

        // 1) EXTRAER LIBROS DESDE CADA PLACEMARK
        const refs = extractBibleReferences(desc);

        if (refs.length === 0) continue; // no pertenece a ningún libro

        // 2) GEOMETRÍA
        let geometry = null;

        const pt = pm.Point?.[0]?.coordinates?.[0];
        if (pt) geometry = parsePoint(pt);

        const poly = pm.Polygon?.[0]?.outerBoundaryIs?.[0]?.LinearRing?.[0]?.coordinates?.[0];
        if (poly) geometry = parsePolygon(poly);

        if (!geometry) continue;

        const feature = {
            type: "Feature",
            geometry,
            properties: { name },
        };

        // 3) Asignar a cada libro detectado
        for (const { book } of refs) {
            if (!books[book]) books[book] = [];
            books[book].push(feature);
        }
    }

    // ---------------------------------------------------------
    // GUARDAR ARCHIVOS
    // ---------------------------------------------------------
    if (!fs.existsSync("geojson")) fs.mkdirSync("geojson");

    const lugaresPorLibro = {};

    for (const book of Object.keys(books)) {
        // GEOJSON
        const geo = {
            type: "FeatureCollection",
            features: books[book],
        };

        fs.writeFileSync(`geojson/${book}.json`, JSON.stringify(geo, null, 2));

        // LISTA
        lugaresPorLibro[book] = books[book].map(f => f.properties.name);
    }

    fs.writeFileSync("lugares-por-libro.json", JSON.stringify(lugaresPorLibro, null, 2));

    console.log("Listo. Archivos generados correctamente.");
}

main();
