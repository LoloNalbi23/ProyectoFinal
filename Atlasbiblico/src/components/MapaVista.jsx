import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapaVista() {
    const [geoData, setGeoData] = useState([]);

    useEffect(() => {
        const map = L.map("map").setView([31.7, 35.2], 7);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
        }).addTo(map);

        async function loadAll() {
            try {
                const indexResp = await fetch("/data/index.json");
                const index = await indexResp.json();

                const layers = [];

                for (const categoria of Object.keys(index)) {
                    const files = index[categoria];

                    for (const file of files) {
                        const resp = await fetch(`/${file}`);
                        const geojson = await resp.json();

                        layers.push({ categoria, data: geojson });

                        // dibujar directamente en el mapa
                        L.geoJSON(geojson, {
                            pointToLayer: (feature, latlng) => {
                                const icon = L.icon({
                                    iconUrl: feature.properties.icon,
                                    iconSize: [
                                        32 * (feature.properties["icon-scale"] || 1),
                                        32 * (feature.properties["icon-scale"] || 1),
                                    ],
                                });
                                return L.marker(latlng, { icon });
                            },
                            onEachFeature: (feature, layer) => {
                                layer.bindPopup(`
                                    <b>${feature.properties.name}</b><br>
                                    ${feature.properties.description || ""}
                                    <br><i>${categoria}</i>
                                `);
                            },
                        }).addTo(map);
                    }
                }

                setGeoData(layers);
            } catch (err) {
                console.error("Error cargando geojson:", err);
            }
        }

        loadAll();

        return () => map.remove();
    }, []);

    return (
        <div
            id="map"
            style={{ height: "100vh", width: "100%" }}
        ></div>
    );
}
