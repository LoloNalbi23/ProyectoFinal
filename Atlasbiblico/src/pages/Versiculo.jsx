import { useEffect, useState } from "react";
import "../css/Versiculo.css";

    export default function Versiculo () {
        const [conclusion, setConclusion] = useState("")

        useEffect(() => {
            const saved = localStorage.getItem("conclusionDia");
            if (saved) setConclusion(saved);
        }, []);

        const handleChange = (e) => {
            const value = e.target.value;
            setConclusion(value);
            localStorage.setItem("conclusionDia", value);
        };


        return (
            <div>
                <h1>Versículo del Día</h1>
                <div class="container">
                    <div id="dailyVersesWrapper">
                    <script async defer src="https://dailyverses.net/get/verse.js?language=nvi"></script>
                </div>

        
        <div class="conclusion-box">
            <textarea placeholder="Escribí aquí tu reflexión final..." value={conclusion} onChange={handleChange}></textarea>
        </div>
    </div>
            </div>
        
        );
    };