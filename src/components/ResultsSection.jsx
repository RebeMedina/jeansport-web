import { Link } from "react-router";
import { partidos } from "../data/partidos";
import { obtenerLogo } from "../data/equipos";
import { obtenerEstadoPartido } from "../data/estadoPartido";

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

const jornadas = [...new Set(partidos.map((partido) => partido.jornada))].sort(
  (a, b) => a - b,
);

const obtenerJornadaActual = () => {
  const ahora = new Date();

  const jornadasIniciadas = jornadas.filter((jornada) => {
    const fechasJornada = partidos
      .filter((partido) => partido.jornada === jornada)
      .map((partido) => new Date(`${partido.fecha}T00:00:00`).getTime());

    const fechaInicio = new Date(Math.min(...fechasJornada));

    return fechaInicio <= ahora;
  });

  if (jornadasIniciadas.length > 0) {
    return jornadasIniciadas[jornadasIniciadas.length - 1];
  }

  return jornadas[0];
};

function ResultsSection() {
  const jornadaActual = obtenerJornadaActual();

  const partidosConEstado = partidos
    .filter((partido) => partido.jornada === jornadaActual)
    .map((partido) => ({
      ...partido,
      estadoReal: obtenerEstadoPartido(partido),
    }))
    .filter(
      (partido) =>
        partido.estadoReal === "finalizado" ||
        partido.estadoReal === "en-curso",
    )
    .sort((a, b) => {
      const fechaHoraA = new Date(`${a.fecha}T${a.hora || "00:00"}:00`);
      const fechaHoraB = new Date(`${b.fecha}T${b.hora || "00:00"}:00`);
      return fechaHoraB - fechaHoraA; // más reciente jugado primero
    })
    .slice(0, 3);

  const formatearFecha = (fecha) => {
    const [, mes, dia] = fecha.split("-");
    return `${dia}.${mes}`;
  };

  return (
    <section className="container section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">COSTA RICA</span>
          <h2>Resultados recientes</h2>
        </div>

        <Link to="/resultados" className="section-link">
          Ver resultados →
        </Link>
      </div>

      <div className="resultados-container">
        {partidosConEstado.map((partido) => {
          const nombreLocal = nombresEquipos[partido.local] || partido.local;
          const nombreVisitante =
            nombresEquipos[partido.visitante] || partido.visitante;

          const logoLocal = obtenerLogo(nombreLocal);
          const logoVisitante = obtenerLogo(nombreVisitante);

          const tieneGoles =
            typeof partido.golesLocal === "number" &&
            typeof partido.golesVisitante === "number";

          return (
            <article
              className={`resultado-card ${
                partido.estadoReal === "en-curso"
                  ? "resultado-card-en-vivo"
                  : ""
              }`}
              key={partido.id}
            >
              <div className="resultado-header">
                <span className="resultado-fecha">
                  {formatearFecha(partido.fecha)}
                </span>

                <span>Jornada {partido.jornada}</span>
              </div>

              <div className="resultado-partido">
                <div className="equipo equipo-local">
                  <strong className="equipo-nombre">{nombreLocal}</strong>

                  {logoLocal && (
                    <img
                      className="equipo-logo"
                      src={logoLocal}
                      alt={`Escudo de ${nombreLocal}`}
                    />
                  )}
                </div>

                <div className="resultado-marcador">
                  <strong className="marcador">
                    {tieneGoles
                      ? `${partido.golesLocal} - ${partido.golesVisitante}`
                      : "0 - 0"}
                  </strong>

                  <span
                    className={`estado-partido ${
                      partido.estadoReal === "en-curso" ? "estado-en-vivo" : ""
                    }`}
                  >
                    {partido.estadoReal === "en-curso"
                      ? "● En vivo"
                      : "Finalizado"}
                  </span>
                </div>

                <div className="equipo equipo-visitante">
                  {logoVisitante && (
                    <img
                      className="equipo-logo"
                      src={logoVisitante}
                      alt={`Escudo de ${nombreVisitante}`}
                    />
                  )}

                  <strong className="equipo-nombre">{nombreVisitante}</strong>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ResultsSection;
