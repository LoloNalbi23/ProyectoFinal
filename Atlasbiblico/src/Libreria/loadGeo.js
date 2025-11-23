// Cargar todos los archivos geojson automáticamente
const geoFiles = import.meta.glob("../api/0converted/*.geojson", {
    eager: true,
});

// Convertir a un mapa por ID
const geoMap = {};

for (const path in geoFiles) {
    const filename = path.split("/").pop(); // ejemplo "aea17b7.geojson"
    geoMap[filename] = geoFiles[path];
}

export function getGeoJSON(fileName) {
    return geoMap[fileName] || null;
}
