import { Link } from "react-router";
import { obtenerLogo } from "../data/equipos";
import { calcularGoleadores } from "../data/goleadores";
import { useAppData } from "../context/DataContext";

const nombresEquipos = {
  "san-carlos": "A.D. San Carlos",
  escorpiones: "Escorpiones F.C.",
  cartagines: "C.S. Cartaginés",
  "inter-sc": "Inter San Carlos",
  herediano: "C.S. Herediano",
  puntarenas: "Puntarenas F.C.",
  saprissa: "Deportivo Saprissa",
  "perez-zeledon": "Municipal Pérez Zeledón",
  sporting: "Sporting F.C.",
  alajuelense: "L.D. Alajuelense",
};

function StatsSection() {
  const {
    partidos,
    loadingPartidos,
    errorPartidos,
  } = useAppData();

  if (loadingPartidos) {
    return (
      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">GOLEADORES</span>
            <h2>Máximos goleadores</h2>
          </div>
        </div>
      </section>
    );
  }

  if (errorPartidos) {
    return (
      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">GOLEADORES</span>
            <h2>Máximos goleadores</h2>
          </div>
        </div>

        <p>No se pudieron cargar los goleadores.</p>
      </section>
    );
  }

  const goleadores = calcularGoleadores(partidos);

  const primerosCinco = goleadores.slice(0, 5);

  return (
    <section className="container section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">GOLEADORES</span>
          <h2>Máximos goleadores</h2>
        </div>

        <Link to="/estadisticas">Ver estadísticas →</Link>
      </div>

      <div className="tabla-wrap goleadores-wrap">
        <table className="tabla tabla-goleadores">
          <thead>
            <tr>
              <th>#</th>
              <th>Jugador</th>
              <th>Goles</th>
            </tr>
          </thead>

          <tbody>
            {primerosCinco.map((jugador, index) => {
              const nombreEquipo =
                nombresEquipos[jugador.equipo] || jugador.equipo;

              const logo = obtenerLogo(nombreEquipo);

              return (
                <tr key={jugador.id}>
                  <td>
                    <span className="goleador-posicion">
                      {index + 1}
                    </span>
                  </td>

                  <td className="goleador-info">
                    {logo && (
                      <img
                        src={logo}
                        alt={`Escudo de ${nombreEquipo}`}
                        className="goleador-foto"
                      />
                    )}

                    <div>
                      <div className="goleador-nombre">
                        {jugador.nombre}
                      </div>

                      <div className="goleador-equipo">
                        {nombreEquipo}
                      </div>
                    </div>
                  </td>

                  <td className="goleador-goles">
                    {jugador.goles}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default StatsSection;