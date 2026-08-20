import { HashRouter, Routes, Route } from "react-router";

import { DataProvider } from "./context/DataContext";

import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Resultados from "./pages/Resultados";
import Posiciones from "./pages/Posiciones";
import Estadisticas from "./pages/Estadisticas";
import Noticias from "./pages/Noticias";

function App() {
  return (
    <DataProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/resultados" element={<Resultados />} />
            <Route path="/posiciones" element={<Posiciones />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/noticias" element={<Noticias />} />
          </Route>
        </Routes>
      </HashRouter>
    </DataProvider>
  );
}

export default App;