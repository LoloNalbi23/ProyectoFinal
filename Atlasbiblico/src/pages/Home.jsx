// Importaciones
import "../css/Home.css";
import { Link } from "react-router-dom";
import MapaVista from "../components/MapaVista";

export default function Home() {
  return (
    <div className="home-container">

      {/* ==== BARRA SUPERIOR ==== */}
      <header className="header">
        <div className="header-left">
          <img src="src/Images/logo.jpg" alt="Logo" className="logo" />
          <h1>Estudio Bíblico</h1>
        </div>

        <div className="header-right">
        </div>
      </header>

      {/* ==== ESTRUCTURA PRINCIPAL ==== */}
      <div className="home-sections">

        {/* ==== BARRA LATERAL (versión refinada combinando ambas) ==== */}
        <div className="sidebar">
          <Link to="/map" className="item">📖 Mapa</Link>
          {/* <Link to="/personajes" className="item">👤 Personajes</Link>
          <Link to="/conexiones" className="item">🔗 Conexiones</Link>
          <Link to="/visualizaciones" className="item">📊 Visualizaciones</Link>
          <Link to="/exportar" className="item">📤 Exportar</Link>
          <Link to="/devocional" className="item">🕊 Devocional</Link> */}
          <Link to="/votd" className="item">✨ Versículo del día</Link>
        </div>

        {/* ==== CONTENIDO CENTRAL ==== */}
        <main className="content">

          {/* BLOQUE DEL MAPA */}
          <section className="map-section">
            <h2>Mapa Bíblico</h2>

            {/* Aquí va el mapa real */}
            <MapaVista />
          </section>

        </main>
      </div>
    </div>
  );
}
