import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Versiculo from "./pages/Versiculo.jsx";
// import BibleView from "../pages/BibleView";
// import Personajes from "../pages/Personajes";
// import Conexiones from "../pages/Conexiones";
import MapaVista from "./components/MapaVista.jsx";
// import NavBar from "../components/NavBar";

const AppRouter = () => {
  return (
    <Router>
      {/* <NavBar /> */}
      <Routes>
        
        <Route path="/" element={<Versiculo />} />
        <Route path="/mapa/:lugar" element={<MapaVista />} />
        {/* <Route path="/biblia/:libro/:capitulo" element={<BibleView />} />
        
        <Route path="/buscar/:query" element={<Personajes />} />
        <Route path="/favoritos" element={<Conexiones />} /> */}
        <Route path="votd" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
