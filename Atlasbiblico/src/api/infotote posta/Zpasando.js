//---------------ancient--------------------

// import fs from "fs";

// // 1) Leer archivo JSONL
// const raw = fs.readFileSync("ancient.jsonl", "utf8");

// // 2) Separar las líneas
// const lines = raw.trim().split("\n");

// // 3) Crear el objeto gigante
// const big = {};

// // 4) Procesar cada línea
// for (const line of lines) {
//     const obj = JSON.parse(line);

//     // Tomar la clave con el nombre del lugar
//     const key = obj.friendly_id;

//     // Guardar el objeto completo bajo esa clave
//     big[key] = obj;
// }

// // 5) Escribir archivo final
// fs.writeFileSync("ancient-indexado.json", JSON.stringify(big, null, 2));

// console.log("Listo: creado ancient-indexado.json");

//----------------geometry------------------

// import fs from "fs";

// const raw = fs.readFileSync("geometry.jsonl", "utf8");
// const lines = raw.trim().split("\n");

// const big = {};

// for (const line of lines) {
//     const obj = JSON.parse(line);

//     // clave basada en "name"
//     const key = obj.name;

//     big[key] = obj;
// }

// fs.writeFileSync("geometry-indexado.json", JSON.stringify(big, null, 2));

// console.log("Listo: creado geometry-indexado.json");

import fs from "fs";
import path from "path";

// === CONFIGURACIÓN ===
const dir = "./"; // carpeta actual

// === FUNCIONES ===

// 1. Detecta la clave ideal según el tipo de objeto
function getKey(obj) {
    // prioridad según tipo de archivo o estructura
    if (obj.friendly_id) return obj.friendly_id;   // ancient, modern, source
    if (obj.name) return obj.name;                 // geometry
    if (obj.id && typeof obj.id === "string" && obj.id.startsWith("i")) return obj.id; // images
    if (obj.id) return obj.id;                     // fallback general
    return null;
}

// 2. Convierte un archivo JSONL a JSON indexado
function convertirArchivo(file) {
    console.log(`Procesando ${file}...`);
    const raw = fs.readFileSync(path.join(dir, file), "utf8").trim();
    const lines = raw.split("\n");
    const big = {};

    for (const line of lines) {
        const obj = JSON.parse(line);
        const key = getKey(obj);
        if (key) big[key] = obj;
    }

    const outFile = file.replace(".jsonl", "-indexado.json");
    fs.writeFileSync(outFile, JSON.stringify(big, null, 2));
    console.log(`✔ Creado ${outFile}`);
}

// === EJECUCIÓN ===
const files = fs.readdirSync(dir).filter(f => f.endsWith(".jsonl"));

if (files.length === 0) {
    console.log("No se encontraron archivos .jsonl en la carpeta.");
    process.exit(0);
}

for (const file of files) convertirArchivo(file);

console.log("✅ Conversión completa.");
