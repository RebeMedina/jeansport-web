import { useEffect, useState } from "react";

import { obtenerLogo } from "../data/equipos";

import { jugadoresPorId } from "../data/jugadores";

import { obtenerEstadoPartido } from "../data/estadoPartido";

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

/*
 * ============================================================
 * JORNADA ACTUAL
 * ============================================================
 */

function obtenerJornadaActual(partidos, jornadas) {
  if (!partidos.length || !jornadas.length) {
    return null;
  }

  const ahora = new Date();

  const jornadasOrdenadas = [...jornadas].sort((a, b) => a - b);

  let jornadaActual = jornadasOrdenadas[0];

  for (const jornada of jornadasOrdenadas) {
    const partidosJornada = partidos.filter(
      (partido) => partido.jornada === jornada,
    );

    if (partidosJornada.length === 0) {
      continue;
    }

    const fechas = partidosJornada
      .map((partido) => {
        if (!partido.fecha) {
          return NaN;
        }

        const fecha = String(partido.fecha).split("T")[0];

        const [anio, mes, dia] = fecha.split("-").map(Number);

        if (!anio || !mes || !dia) {
          return NaN;
        }

        return new Date(anio, mes - 1, dia, 0, 0, 0, 0).getTime();
      })
      .filter((fecha) => !Number.isNaN(fecha));

    if (fechas.length === 0) {
      continue;
    }

    const fechaInicio = Math.min(...fechas);

    if (fechaInicio <= ahora.getTime()) {
      jornadaActual = jornada;
    }
  }

  return jornadaActual;
}

/*
 * ============================================================
 * DETALLE DE GOLES
 * ============================================================
 */

function obtenerDetalleGoles(partido, lado) {
  const detalle =
    lado === "local"
      ? partido.golesLocalDetalle
      : partido.golesVisitanteDetalle;

  return (detalle || [])
    .map((gol) => {
      const jugador = gol.jugadorId ? jugadoresPorId[gol.jugadorId] : null;

      return {
        ...gol,
        nombre: jugador ? jugador.nombre : "Gol",
      };
    })
    .sort((a, b) => (a.minuto || 0) - (b.minuto || 0));
}

/*
 * ============================================================
 * FILA DE GOLES
 * ============================================================
 */

