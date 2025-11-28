import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";
import Home from "./pages/Home";
import Versiculo from "./pages/Versiculo";
import NavBar from "./components/NavBar";
import Mapview from "./pages/Mapview";
import "./index.css"
// import Personajes from "../pages/Personajes";
// import Conexiones from "../pages/Conexiones";
// import MapView from "../pages/MapView";

// import AppRouter from "./AppRouter";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <AppRouter />
//   </React.StrictMode>

const Main = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/map" element={<Mapview />} />
        {/*<Route path="/mapa/:lugar" element={<MapView />} />
        <Route path="/buscar/:query" element={<Personajes />} />
        <Route path="/favoritos" element={<Conexiones />} /> */}
        <Route path="votd" element={<Versiculo />} />
        
      </Routes>
    </Router>
  );
};

export default Main;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
)