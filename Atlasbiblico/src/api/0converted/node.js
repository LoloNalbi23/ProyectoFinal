const fs = require("fs");
const path = require("path");

const folder = "./0converted"; // donde están tus 3000 geojson
const output = { type: "FeatureCollection", features: [] };

for (const file of fs.readdirSync(folder)) {
    if (file.endsWith(".geojson") || file.endsWith(".json")) {
        const filepath = path.join(folder, file);
        const data = JSON.parse(fs.readFileSync(filepath));

        if (data.type === "FeatureCollection") {
            output.features.push(...data.features);
        }
        else if (data.type === "Feature") {
            output.features.push(data);
        }
    }
}

fs.writeFileSync("all.geojson", JSON.stringify(output, null, 2));
console.log("all.geojson creado con éxito");
