import Versiculo from "./Versiculo";

    export default function Home() {
        return (
        <div>
        {/* 🔝 BARRA SUPERIOR */}
        <header >
            <div >
            <img
                src="/logo.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
            />
            <h1 className="text-xl font-bold tracking-wide">
                Estudio Bíblico
            </h1>
            </div>

            <div className="flex items-center gap-3">
            <input
                type="text"
                placeholder="Buscar..."
                className="px-3 py-2 rounded-md text-gray-800 outline-none"
            />
            <button className="bg-gray-700 px-3 py-2 rounded-md hover:bg-gray-600">
                Filtros
            </button>
            <button className="bg-gray-700 px-3 py-2 rounded-md hover:bg-gray-600">
                Modo 🌙
            </button>
            </div>
        </header>

        {/* 📚 CONTENIDO PRINCIPAL */}
        <main className="flex flex-1">
            {/* 📖 PANEL IZQUIERDO */}
            <aside className="w-1/4 bg-white border-r border-gray-200 p-4 flex flex-col gap-4">
            <button className="text-left hover:bg-gray-100 px-3 py-2 rounded-md">
                📖 Libros
            </button>
            <button className="text-left hover:bg-gray-100 px-3 py-2 rounded-md">
                👤 Personajes
            </button>
            <button className="text-left hover:bg-gray-100 px-3 py-2 rounded-md">
                🔗 Conexiones
            </button>
            <button className="text-left hover:bg-gray-100 px-3 py-2 rounded-md">
                🕊 Devocional
            </button>
            <button className="text-left hover:bg-gray-100 px-3 py-2 rounded-md">
                📊 Visualizaciones
            </button>
            <button className="text-left hover:bg-gray-100 px-3 py-2 rounded-md">
                📤 Exportar
            </button>
            </aside>

            {/* 🗺️ PANEL CENTRAL */}
            <section className="flex-1 p-6 flex flex-col gap-6">
            {/* Mapa */}
            <div className="bg-white rounded-lg shadow-md p-4 flex-1 relative">
                <h2 className="text-lg font-semibold mb-2">Mapa Bíblico</h2>
                <div className="w-full h-80 bg-gray-200 flex items-center justify-center rounded-md">
                <p className="text-gray-500 italic">
                    [Mapa interactivo con tooltips aquí]
                </p>
                </div>
            </div>

            {/* Versículo del Día */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <Versiculo />
            </div>
            </section>
        </main>
        </div>
    );
    }


