import { useEffect, useState } from "react";

    export default function Versiculo () {
        const [verse, setVerse] = useState("")
        const [cita, setCita] = useState({})
        const [conclusion, setConclusion] = useState("")

        useEffect(() => {
            const saved = localStorage.getItem("conclusionDia");
            if (saved) setConclusion(saved);
        }, []);

        useEffect(()=> {
            fetch(`https://labs.bible.org/api/?passage=votd&type=json`)
            .then(res => res.json())
            .then(data => {
                setCita({book:`${data[0].bookname}`, chapter: `${data[0].chapter}`, verse: `${data[0].verse}`})
                setVerse(`${data[0].text}`)
            });
        },[])

        const handleChange = (e) => {
            const value = e.target.value;
            setConclusion(value);
            localStorage.setItem("conclusionDia", value);
        };


        return (
            <div>
                <h1>Versículo del Día</h1>
        <div class="container">
        <div class="versiculo-box">
            <div class="versiculo-texto" id="versiculo">
                {verse}
            </div>
            <div class="versiculo-cita" id="cita">
                — {cita.book} {cita.chapter}:{cita.verse}
            </div>
        </div>

        
        <div class="conclusion-box">
            <textarea placeholder="Escribí aquí tu reflexión final..." value={conclusion} onChange={handleChange}></textarea>
        </div>
    </div>
            </div>
        
        );
    };