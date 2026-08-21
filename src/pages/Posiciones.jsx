import { obtenerLogo } from "../data/equipos";
import { partidoCuentaParaTabla } from "../data/estadoPartido";
import { useAppData } from "../context/DataContext";
import TablaPosiciones from "../components/TablaPosiciones";
import { SemifinalesBracket } from "../components/Semifinales";

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

function obtenerJornadaActual(partidos, jornadas) {
  if (!partidos.length || !jornadas.length) {
    return 1;
  }

  const jornadasConPartidos = jornadas.filter((jornada) =>
    partidos.some((partido) => partido.jornada === jornada && partido.fecha),
  );

  if (!jornadasConPartidos.length) {
    return jornadas[0];
  }

  const ahora = new Date();

  const jornadasIniciadas = jornadasConPartidos.filter((jornada) => {
    const partidosJornada = partidos.filter(
      (partido) => partido.jornada === jornada && partido.fecha,
    );

    if (!partidosJornada.length) {
      return false;
    }

    const fechas = partidosJornada
      .map((partido) => {
        const fecha = String(partido.fecha).split("T")[0];

        const [anio, mes, dia] = fecha.split("-").map(Number);

        if (!anio || !mes || !dia) {
          return null;
        }

        return new Date(anio, mes - 1, dia).getTime();
      })
      .filter((fecha) => fecha !== null && !Number.isNaN(fecha));

    if (!fechas.length) {
      return false;
    }

    const fechaInicio = new Date(Math.min(...fechas));

    return fechaInicio <= ahora;
  });

  if (jornadasIniciadas.length > 0) {
    return jornadasIniciadas[jornadasIniciadas.length - 1];
  }

  return jornadas[0];
}

function obtenerTablaPosiciones(partidos) {
  /*
   * Solamente usamos partidos:
   *
   * - con marcador
   * - finalizados
   *
   * Los partidos futuros o en curso
   * NO afectan la tabla.
   */

  const partidosFinalizados = partidos.filter(partidoCuentaParaTabla);

  const tabla = equipos.map((equipo) => {
    const partidosEquipo = partidosFinalizados
      .filter(
        (partido) => partido.local === equipo || partido.visitante === equipo,
      )
      .sort((a, b) => {
        const fechaA = new Date(a.fecha).getTime();
        const fechaB = new Date(b.fecha).getTime();

        return fechaA - fechaB;
      });

    let jugados = 0;
    let ganados = 0;
    let empatados = 0;
    let perdidos = 0;

    let golesFavor = 0;
    let golesContra = 0;

    const ultimos = [];

    partidosEquipo.forEach((partido) => {
      const esLocal = partido.local === equipo;

      const golesEquipo = esLocal ? partido.golesLocal : partido.golesVisitante;

      const golesRival = esLocal ? partido.golesVisitante : partido.golesLocal;

      if (typeof golesEquipo !== "number" || typeof golesRival !== "number") {
        return;
      }

      jugados++;

      golesFavor += golesEquipo;
      golesContra += golesRival;

      if (golesEquipo > golesRival) {
        ganados++;
        ultimos.push("ganado");
      } else if (golesEquipo === golesRival) {
        empatados++;
        ultimos.push("empatado");
      } else {
        perdidos++;
        ultimos.push("perdido");
      }
    });

    const puntos = ganados * 3 + empatados;

    const diferenciaGoles = golesFavor - golesContra;

    return {
      equipo,
      nombre: nombresEquipos[equipo],

      jugados,

      ganados,
      empatados,
      perdidos,

      golesFavor,
      golesContra,

      diferenciaGoles,

      puntos,

      ultimosCinco: ultimos.slice(-5),
    };
  });

  /*
   * Orden:
   *
   * 1. Puntos
   * 2. Diferencia de goles
   * 3. Goles a favor
   * 4. Victorias
   * 5. Nombre
   */

  tabla.sort((a, b) => {
    if (a.puntos !== b.puntos) {
      return b.puntos - a.puntos;
    }

    if (a.diferenciaGoles !== b.diferenciaGoles) {
      return b.diferenciaGoles - a.diferenciaGoles;
    }

    if (a.golesFavor !== b.golesFavor) {
      return b.golesFavor - a.golesFavor;
    }

    if (a.ganados !== b.ganados) {
      return b.ganados - a.ganados;
    }

    return a.nombre.localeCompare(b.nombre);
  });

  return tabla;
}

function Posiciones() {
  const { partidos, loadingPartidos, errorPartidos } = useAppData();

  if (loadingPartidos) {
    return (
      <section className="container section">
        <p>Cargando tabla de posiciones...</p>
      </section>
    );
  }

  if (errorPartidos) {
    return (
      <section className="container section">
        <p>
          No se pudo cargar la tabla de posiciones. Intenta de nuevo más tarde.
        </p>
      </section>
    );
  }

  const jornadas = [
    ...new Set(
      partidos
        .map((partido) => partido.jornada)
        .filter((jornada) => typeof jornada === "number"),
    ),
  ].sort((a, b) => a - b);

  const jornadaActual = obtenerJornadaActual(partidos, jornadas);

  const tabla = obtenerTablaPosiciones(partidos);

  /*
   * Los 4 cupos de semifinal se toman directamente de las primeras 4
   * posiciones de la tabla que ya calculamos arriba. Si todavía no hay
   * suficientes partidos jugados, tabla[i] puede no existir y el bracket
   * muestra el placeholder "Clasificado N" en su lugar.
   */
  const equiposClasificados = {
    1: tabla[0]?.equipo,
    2: tabla[1]?.equipo,
    3: tabla[2]?.equipo,
    4: tabla[3]?.equipo,
  };

  return (
    <>
      <section className="container page-hero">
        <span className="eyebrow">CLASIFICACIÓN</span>

        <h1>Tabla de posiciones</h1>

        <p>Primera División de Costa Rica · Jornada {jornadaActual}</p>
      </section>

      <section className="container section">
        <TablaPosiciones tabla={tabla} />
      </section>

      <section className="container section">
        <SemifinalesBracket equiposClasificados={equiposClasificados} />
      </section>
    </>
  );
}

export default Posiciones;
