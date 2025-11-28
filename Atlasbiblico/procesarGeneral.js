// procesar_general.js
// Convierte all.kml en all.geojson usable para Leaflet

import fs from "fs";
import { parseStringPromise } from "xml2js";

async function readKML(path) {
    const xml = fs.readFileSync(path, "utf8");
    return parseStringPromise(xml);
}

function extractPlacemarks(kml) {
    const doc = kml.kml.Document[0];
    const result = [];

    function walk(node) {
        if (node.Placemark) result.push(...node.Placemark);
        for (const key in node) {
            if (Array.isArray(node[key])) {
                node[key].forEach(walk);
            }
        }
    }
    walk(doc);
    return result;
}

function parseGeometry(pm) {
    if (pm.Point) {
        const coords = pm.Point[0].coordinates[0].trim().split(",");
        return {
            type: "Point",
            coordinates: [parseFloat(coords[0]), parseFloat(coords[1])]
        };
    }

    if (pm.LineString) {
        const coords = pm.LineString[0].coordinates[0].trim().split(" ");
        return {
            type: "LineString",
            coordinates: coords.map(c => {
                const [lon, lat] = c.split(",");
                return [parseFloat(lon), parseFloat(lat)];
            })
        };
    }

    if (pm.Polygon) {
        const coords = pm.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0]
            .trim()
            .split(" ");
        return {
            type: "Polygon",
            coordinates: [
                coords.map(c => {
                    const [lon, lat] = c.split(",");
                    return [parseFloat(lon), parseFloat(lat)];
                })
            ]
        };
    }

    return null;
}

async function main() {
    const kmlData = await readKML("./all.kml");
    const placemarks = extractPlacemarks(kmlData);

    const features = placemarks.map(pm => ({
        type: "Feature",
        properties: {
            name: pm.name ? pm.name[0] : "Sin nombre",
            description: pm.description ? pm.description[0] : ""
        },
        geometry: parseGeometry(pm)
    })).filter(f => f.geometry !== null);

    const geojson = {
        type: "FeatureCollection",
        features
    };

    fs.writeFileSync("./public/data/all.geojson", JSON.stringify(geojson, null, 2));
    console.log("Listo: public/data/all.geojson generado con", features.length, "features");
}

main();
