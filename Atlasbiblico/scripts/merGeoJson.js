// merge-geojson.js
// Ejecutar con: node merge-geojson.js

const fs = require("fs");
const path = require("path");

// CONFIGURACIÓN — ajusta nombres si tus carpetas son distintas
const SOURCE_JSON = "./infototeposta/ancient.json"; // tu JSON principal
const GEOJSON_FOLDER = "./0converted";               // carpeta con +3000 geojson
const OUTPUT = "./all.geojson";                      // salida final

console.log("Cargando JSON principal...");
const mainData = JSON.parse(fs.readFileSync(SOURCE_JSON, "utf8"));

let mergedFeatures = [];

console.log("Leyendo archivos GeoJSON...");
const files = fs.readdirSync(GEOJSON_FOLDER).filter(f => f.endsWith(".geojson"));

for (const file of files) {
    const filePath = path.join(GEOJSON_FOLDER, file);

    // intentar encontrar el ID bíblico asociado a este archivo
    const fileId = path.basename(file, ".geojson");

    let bibleId = null;
    for (const key in mainData) {
        if (mainData[key].id === fileId) {
            bibleId = key;
            break;
        }
    }

    const geoContent = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!geoContent.features) continue;

    // agregar IDs nuevos a cada feature
    geoContent.features.forEach(f => {
        f.properties = f.properties || {};
        f.properties.bible_id = bibleId; // ej: "Abana"
        f.properties.file_id = fileId;   // ej: "aea17b7"
        f.properties.original_file = file;
        mergedFeatures.push(f);
    });
}

console.log("Generando all.geojson...");
const output = {
    type: "FeatureCollection",
    features: mergedFeatures
};

fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
console.log("Finalizado. Archivo generado:", OUTPUT);
