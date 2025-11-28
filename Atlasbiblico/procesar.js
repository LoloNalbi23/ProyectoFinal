import fs from "fs";
import { parseStringPromise } from "xml2js";

// Regex ajustado al formato real:
const refRegex = /([A-Za-z1-3]+)\s*<a[^>]*>(\d+:\d+)<\/a>/g;

function extractBibleReferences(description) {
    const refs = [];
    let match;
    while ((match = refRegex.exec(description)) !== null) {
        refs.push({
            book: match[1],
            verse: match[2]
        });
    }
    return refs;
}

function parseCoordinates(coordString) {
    return coordString.trim().split(" ").map(pair => {
        const [lng, lat] = pair.split(",").map(Number);
        return [lng, lat];
    });
}

async function main() {
    const xml = fs.readFileSync("all.kml", "utf8");
    const kml = await parseStringPromise(xml);

    const folders = kml.kml.Document[0].Folder;

    const placesByBook = {}; // libro → array de lugares

    for (const folder of folders) {
        const placeName = folder.name?.[0];
        const description = folder.description?.[0] || "";

        const refs = extractBibleReferences(description);
        if (refs.length === 0) continue;

        // Acá guardaremos TODAS las geometrías:
        const allGeometries = [];

        const placemarks = folder.Placemark || [];
        for (const pm of placemarks) {
            // POINT
            if (pm.Point) {
                const coordStr = pm.Point[0].coordinates[0];
                const [lng, lat] = coordStr.split(",").map(Number);
                allGeometries.push({
                    type: "Point",
                    coordinates: { lng, lat }
                });
            }

            // POLYGON
            if (pm.Polygon) {
                const coords = pm.Polygon[0]
                    .outerBoundaryIs[0]
                    .LinearRing[0]
                    .coordinates[0];

                allGeometries.push({
                    type: "Polygon",
                    coordinates: parseCoordinates(coords)
                });
            }
        }

        // Ahora agregamos el lugar a cada libro mencionado:
        refs.forEach(ref => {
            const book = ref.book;
            if (!placesByBook[book]) placesByBook[book] = [];

            placesByBook[book].push({
                name: placeName,
                reference: ref,
                geoms: allGeometries
            });
        });
    }

    fs.writeFileSync("lugares-por-libro.json", JSON.stringify(placesByBook, null, 2));
    console.log("Listo: lugares-por-libro.json generado.");
}

main();
