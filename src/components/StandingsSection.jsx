import { obtenerLogo } from "../data/equipos";
import { partidos } from "../data/partidos";

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

const equipos = Object.keys(nombresEquipos);

function StandingsSection() {
  const partidosFinalizados = partidos.filter(
    (partido) => partido.estado === "finalizado",
  );

  const tabla = equipos.map((equipo) => {
    const partidosEquipo = partidosFinalizados.filter(
      (partido) => partido.local === equipo || partido.visitante === equipo,
    );

    let jugados = 0;
    let ganados = 0;
    let empatados = 0;
    let perdidos = 0;

    partidosEquipo.forEach((partido) => {
      const esLocal = partido.local === equipo;

      const golesEquipo = esLocal ? partido.golesLocal : partido.golesVisitante;

      const golesRival = esLocal ? partido.golesVisitante : partido.golesLocal;

      if (typeof golesEquipo !== "number" || typeof golesRival !== "number") {
        return;
      }

      jugados++;

      if (golesEquipo > golesRival) {
        ganados++;
      } else if (golesEquipo === golesRival) {
        empatados++;
      } else {
        perdidos++;
      }
    });

    const puntos = ganados * 3 + empatados;

    return {
      equipo,
      nombre: nombresEquipos[equipo],
      jugados,
      ganados,
      empatados,
      perdidos,
      puntos,
    };
  });

  tabla.sort((a, b) => {
    if (a.puntos !== b.puntos) {
      return b.puntos - a.puntos;
    }

    if (a.ganados !== b.ganados) {
      return b.ganados - a.ganados;
    }

    return a.nombre.localeCompare(b.nombre);
  });

  const primerosCinco = tabla.slice(0, 5);

  return (
    <section className="container section">
      {" "}
      <div className="section-heading">
        {" "}
        <div>
          {" "}
          <span className="eyebrow">CLASIFICACIÓN</span>{" "}
          <h2>Tabla de posiciones</h2>{" "}
        </div>
        <a href="/posiciones">Tabla completa →</a>
      </div>
      <div className="table-wrap posiciones-wrap">
        <table className="tabla tabla-posiciones standings-home">
          <thead>
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th>PJ</th>
              <th>G</th>
              <th>E</th>
              <th>P</th>
              <th>PTS</th>
            </tr>
          </thead>

          <tbody>
            {primerosCinco.map((equipo, index) => {
              const logo = obtenerLogo(equipo.nombre);

              return (
                <tr key={equipo.equipo}>
                  <td>
                    <span className="posicion">{index + 1}</span>
                  </td>

                  <td className="club-cell">
                    {logo && (
                      <img
                        src={logo}
                        alt={`Escudo de ${equipo.nombre}`}
                        className="tabla-logo standings-logo"
                      />
                    )}

                    <strong>{equipo.nombre}</strong>
                  </td>

                  <td>{equipo.jugados}</td>
                  <td>{equipo.ganados}</td>
                  <td>{equipo.empatados}</td>
                  <td>{equipo.perdidos}</td>

                  <td className="puntos">
                    <strong>{equipo.puntos}</strong>
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

export default StandingsSection;
