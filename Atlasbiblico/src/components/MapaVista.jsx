import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/MapaVista.css";

export default function MapaVista() {
    const [map, setMap] = useState(null);
    const [libros, setLibros] = useState([]);
    const [libroSeleccionado, setLibroSeleccionado] = useState("");
    const [lugares, setLugares] = useState([]);
    const [layerGroup, setLayerGroup] = useState(null);

    // Inicializar mapa
    useEffect(() => {
        const mapInstance = L.map("map").setView([31.7, 35.2], 7);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: '© OpenStreetMap'
        }).addTo(mapInstance);

        const group = L.layerGroup().addTo(mapInstance);
        setLayerGroup(group);
        setMap(mapInstance);

        return () => mapInstance.remove();
    }, []);

    // Cargar lista de libros
    useEffect(() => {
        fetch("/data/libros.json")
            .then(res => res.json())
            .then(data => setLibros(data))
            .catch(err => console.error("Error cargando libros:", err));
    }, []);

    // Cargar lugares cuando se selecciona un libro
    useEffect(() => {
        if (!libroSeleccionado) {
            setLugares([]);
            return;
        }

        fetch("/data/lugares-por-libro.json")
            .then(res => res.json())
            .then(data => {
                setLugares(data[libroSeleccionado] || []);
            })
            .catch(err => console.error("Error cargando lugares:", err));
    }, [libroSeleccionado]);

    // Mostrar marcadores en el mapa
    useEffect(() => {
        if (!layerGroup || !lugares.length) {
            if (layerGroup) layerGroup.clearLayers();
            return;
        }

        layerGroup.clearLayers();

        lugares.forEach(lugar => {
            lugar.coordenadas.forEach(coord => {
                const marker = L.marker([coord.lat, coord.lng], {
                    icon: L.icon({
                        iconUrl: "https://maps.google.com/mapfiles/kml/paddle/red-circle.png",
                        iconSize: [24, 24]
                    })
                });

                marker.bindPopup(`
                    <b>${lugar.nombre}</b><br>
                    <i>Libro: ${libroSeleccionado}</i>
                `);

                marker.addTo(layerGroup);
            });
        });

        // Ajustar vista a los marcadores
        if (lugares.length > 0) {
            const bounds = L.latLngBounds(
                lugares.flatMap(l => l.coordenadas.map(c => [c.lat, c.lng]))
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [lugares, layerGroup, map, libroSeleccionado]);

    return (
        <div className="mapa-container">
            <div className="mapa-controles">
                <label htmlFor="libro-select">Filtrar por libro:</label>
                <select
                    id="libro-select"
                    value={libroSeleccionado}
                    onChange={(e) => setLibroSeleccionado(e.target.value)}
                    className="libro-select"
                >
                    <option value="">-- Selecciona un libro --</option>
                    {libros.map(libro => (
                        <option key={libro} value={libro}>
                            {libro}
                        </option>
                    ))}
                </select>
                
                {libroSeleccionado && (
                    <div className="info-lugares">
                        {lugares.length} lugares en {libroSeleccionado}
                    </div>
                )}
            </div>

            <div id="map" style={{ height: "500px", width: "100%" }}></div>
        </div>
    );
}