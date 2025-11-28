import MapaVista from '../components/MapaVista';
import "../css/Home.css";


export default function Mapview (){
const libros = [
  { id: 1, name: "Génesis", value: "" },
  { id: 2, name: "Éxodo", value: "" },
  { id: 3, name: "Levítico", value: "" },
  { id: 4, name: "Números", value: "" },
  { id: 5, name: "Deuteronomio", value: "" },
  { id: 6, name: "Josué", value: "" },
  { id: 7, name: "Jueces", value: "" },
  { id: 8, name: "Rut", value: "" },
  { id: 9, name: "1 Samuel", value: "" },
  { id: 10, name: "2 Samuel", value: "" },
  { id: 11, name: "1 Reyes", value: "" },
  { id: 12, name: "2 Reyes", value: "" },
  { id: 13, name: "1 Crónicas", value: "" },
  { id: 14, name: "2 Crónicas", value: "" },
  { id: 15, name: "Esdras", value: "" },
  { id: 16, name: "Nehemías", value: "" },
  { id: 17, name: "Ester", value: "" },
  { id: 18, name: "Job", value: "" },
  { id: 19, name: "Salmos", value: "" },
  { id: 20, name: "Proverbios", value: "" },
  { id: 21, name: "Eclesiastés", value: "" },
  { id: 22, name: "Cantares", value: "" },
  { id: 23, name: "Isaías", value: "" },
  { id: 24, name: "Jeremías", value: "" },
  { id: 25, name: "Lamentaciones", value: "" },
  { id: 26, name: "Ezequiel", value: "" },
  { id: 27, name: "Daniel", value: "" },
  { id: 28, name: "Oseas", value: "" },
  { id: 29, name: "Joel", value: "" },
  { id: 30, name: "Amós", value: "" },
  { id: 31, name: "Abdías", value: "" },
  { id: 32, name: "Jonás", value: "" },
  { id: 33, name: "Miqueas", value: "" },
  { id: 34, name: "Nahúm", value: "" },
  { id: 35, name: "Habacuc", value: "" },
  { id: 36, name: "Sofonías", value: "" },
  { id: 37, name: "Hageo", value: "" },
  { id: 38, name: "Zacarías", value: "" },
  { id: 39, name: "Malaquías", value: "" },
  { id: 40, name: "Mateo", value: "" },
  { id: 41, name: "Marcos", value: "" },
  { id: 42, name: "Lucas", value: "" },
  { id: 43, name: "Juan", value: "" },
  { id: 44, name: "Hechos", value: "" },
  { id: 45, name: "Romanos", value: "" },
  { id: 46, name: "1 Corintios", value: "" },
  { id: 47, name: "2 Corintios", value: "" },
  { id: 48, name: "Gálatas", value: "" },
  { id: 49, name: "Efesios", value: "" },
  { id: 50, name: "Filipenses", value: "" },
  { id: 51, name: "Colosenses", value: "" },
  { id: 52, name: "1 Tesalonicenses", value: "" },
  { id: 53, name: "2 Tesalonicenses", value: "" },
  { id: 54, name: "1 Timoteo", value: "" },
  { id: 55, name: "2 Timoteo", value: "" },
  { id: 56, name: "Tito", value: "" },
  { id: 57, name: "Filemón", value: "" },
  { id: 58, name: "Hebreos", value: "" },
  { id: 59, name: "Santiago", value: "" },
  { id: 60, name: "1 Pedro", value: "" },
  { id: 61, name: "2 Pedro", value: "" },
  { id: 62, name: "1 Juan", value: "" },
  { id: 63, name: "2 Juan", value: "" },
  { id: 64, name: "3 Juan", value: "" },
  { id: 65, name: "Judas", value: "" },
  { id: 66, name: "Apocalipsis", value: "" }
];

    return (
        <div>
            <div className="sidebar">
                <input 
                    list="opciones" 
                    placeholder="Buscar..."
                    className="w-full p-2 border rounded"
                />
                <datalist id="opciones">
                    {libros.map((libro) => (
                        <option key={libro.value} value={libro.name} />
                    ))}
                </datalist>
            </div>
            <section className="map-section">
                <h2>Mapa Bíblico</h2>
                <div>
                    <MapaVista />
                </div>
            </section>
        </div>
    )

}