function FilaGoles({ golesLocal, golesVisitante }) {
  const filas = Math.max(golesLocal.length, golesVisitante.length);

  if (filas === 0) {
    return null;
  }

  return (
    <div className="goles-filas">
      {Array.from({
        length: filas,
      }).map((_, index) => {
        const golLocal = golesLocal[index];

        const golVisitante = golesVisitante[index];

        return (
          <div className="goles-fila" key={index}>
            <div className="goles-lado goles-lado-local">
              {golLocal && (
                <>
                  <span className="gol-nombre">
                    {golLocal.nombre}

                    {golLocal.propia && (
                      <span className="gol-propia"> (AG)</span>
                    )}
                  </span>

                  <span className="gol-minuto">{golLocal.minuto}'</span>
                </>
              )}
            </div>

            <img
              src="https://cdn-icons-png.flaticon.com/512/7965/7965127.png"
              alt=""
              className="gol-icono"
              width="12"
              height="12"
            />

            <div className="goles-lado goles-lado-visitante">
              {golVisitante && (
                <>
                  <span className="gol-nombre">
                    {golVisitante.nombre}

                    {golVisitante.propia && (
                      <span className="gol-propia"> (AG)</span>
                    )}
                  </span>

                  <span className="gol-minuto">{golVisitante.minuto}'</span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/*
 * ============================================================
 * RESULTADOS
 * ============================================================
 */

function Resultados() {
  const { partidos, loadingPartidos, errorPartidos } = useAppData();

  const [jornadaSeleccionada, setJornadaSeleccionada] = useState(null);

  const [paginaInicializada, setPaginaInicializada] = useState(false);

  /*
   * Recalcula los estados automáticamente.
   */

  const [, forzarActualizacion] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      forzarActualizacion((valor) => valor + 1);
    }, 5000);

    return () => {
      clearInterval(intervalo);
    };
  }, []);

  /*
   * ============================================================
   * JORNADAS DISPONIBLES
   * ============================================================
   */

  const jornadas = [
    ...new Set(
      partidos
        .map((partido) => partido.jornada)
        .filter((jornada) => Number.isFinite(jornada)),
    ),
  ].sort((a, b) => a - b);

  /*
   * ============================================================
   * CALCULAR JORNADA ACTUAL
   * ============================================================
   */

  const jornadaActual =
    jornadas.length > 0 ? obtenerJornadaActual(partidos, jornadas) : null;

  /*
   * Seleccionamos automáticamente la jornada actual
   * UNA SOLA VEZ cuando la página recibe los datos.
   *
   * Después el usuario tiene control total del selector.
   */

  useEffect(() => {
    if (paginaInicializada || jornadaActual === null) {
      return;
    }

    setJornadaSeleccionada(jornadaActual);

    setPaginaInicializada(true);
  }, [jornadaActual, paginaInicializada]);

  /*
   * Si por alguna razón la jornada seleccionada ya
   * no existe en los datos, seleccionamos una válida.
   *
   * Esto NO obliga al usuario a volver a la jornada actual.
   */

  useEffect(() => {
    if (jornadaSeleccionada === null || jornadas.length === 0) {
      return;
    }

    if (!jornadas.includes(jornadaSeleccionada)) {
      setJornadaSeleccionada(jornadas[0]);
    }
  }, [jornadas, jornadaSeleccionada]);

  /*
   * Scroll al cambiar manualmente de jornada.
   */

  useEffect(() => {
    if (jornadaSeleccionada === null) {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [jornadaSeleccionada]);

  /*
   * ============================================================
   * CARGANDO
   * ============================================================
   */

  if (loadingPartidos && partidos.length === 0) {
    return (
      <section className="container section">
        <p>Cargando resultados...</p>
      </section>
    );
  }

  if (errorPartidos && partidos.length === 0) {
    return (
      <section className="container section">
        <p>No se pudieron cargar los resultados. Intenta de nuevo más tarde.</p>
      </section>
    );
  }

  if (jornadaSeleccionada === null) {
    return (
      <section className="container section">
        <p>Cargando resultados...</p>
      </section>
    );
  }

  /*
   * ============================================================
   * PARTIDOS DE LA JORNADA
   * ============================================================
   */

  const partidosJornada = partidos.filter(
    (partido) => partido.jornada === jornadaSeleccionada,
  );

  function formatearFecha(fecha) {
    if (!fecha) {
      return "";
    }

    const fechaLimpia = String(fecha).split("T")[0];

    const partes = fechaLimpia.split("-");

    if (partes.length !== 3) {
      return "";
    }

    const [, mes, dia] = partes;

    if (!mes || !dia) {
      return "";
    }

    return `${dia}.${mes}`;
  }

  return (
    <>
      <section className="container page-hero">
        <span className="eyebrow">PARTIDOS</span>

        <h1>Resultados</h1>

        <p>Jornada {jornadaActual} Liga Promerica.</p>
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

            const estado = obtenerEstadoPartido(partido);

            const tieneGoles =
              typeof partido.golesLocal === "number" &&
              typeof partido.golesVisitante === "number";

            const mostrarGoles =
              !partido.walkover &&
              (estado === "finalizado" || estado === "en-curso");

            const golesLocal = mostrarGoles
              ? obtenerDetalleGoles(partido, "local")
              : [];

            const golesVisitante = mostrarGoles
              ? obtenerDetalleGoles(partido, "visitante")
              : [];

            return (
              <article
                className={`resultado-card ${
                  estado === "en-curso" ? "resultado-card-en-vivo" : ""
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
                    {logoLocal && (
                      <img
                        className="equipo-logo"
                        src={logoLocal}
                        alt={`Escudo de ${nombreLocal}`}
                      />
                    )}

                    <strong className="equipo-nombre">{nombreLocal}</strong>
                  </div>

                  <div className="resultado-marcador">
                    {estado === "finalizado" && (
                      <>
                        <strong className="marcador">
                          {partido.golesLocal}
                          {" - "}
                          {partido.golesVisitante}
                        </strong>

                        <span className="estado-partido">Finalizado</span>
                      </>
                    )}

                    {estado === "en-curso" && (
                      <>
                        <strong className="marcador">
                          {tieneGoles
                            ? `${partido.golesLocal} - ${partido.golesVisitante}`
                            : "0 - 0"}
                        </strong>

                        <span className="estado-partido estado-en-vivo">
                          ● En vivo
                        </span>
                      </>
                    )}

                    {estado === "proximo" && (
                      <>
                        <strong className="marcador">
                          {partido.hora || "--:--"}
                        </strong>

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

                {mostrarGoles &&
                  (golesLocal.length > 0 || golesVisitante.length > 0) && (
                    <div className="resultado-goles">
                      <FilaGoles
                        golesLocal={golesLocal}
                        golesVisitante={golesVisitante}
                      />
                    </div>
                  )}
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default Resultados;
