import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Versiculo from "./pages/Versiculo";
// import BibleView from "../pages/BibleView";
// import Personajes from "../pages/Personajes";
// import Conexiones from "../pages/Conexiones";
// import MapView from "../pages/MapView";
// import NavBar from "../components/NavBar";

const AppRouter = () => {
  return (
    <Router>
      {/* <NavBar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/biblia/:libro/:capitulo" element={<BibleView />} />
        <Route path="/mapa/:lugar" element={<MapView />} />
        <Route path="/buscar/:query" element={<Personajes />} />
        <Route path="/favoritos" element={<Conexiones />} /> */}
        <Route path="votd" element={<Versiculo />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
