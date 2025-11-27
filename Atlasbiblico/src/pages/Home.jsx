import Versiculo from "./Versiculo";
import MapaVista from "../components/MapaVista";

export default function Home() {
    return (
        <div>
            {/* BARRA SUPERIOR */}
            <header>
                <div>
                    <img src="/logo.png" alt="Logo" />
                    <h1>Estudio Bíblico</h1>
                </div>

                <div>
                    <input type="text" placeholder="Buscar..." />
                    <button>Filtros</button>
                    <button>Modo</button>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <main>
                {/* PANEL IZQUIERDO */}
                <aside>
                    <button>Libros</button>
                    <button>Personajes</button>
                    <button>Conexiones</button>
                    <button>Devocional</button>
                    <button>Visualizaciones</button>
                    <button>Exportar</button>
                </aside>

                {/* PANEL CENTRAL */}
                <section>
                    <div>
                        <h2>Mapa Bíblico</h2>
                        <div>
                            <p>[Mapa interactivo con tooltips aquí]</p>
                        </div>
                    </div>

                    {/* Versículo del Día */}
                    <div>
                        <Versiculo />
                        <MapaVista />
                    </div>
                </section>
            </main>
        </div>
    );
}


