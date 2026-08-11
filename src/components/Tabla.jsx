import Tabla from "../components/Tabla";
import { obtenerLogo } from "../data/equipos";

function Posiciones({ equipos }) {
  const columnas = [
    {
      key: "posicion",
      label: "#",
      render: (_, index) => index + 1,
    },
    {
      key: "equipo",
      label: "Equipo",
      render: (equipo) => {
        const logo = obtenerLogo(equipo.nombre);

        return (
          <div className="club-cell">
            <span className="posicion">{equipo.posicion}</span>

            {logo && (
              <img
                src={logo}
                alt={`Escudo de ${equipo.nombre}`}
                className="tabla-logo"
              />
            )}

            <strong>{equipo.nombre}</strong>
          </div>
        );
      },
    },
    {
      key: "pj",
      label: "PJ",
    },
    {
      key: "pg",
      label: "PG",
    },
    {
      key: "pe",
      label: "PE",
    },
    {
      key: "pp",
      label: "PP",
    },
    {
      key: "gf",
      label: "GF",
    },
    {
      key: "gc",
      label: "GC",
    },
    {
      key: "dg",
      label: "DG",
    },
    {
      key: "puntos",
      label: "Pts",
    },
  ];

  return (
    <>
      <section className="container page-hero">
        <span className="eyebrow">CLASIFICACIÓN</span>

        <h1>Tabla de posiciones</h1>

        <p>Clasificación actual de la Liga Promerica.</p>
      </section>

      <section className="container section">
        <Tabla columnas={columnas} datos={equipos} tipo="posiciones" />
      </section>
    </>
  );
}

export default Posiciones;
