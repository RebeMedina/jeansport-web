import { BrowserRouter, Routes, Route } from "react-router";

import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Resultados from "./pages/Resultados";

function App() {
  return (
    <BrowserRouter>
      {" "}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/resultados" element={<Resultados />} />{" "}
        </Route>{" "}
      </Routes>{" "}
    </BrowserRouter>
  );
}

export default App;
