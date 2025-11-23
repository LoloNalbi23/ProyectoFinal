import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapaVista() {

    useEffect(() => {
        const map = L.map("map").setView([31.7, 35.2], 7);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
        }).addTo(map);

        fetch("/data/ejemplo.geojson")   // ← RUTA CORREGIDA
            .then(res => res.json())
            .then(data => {

                L.geoJSON(data, {
                    pointToLayer: (feature, latlng) => {
                        const icon = L.icon({
                            iconUrl: feature.properties.icon,
                            iconSize: [
                                32 * (feature.properties["icon-scale"] || 1),
                                32 * (feature.properties["icon-scale"] || 1)
                            ]
                        });
                        return L.marker(latlng, { icon });
                    },

                    onEachFeature: (feature, layer) => {
                        layer.bindPopup(`
                            <b>${feature.properties.name}</b><br>
                            ${feature.properties.description || ""}
                        `);
                    }
                }).addTo(map);

            })
            .catch(err => console.error("Error cargando el geojson:", err));

        return () => map.remove();
    }, []);

    return (
        <div
            id="map"
            style={{ height: "100vh", width: "100%" }}
        ></div>
    );
}
