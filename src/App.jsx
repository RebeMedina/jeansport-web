
import { BrowserRouter, Routes, Route } from "react-router";

import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Resultados from "./pages/Resultados";
import Posiciones from "./pages/Posiciones";
import Goleadores from "./pages/Goleadores";
import Noticias from "./pages/Noticias";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/posiciones" element={<Posiciones />} />
          <Route path="/goleadores" element={<Goleadores />} />
          <Route path="/noticias" element={<Noticias />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
