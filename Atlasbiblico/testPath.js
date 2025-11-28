import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const kmlPath = path.join(__dirname, '..', 'all.kml');

console.log("Buscando en:", kmlPath);
console.log("Existe?:", fs.existsSync(kmlPath));


console.log("dirname:", __dirname);
console.log("resolved:", require('path').join(__dirname, 'all.kml'));
