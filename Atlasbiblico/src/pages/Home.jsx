    import Versiculo from "./Versiculo";
    // import "./Home.css";

        export default function Home() {
    return (
        <div className="home-container">

      <div className="home-sections">

        <div className="sidebar">
          <Link to="/libros" className="item">📖 Libros</Link>
          <Link to="/personajes" className="item">👤 Personajes</Link>
          <Link to="/conexiones" className="item">🔗 Conexiones</Link>
          <Link to="/visualizaciones" className="item">📊 Visualizaciones</Link>
          <Link to="/exportar" className="item">📤 Exportar</Link>
          <Link to="/devocional" className="item">🕊 Devocional</Link>
          <Link to="/versiculo" className="item">✨ Versículo del día</Link>
        </div>

        <div className="map-container">
          <h2>Mapa Bíblico</h2>
          <div className="map-placeholder">
            Mapa interactivo aquí
          </div>
        </div>

      </div>

    </div>
    );
        }


