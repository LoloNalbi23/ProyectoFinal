import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta correcta si all.kml está en la MISMA carpeta que parsekml.js
const kmlPath = path.join(__dirname, 'all.kml');  // MISMA CARPETA

// --- debug: muestra información útil y evita ENOENT ---
console.log('Script __dirname =', __dirname);
console.log('Buscando all.kml en =', kmlPath);
console.log('process.cwd() =', process.cwd());
console.log('Existe?:', fs.existsSync(kmlPath));

if (!fs.existsSync(kmlPath)) {
    console.error('ERROR: all.kml NO encontrado en la ruta anterior. Asegurate que el archivo esté en la misma carpeta que parsekml.js.');
    process.exit(1);
}

const kmlContent = fs.readFileSync(kmlPath, 'utf-8');

// Nombres de los 66 libros de la Biblia en orden
const LIBROS_BIBLIA = [
    // Antiguo Testamento
    'Gen', 'Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Judg', 'Ruth', '1Sam', '2Sam',
    '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ezra', 'Neh', 'Esth', 'Job', 'Ps', 'Prov',
    'Eccl', 'Song', 'Isa', 'Jer', 'Lam', 'Ezek', 'Dan', 'Hos', 'Joel', 'Amos',
    'Obad', 'Jonah', 'Mic', 'Nah', 'Hab', 'Zeph', 'Hag', 'Zech', 'Mal',
    // Nuevo Testamento
    'Matt', 'Mark', 'Luke', 'John', 'Acts', 'Rom', '1Cor', '2Cor', 'Gal', 'Eph',
    'Phil', 'Col', '1Thess', '2Thess', '1Tim', '2Tim', 'Titus', 'Phlm', 'Heb',
    'Jas', '1Pet', '2Pet', '1John', '2John', '3John', 'Jude', 'Rev'
];

// Extraer libros de una descripción HTML con referencias bíblicas
function extraerLibros(descripcionHTML) {
    if (!descripcionHTML) return [];

    const librosEncontrados = new Set();

    // Buscar cada libro en la descripción
    LIBROS_BIBLIA.forEach(libro => {
        // Regex para encontrar el libro seguido de espacio y números (ej: "Gen 1:1")
        const regex = new RegExp(`\\b${libro}\\s+\\d`, 'g');
        if (regex.test(descripcionHTML)) {
            librosEncontrados.add(libro);
        }
    });

    return Array.from(librosEncontrados);
}

// Parsear el KML
parseString(kmlContent, (err, result) => {
    if (err) {
        console.error('Error parseando KML:', err);
        return;
    }

    const lugares = {};
    const lugaresPorLibro = {};

    // Inicializar objeto de libros
    LIBROS_BIBLIA.forEach(libro => {
        lugaresPorLibro[libro] = [];
    });

    // Procesar cada Folder (cada lugar)
    const folders = result.kml.Document[0].Folder || [];

    folders.forEach(folder => {
        const nombreLugar = folder.name[0];
        const descripcion = folder.description ? folder.description[0] : '';

        // Extraer libros de la descripción
        const libros = extraerLibros(descripcion);

        // Extraer coordenadas de placemarks
        const placemarks = folder.Placemark || [];
        const coordenadas = [];

        placemarks.forEach(placemark => {
            if (placemark.Point && placemark.Point[0].coordinates) {
                const coords = placemark.Point[0].coordinates[0].trim().split(',');
                coordenadas.push({
                    lng: parseFloat(coords[0]),
                    lat: parseFloat(coords[1]),
                    nombre: placemark.name ? placemark.name[0] : nombreLugar
                });
            }
        });

        // Solo guardar si tiene coordenadas y libros
        if (coordenadas.length > 0 && libros.length > 0) {
            lugares[nombreLugar] = {
                nombre: nombreLugar,
                libros: libros,
                referencias: descripcion,
                coordenadas: coordenadas
            };

            // Agregar a cada libro
            libros.forEach(libro => {
                lugaresPorLibro[libro].push({
                    nombre: nombreLugar,
                    coordenadas: coordenadas
                });
            });
        }
    });

    // Guardar archivos JSON en public/data
    const dataDir = path.join(__dirname, '..', '..', 'public', 'data');

    // Crear directorio si no existe
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(dataDir, 'lugares.json'),
        JSON.stringify(lugares, null, 2)
    );

    fs.writeFileSync(
        path.join(dataDir, 'lugares-por-libro.json'),
        JSON.stringify(lugaresPorLibro, null, 2)
    );

    fs.writeFileSync(
        path.join(dataDir, 'libros.json'),
        JSON.stringify(LIBROS_BIBLIA, null, 2)
    );

    console.log(`✅ Procesados ${Object.keys(lugares).length} lugares`);
    console.log(`✅ Distribuidos en ${LIBROS_BIBLIA.length} libros`);
    console.log('📁 Archivos generados:');
    console.log('   - lugares.json');
    console.log('   - lugares-por-libro.json');
    console.log('   - libros.json');
});


