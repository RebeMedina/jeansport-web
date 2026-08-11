import { useEffect, useState } from "react";
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

const jornadas = [...new Set(partidos.map((partido) => partido.jornada))].sort(
  (a, b) => a - b,
);

const obtenerJornadaActual = () => {
  const ahora = new Date();

  const jornadasFinalizadas = jornadas.filter((jornada) => {
    const partidosJornada = partidos.filter(
      (partido) => partido.jornada === jornada,
    );

    return partidosJornada.some((partido) => {
      const fechaPartido = new Date(`${partido.fecha}T23:59:59`);
      return fechaPartido <= ahora;
    });
  });

  if (jornadasFinalizadas.length > 0) {
    return jornadasFinalizadas[jornadasFinalizadas.length - 1];
  }

  return jornadas[0];
};

function Resultados() {
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState(
    obtenerJornadaActual(),
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [jornadaSeleccionada]);

  const partidosJornada = partidos.filter(
    (partido) => partido.jornada === jornadaSeleccionada,
  );

  const formatearFecha = (fecha) => {
    const [, mes, dia] = fecha.split("-");

    return `${dia}.${mes}`;
  };

  return (
    <>
      {" "}
      <section className="container page-hero">
        {" "}
        <span className="eyebrow">PARTIDOS</span>
        <h1>Resultados</h1>
        <p>Jornada {jornadaSeleccionada} Liga Promerica.</p>
      </section>
      <section className="container section">
        <div className="jornada-selector">
          <div className="jornada-selector-label">
            <span>JORNADA</span>
            <strong>Selecciona una jornada</strong>
          </div>

          <div className="jornada-select-wrapper">
            <select
              value={jornadaSeleccionada}
              onChange={(e) => setJornadaSeleccionada(Number(e.target.value))}
            >
              {jornadas.map((jornada) => (
                <option key={jornada} value={jornada}>
                  Jornada {jornada}
                </option>
              ))}
            </select>

            <span className="jornada-select-icon">⌄</span>
          </div>
        </div>

        <div className="resultados-container">
          {partidosJornada.map((partido) => {
            const nombreLocal = nombresEquipos[partido.local] || partido.local;

            const nombreVisitante =
              nombresEquipos[partido.visitante] || partido.visitante;

            const logoLocal = obtenerLogo(nombreLocal);
            const logoVisitante = obtenerLogo(nombreVisitante);

            return (
              <article className="resultado-card" key={partido.id}>
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
                    {partido.estado === "finalizado" ? (
                      <>
                        <strong className="marcador">
                          {partido.golesLocal} - {partido.golesVisitante}
                        </strong>

                        <span className="estado-partido">Finalizado</span>
                      </>
                    ) : (
                      <>
                        <strong className="marcador">{partido.hora}</strong>

                        <span className="estado-partido">Próximo partido</span>
                      </>
                    )}
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
    </>
  );
}

export default Resultados;
