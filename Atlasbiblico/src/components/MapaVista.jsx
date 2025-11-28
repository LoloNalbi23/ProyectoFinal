// MapaVista.jsx
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapaVista() {
    const containerRef = useRef(null); // referencia DOM del div del mapa
    const mapRef = useRef(null);       // instancia de L.Map
    const geojsonRef = useRef(null);   // capa GeoJSON para poder removerla

    useEffect(() => {
        // Si ya existe una instancia, no crear otra
        if (mapRef.current) return;

        // Crear mapa usando el nodo DOM (no por id string)
        mapRef.current = L.map(containerRef.current, {
            center: [31.5, 35.5],
            zoom: 7,
            preferCanvas: true
        });

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(mapRef.current);

        // Cargar GeoJSON
        fetch("/data/all.geojson")
            .then(res => res.json())
            .then(data => {
                // Si ya hay una capa previa, removerla
                if (geojsonRef.current) {
                    geojsonRef.current.remove();
                    geojsonRef.current = null;
                }

                geojsonRef.current = L.geoJSON(data, {
                    pointToLayer: (feature, latlng) =>
                        L.circleMarker(latlng, { radius: 4, fillOpacity: 0.8 }),
                    style: feature => ({
                        weight: 1,
                        opacity: 0.7
                    }),
                    onEachFeature: (feature, layer) => {
                        const name = feature.properties?.name || "Sin nombre";
                        const desc = feature.properties?.description || "";
                        layer.bindPopup(`<strong>${name}</strong><br/>${desc}`);
                    }
                }).addTo(mapRef.current);

                // Ajustar vista al bounds si hay features
                try {
                    const bounds = geojsonRef.current.getBounds();
                    if (bounds.isValid()) mapRef.current.fitBounds(bounds, { padding: [20, 20] });
                } catch (e) {
                    // ignore if no bounds
                }
            })
            .catch(err => {
                console.error("Error cargando all.geojson:", err);
            });

        // Cleanup: remover capa y mapa al desmontar
        return () => {
            if (geojsonRef.current) {
                geojsonRef.current.remove();
                geojsonRef.current = null;
            }
            if (mapRef.current) {
                mapRef.current.remove(); // libera el contenedor para evitar "already initialized"
                mapRef.current = null;
            }
        };
    }, []); // effect solo en mount/unmount

    // Nuevo estilo del contenedor → ancho 80% centrado
    return (
    <div
        ref={containerRef}
        style={{
            width: "60vw",      // ocupa todo el ancho de la ventana
            maxWidth: "100vw",   // no permitir restricciones del padre
            height: "80vh",
            margin: 0,
            padding: 0,
            position: "relative",
            left: "80%",
            right: "20%", // truco para forzar ancho total
            marginRight: "-50vw"
        }}
    />
);

}
