import { useState } from "react";
import { obtenerLogo } from "../data/equipos";
import { calcularGoleadores } from "../data/goleadores";
import { useAppData } from "../context/DataContext";
import EquipoJornada from "../components/EquipoJornada";

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

/*
 * ============================================================
 * DETERMINAR SI UN PARTIDO YA TIENE RESULTADO
 * ============================================================
 *
 * Para estadísticas y tabla:
 * - Ambos goles deben existir.
 * - Deben ser números válidos.
 *
 * Esto evita depender de la hora para decidir si el resultado
 * debe entrar en las estadísticas.
 */

function tieneResultado(partido) {
  if (!partido) {
    return false;
  }

  return (
    typeof partido.golesLocal === "number" &&
    !Number.isNaN(partido.golesLocal) &&
    typeof partido.golesVisitante === "number" &&
    !Number.isNaN(partido.golesVisitante)
  );
}

/*
 * ============================================================
 * COMPONENTE
 * ============================================================
 */

function Estadisticas() {
  const { partidos, loadingPartidos, errorPartidos } = useAppData();

  const [tipoAtaque, setTipoAtaque] = useState("general");
  const [tipoDefensa, setTipoDefensa] = useState("general");

  /*
   * ============================================================
   * ESTADOS DE CARGA
   * ============================================================
   */

  if (loadingPartidos) {
    return (
      <section className="container section">
        <p>Cargando estadísticas...</p>
      </section>
    );
  }

  if (errorPartidos) {
    return (
      <section className="container section">
        <p>
          No se pudieron cargar las estadísticas. Intenta de nuevo más tarde.
        </p>
      </section>
    );
  }

  /*
   * ============================================================
   * VALIDACIÓN
   * ============================================================
   */

  if (!Array.isArray(partidos)) {
    return (
      <section className="container section">
        <p>No hay datos de partidos disponibles.</p>
      </section>
    );
  }

  /*
   * ============================================================
   * PARTIDOS CON RESULTADO
   * ============================================================
   *
   * IMPORTANTE:
   * No dependemos de obtenerEstadoPartido().
   *
   * Si Google Sheets tiene:
   *
   * golesLocal = 3
   * golesVisitante = 0
   *
   * el partido cuenta para estadísticas.
   *
   * Esto hace que la tabla y las estadísticas utilicen los mismos
   * datos reales de Google Sheets.
   */

  const partidosJugados = partidos.filter((partido) => tieneResultado(partido));

  /*
   * ============================================================
   * GOLEADORES
   * ============================================================
   */

  const goleadores = calcularGoleadores(partidosJugados);

  const primerosCincoGoleadores = goleadores.slice(0, 5);

  /*
   * ============================================================
   * ESTADÍSTICAS DE EQUIPOS
   * ============================================================
   */

  const estadisticasEquipos = {};

  equipos.forEach((equipo) => {
    estadisticasEquipos[equipo] = {
      equipo,

      partidos: 0,
      partidosLocal: 0,
      partidosVisitante: 0,

      victorias: 0,
      empates: 0,
      derrotas: 0,

      victoriasLocal: 0,
      empatesLocal: 0,
      derrotasLocal: 0,

      victoriasVisitante: 0,
      empatesVisitante: 0,
      derrotasVisitante: 0,

      puntos: 0,
      puntosLocal: 0,
      puntosVisitante: 0,

      golesFavor: 0,
      golesContra: 0,

      golesLocal: 0,
      golesVisitante: 0,

      golesContraLocal: 0,
      golesContraVisitante: 0,

      porteriasCero: 0,
      porteriasCeroLocal: 0,
      porteriasCeroVisitante: 0,
    };
  });

  /*
   * ============================================================
   * PROCESAR TODOS LOS PARTIDOS JUGADOS
   * ============================================================
   */

  partidosJugados.forEach((partido) => {
    const local = estadisticasEquipos[partido.local];
    const visitante = estadisticasEquipos[partido.visitante];

    if (!local || !visitante) {
      return;
    }

    const golesLocal = Number(partido.golesLocal);
    const golesVisitante = Number(partido.golesVisitante);

    if (Number.isNaN(golesLocal) || Number.isNaN(golesVisitante)) {
      return;
    }

    /*
     * ==========================================================
     * PARTIDOS JUGADOS
     * ==========================================================
     */

    local.partidos++;
    visitante.partidos++;

    local.partidosLocal++;
    visitante.partidosVisitante++;

    /*
     * ==========================================================
     * GOLES GENERALES
     * ==========================================================
     */

    local.golesFavor += golesLocal;
    local.golesContra += golesVisitante;

    visitante.golesFavor += golesVisitante;
    visitante.golesContra += golesLocal;

    /*
     * ==========================================================
     * GOLES COMO LOCAL
     * ==========================================================
     */

    local.golesLocal += golesLocal;
    local.golesContraLocal += golesVisitante;

    /*
     * ==========================================================
     * GOLES COMO VISITANTE
     * ==========================================================
     */

    visitante.golesVisitante += golesVisitante;
    visitante.golesContraVisitante += golesLocal;

    /*
     * ==========================================================
     * PORTERÍAS A CERO
     * ==========================================================
     */

    if (golesVisitante === 0) {
      local.porteriasCero++;
      local.porteriasCeroLocal++;
    }

    if (golesLocal === 0) {
      visitante.porteriasCero++;
      visitante.porteriasCeroVisitante++;
    }

    /*
     * ==========================================================
     * RESULTADO
     * ==========================================================
     */

    if (golesLocal > golesVisitante) {
      /*
       * Victoria local
       */

      local.victorias++;
      local.victoriasLocal++;

      visitante.derrotas++;
      visitante.derrotasVisitante++;

      local.puntos += 3;
      local.puntosLocal += 3;
    } else if (golesLocal < golesVisitante) {
      /*
       * Victoria visitante
       */

      visitante.victorias++;
      visitante.victoriasVisitante++;

      local.derrotas++;
      local.derrotasLocal++;

      visitante.puntos += 3;
      visitante.puntosVisitante += 3;
    } else {
      /*
       * Empate
       */

      local.empates++;
      local.empatesLocal++;

      visitante.empates++;
      visitante.empatesVisitante++;

      local.puntos++;
      visitante.puntos++;

      local.puntosLocal++;
      visitante.puntosVisitante++;
    }
  });

  /*
   * ============================================================
   * PREPARAR ESTADÍSTICAS
   * ============================================================
   */

  const estadisticas = Object.values(estadisticasEquipos).map((equipo) => ({
    ...equipo,

    nombre: nombresEquipos[equipo.equipo] || equipo.equipo,

    diferencia: equipo.golesFavor - equipo.golesContra,

    diferenciaLocal: equipo.golesLocal - equipo.golesContraLocal,

    diferenciaVisitante: equipo.golesVisitante - equipo.golesContraVisitante,

    promedio: equipo.partidos > 0 ? equipo.golesFavor / equipo.partidos : 0,

    promedioLocal:
      equipo.partidosLocal > 0 ? equipo.golesLocal / equipo.partidosLocal : 0,

    promedioVisitante:
      equipo.partidosVisitante > 0
        ? equipo.golesVisitante / equipo.partidosVisitante
        : 0,

    promedioContra:
      equipo.partidos > 0 ? equipo.golesContra / equipo.partidos : 0,

    promedioContraLocal:
      equipo.partidosLocal > 0
        ? equipo.golesContraLocal / equipo.partidosLocal
        : 0,

    promedioContraVisitante:
      equipo.partidosVisitante > 0
        ? equipo.golesContraVisitante / equipo.partidosVisitante
        : 0,
  }));

  /*
   * ============================================================
   * ATAQUE
   * ============================================================
   */

  const equiposAtaque = [...estadisticas].sort((a, b) => {
    if (tipoAtaque === "local") {
      return (
        b.golesLocal - a.golesLocal ||
        b.promedioLocal - a.promedioLocal ||
        a.nombre.localeCompare(b.nombre)
      );
    }

    if (tipoAtaque === "visitante") {
      return (
        b.golesVisitante - a.golesVisitante ||
        b.promedioVisitante - a.promedioVisitante ||
        a.nombre.localeCompare(b.nombre)
      );
    }

    return (
      b.golesFavor - a.golesFavor ||
      b.promedio - a.promedio ||
      a.nombre.localeCompare(b.nombre)
    );
  });

  const tituloAtaque =
    tipoAtaque === "local"
      ? "Mejor ataque como local"
      : tipoAtaque === "visitante"
        ? "Mejor ataque como visitante"
        : "Mejor ataque del torneo";

  const descripcionAtaque =
    tipoAtaque === "local"
      ? "Los equipos que más goles han marcado jugando en casa."
      : tipoAtaque === "visitante"
        ? "Los equipos que más goles han marcado fuera de casa."
        : "Los equipos con mayor producción ofensiva.";

  /*
   * ============================================================
   * DEFENSA
   * ============================================================
   */

  const equiposDefensa = [...estadisticas].sort((a, b) => {
    if (tipoDefensa === "local") {
      return (
        a.golesContraLocal - b.golesContraLocal ||
        b.porteriasCeroLocal - a.porteriasCeroLocal ||
        a.nombre.localeCompare(b.nombre)
      );
    }

    if (tipoDefensa === "visitante") {
      return (
        a.golesContraVisitante - b.golesContraVisitante ||
        b.porteriasCeroVisitante - a.porteriasCeroVisitante ||
        a.nombre.localeCompare(b.nombre)
      );
    }

    return (
      a.golesContra - b.golesContra ||
      b.porteriasCero - a.porteriasCero ||
      a.nombre.localeCompare(b.nombre)
    );
  });

  const tituloDefensa =
    tipoDefensa === "local"
      ? "Mejor defensa como local"
      : tipoDefensa === "visitante"
        ? "Mejor defensa como visitante"
        : "Mejor defensa del torneo";

  const descripcionDefensa =
    tipoDefensa === "local"
      ? "Los equipos que menos goles han recibido en casa."
      : tipoDefensa === "visitante"
        ? "Los equipos que menos goles han recibido fuera de casa."
        : "Los equipos que menos goles han recibido en el torneo.";

  /*
   * ============================================================
   * LÍDERES ESTADÍSTICOS
   * ============================================================
   */

  const mejorRendimiento = [...estadisticas].sort(
    (a, b) =>
      b.puntos - a.puntos ||
      b.diferencia - a.diferencia ||
      b.golesFavor - a.golesFavor ||
      b.victorias - a.victorias ||
      a.nombre.localeCompare(b.nombre),
  )[0];

  const mejorAtaque = [...estadisticas].sort(
    (a, b) =>
      b.golesFavor - a.golesFavor ||
      b.promedio - a.promedio ||
      a.nombre.localeCompare(b.nombre),
  )[0];

  const mejorDefensa = [...estadisticas].sort(
    (a, b) =>
      a.golesContra - b.golesContra ||
      b.porteriasCero - a.porteriasCero ||
      a.nombre.localeCompare(b.nombre),
  )[0];

  const mejorDiferencia = [...estadisticas].sort(
    (a, b) =>
      b.diferencia - a.diferencia ||
      b.golesFavor - a.golesFavor ||
      a.nombre.localeCompare(b.nombre),
  )[0];

  const mejorPorteria = [...estadisticas].sort(
    (a, b) =>
      b.porteriasCero - a.porteriasCero ||
      a.golesContra - b.golesContra ||
      a.nombre.localeCompare(b.nombre),
  )[0];

  /*
   * ============================================================
   * ESTADÍSTICAS GENERALES DEL TORNEO
   * ============================================================
   */

  const totalGoles = partidosJugados.reduce(
    (total, partido) =>
      total + Number(partido.golesLocal) + Number(partido.golesVisitante),
    0,
  );

  const totalGolesLocal = partidosJugados.reduce(
    (total, partido) => total + Number(partido.golesLocal),
    0,
  );

  const totalGolesVisitante = partidosJugados.reduce(
    (total, partido) => total + Number(partido.golesVisitante),
    0,
  );

  const promedioGoles =
    partidosJugados.length > 0 ? totalGoles / partidosJugados.length : 0;

  const promedioGolesLocal =
    partidosJugados.length > 0 ? totalGolesLocal / partidosJugados.length : 0;

  const promedioGolesVisitante =
    partidosJugados.length > 0
      ? totalGolesVisitante / partidosJugados.length
      : 0;

  /*
   * ============================================================
   * MAYOR GOLEADA
   * ============================================================
   */

  const mayorGoleada =
    partidosJugados.length > 0
      ? [...partidosJugados].sort((a, b) => {
          const diferenciaA = Math.abs(
            Number(a.golesLocal) - Number(a.golesVisitante),
          );

          const diferenciaB = Math.abs(
            Number(b.golesLocal) - Number(b.golesVisitante),
          );

          if (diferenciaA !== diferenciaB) {
            return diferenciaB - diferenciaA;
          }

          return (
            Number(b.golesLocal) +
            Number(b.golesVisitante) -
            (Number(a.golesLocal) + Number(a.golesVisitante))
          );
        })[0]
      : null;

  /*
   * ============================================================
   * PARTIDO CON MÁS GOLES
   * ============================================================
   */

  const partidoMasGoles =
    partidosJugados.length > 0
      ? [...partidosJugados].sort(
          (a, b) =>
            Number(b.golesLocal) +
            Number(b.golesVisitante) -
            (Number(a.golesLocal) + Number(a.golesVisitante)),
        )[0]
      : null;

  /*
   * ============================================================
   * LOGO
   * ============================================================
   */

  const LogoEquipo = ({ equipo }) => {
    if (!equipo) {
      return null;
    }

    const logo = obtenerLogo(equipo);

    if (!logo) {
      return null;
    }

    return (
      <img
        src={logo}
        alt={`Escudo de ${nombresEquipos[equipo] || equipo}`}
        className="goleador-foto"
        referrerPolicy="no-referrer"
      />
    );
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      {/* ======================================================
          ENCABEZADO
          ====================================================== */}

      <section className="container page-hero">
        <span className="eyebrow">ESTADÍSTICAS</span>

        <h1>Estadísticas del torneo</h1>

        <p>Todos los números del Apertura 2026.</p>
      </section>

      {/* ======================================================
          RESUMEN DEL TORNEO
          ====================================================== */}

      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">TORNEO</span>

            <h2>Resumen del campeonato</h2>

            <p>Los principales datos del Apertura 2026 hasta la fecha.</p>
          </div>
        </div>

        <div className="tabla-wrap">
          <table className="tabla tabla-goleadores">
            <thead>
              <tr>
                <th>Estadística</th>
                <th>Valor</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Partidos disputados</td>
                <td>{partidosJugados.length}</td>
              </tr>

              <tr>
                <td>Total de goles</td>
                <td>{totalGoles}</td>
              </tr>

              <tr>
                <td>Promedio de goles por partido</td>
                <td>{promedioGoles.toFixed(2)}</td>
              </tr>

              <tr>
                <td>Goles como local</td>
                <td>{totalGolesLocal}</td>
              </tr>

              <tr>
                <td>Goles como visitante</td>
                <td>{totalGolesVisitante}</td>
              </tr>

              <tr>
                <td>Promedio de goles local</td>
                <td>{promedioGolesLocal.toFixed(2)}</td>
              </tr>

              <tr>
                <td>Promedio de goles visitante</td>
                <td>{promedioGolesVisitante.toFixed(2)}</td>
              </tr>

              <tr>
                <td>Mayor goleada</td>

                <td>
                  {mayorGoleada
                    ? `${
                        nombresEquipos[mayorGoleada.local] || mayorGoleada.local
                      } ${mayorGoleada.golesLocal} - ${
                        mayorGoleada.golesVisitante
                      } ${
                        nombresEquipos[mayorGoleada.visitante] ||
                        mayorGoleada.visitante
                      }`
                    : "-"}
                </td>
              </tr>

              <tr>
                <td>Partido con más goles</td>

                <td>
                  {partidoMasGoles
                    ? `${
                        nombresEquipos[partidoMasGoles.local] ||
                        partidoMasGoles.local
                      } ${partidoMasGoles.golesLocal} - ${
                        partidoMasGoles.golesVisitante
                      } ${
                        nombresEquipos[partidoMasGoles.visitante] ||
                        partidoMasGoles.visitante
                      }`
                    : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================
          FIGURAS DE LA JORNADA
          ====================================================== */}

      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DESTACADOS</span>

            <h2>Figuras de la jornada</h2>

            <p>
              Los goleadores destacados y la portería menos vencida de la
              jornada.
            </p>
          </div>
        </div>

        <EquipoJornada />
      </section>

      {/* ======================================================
          LÍDERES ESTADÍSTICOS
          ====================================================== */}

      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DESTACADOS</span>

            <h2>Líderes estadísticos</h2>

            <p>
              Los equipos que actualmente destacan en las principales categorías
              del torneo.
            </p>
          </div>
        </div>

        <div className="tabla-wrap">
          <table className="tabla tabla-goleadores">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Equipo</th>
                <th>Dato</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Mejor rendimiento</td>

                <td className="goleador-info">
                  <LogoEquipo equipo={mejorRendimiento?.equipo} />

                  <span className="goleador-nombre">
                    {mejorRendimiento?.nombre || "-"}
                  </span>
                </td>

                <td>
                  {mejorRendimiento ? `${mejorRendimiento.puntos} pts` : "-"}
                </td>
              </tr>

              <tr>
                <td>Mejor ataque</td>

                <td className="goleador-info">
                  <LogoEquipo equipo={mejorAtaque?.equipo} />

                  <span className="goleador-nombre">
                    {mejorAtaque?.nombre || "-"}
                  </span>
                </td>

                <td>{mejorAtaque ? `${mejorAtaque.golesFavor} goles` : "-"}</td>
              </tr>

              <tr>
                <td>Mejor defensa</td>

                <td className="goleador-info">
                  <LogoEquipo equipo={mejorDefensa?.equipo} />

                  <span className="goleador-nombre">
                    {mejorDefensa?.nombre || "-"}
                  </span>
                </td>

                <td>{mejorDefensa ? `${mejorDefensa.golesContra} GC` : "-"}</td>
              </tr>

              <tr>
                <td>Mayor diferencia de goles</td>

                <td className="goleador-info">
                  <LogoEquipo equipo={mejorDiferencia?.equipo} />

                  <span className="goleador-nombre">
                    {mejorDiferencia?.nombre || "-"}
                  </span>
                </td>

                <td>
                  {mejorDiferencia
                    ? mejorDiferencia.diferencia > 0
                      ? `+${mejorDiferencia.diferencia}`
                      : mejorDiferencia.diferencia
                    : "-"}
                </td>
              </tr>

              <tr>
                <td>Más porterías a cero</td>

                <td className="goleador-info">
                  <LogoEquipo equipo={mejorPorteria?.equipo} />

                  <span className="goleador-nombre">
                    {mejorPorteria?.nombre || "-"}
                  </span>
                </td>

                <td>
                  {mejorPorteria ? `${mejorPorteria.porteriasCero} PC` : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================
          ATAQUE
          ====================================================== */}

      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ATAQUE</span>

            <h2>{tituloAtaque}</h2>

            <p>{descripcionAtaque}</p>
          </div>
        </div>

        <div className="estadisticas-filtros">
          <button
            type="button"
            className={`estadistica-filtro ${
              tipoAtaque === "general" ? "activo" : ""
            }`}
            onClick={() => setTipoAtaque("general")}
          >
            General
          </button>

          <button
            type="button"
            className={`estadistica-filtro ${
              tipoAtaque === "local" ? "activo" : ""
            }`}
            onClick={() => setTipoAtaque("local")}
          >
            Local
          </button>

          <button
            type="button"
            className={`estadistica-filtro ${
              tipoAtaque === "visitante" ? "activo" : ""
            }`}
            onClick={() => setTipoAtaque("visitante")}
          >
            Visitante
          </button>
        </div>

        <div className="tabla-wrap">
          <table className="tabla tabla-goleadores">
            <thead>
              <tr>
                <th>#</th>
                <th>Equipo</th>
                <th>PJ</th>
                <th>GF</th>
                <th>Prom.</th>
              </tr>
            </thead>

            <tbody>
              {equiposAtaque.map((equipo, index) => {
                let goles = equipo.golesFavor;
                let partidosEquipo = equipo.partidos;

                if (tipoAtaque === "local") {
                  goles = equipo.golesLocal;
                  partidosEquipo = equipo.partidosLocal;
                }

                if (tipoAtaque === "visitante") {
                  goles = equipo.golesVisitante;
                  partidosEquipo = equipo.partidosVisitante;
                }

                const promedio =
                  partidosEquipo > 0 ? goles / partidosEquipo : 0;

                return (
                  <tr key={equipo.equipo}>
                    <td>
                      <span className="goleador-posicion">{index + 1}</span>
                    </td>

                    <td className="goleador-info">
                      <LogoEquipo equipo={equipo.equipo} />

                      <span className="goleador-nombre">{equipo.nombre}</span>
                    </td>

                    <td>{partidosEquipo}</td>

                    <td className="goleador-goles">{goles}</td>

                    <td className="goleador-promedio">{promedio.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================
          DEFENSA
          ====================================================== */}

      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DEFENSA</span>

            <h2>{tituloDefensa}</h2>

            <p>{descripcionDefensa}</p>
          </div>
        </div>

        <div className="estadisticas-filtros">
          <button
            type="button"
            className={`estadistica-filtro ${
              tipoDefensa === "general" ? "activo" : ""
            }`}
            onClick={() => setTipoDefensa("general")}
          >
            General
          </button>

          <button
            type="button"
            className={`estadistica-filtro ${
              tipoDefensa === "local" ? "activo" : ""
            }`}
            onClick={() => setTipoDefensa("local")}
          >
            Local
          </button>

          <button
            type="button"
            className={`estadistica-filtro ${
              tipoDefensa === "visitante" ? "activo" : ""
            }`}
            onClick={() => setTipoDefensa("visitante")}
          >
            Visitante
          </button>
        </div>

        <div className="tabla-wrap">
          <table className="tabla tabla-goleadores">
            <thead>
              <tr>
                <th>#</th>
                <th>Equipo</th>
                <th>PJ</th>
                <th>GC</th>
                <th>Prom. GC</th>
                <th>PC</th>
              </tr>
            </thead>

            <tbody>
              {equiposDefensa.map((equipo, index) => {
                let golesContra = equipo.golesContra;
                let partidosEquipo = equipo.partidos;
                let porteriasCero = equipo.porteriasCero;

                if (tipoDefensa === "local") {
                  golesContra = equipo.golesContraLocal;

                  partidosEquipo = equipo.partidosLocal;

                  porteriasCero = equipo.porteriasCeroLocal;
                }

                if (tipoDefensa === "visitante") {
                  golesContra = equipo.golesContraVisitante;

                  partidosEquipo = equipo.partidosVisitante;

                  porteriasCero = equipo.porteriasCeroVisitante;
                }

                const promedio =
                  partidosEquipo > 0 ? golesContra / partidosEquipo : 0;

                return (
                  <tr key={equipo.equipo}>
                    <td>
                      <span className="goleador-posicion">{index + 1}</span>
                    </td>

                    <td className="goleador-info">
                      <LogoEquipo equipo={equipo.equipo} />

                      <span className="goleador-nombre">{equipo.nombre}</span>
                    </td>

                    <td>{partidosEquipo}</td>

                    <td>{golesContra}</td>

                    <td className="goleador-promedio">{promedio.toFixed(2)}</td>

                    <td>{porteriasCero}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================
          GOLEADORES
          ====================================================== */}

      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">GOLEADORES</span>

            <h2>Máximos goleadores</h2>

            <p>Los 5 jugadores con más goles en el Apertura 2026.</p>
          </div>
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
              {primerosCincoGoleadores.map((jugador, index) => (
                <tr key={jugador.id}>
                  <td>
                    <span className="goleador-posicion">{index + 1}</span>
                  </td>

                  <td className="goleador-info">
                    <LogoEquipo equipo={jugador.equipo} />

                    <div>
                      <div className="goleador-nombre">{jugador.nombre}</div>

                      <div className="goleador-equipo">
                        {nombresEquipos[jugador.equipo] || jugador.equipo}
                      </div>
                    </div>
                  </td>

                  <td className="goleador-goles">{jugador.goles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default Estadisticas;
