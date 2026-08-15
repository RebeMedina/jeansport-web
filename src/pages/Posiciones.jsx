import { partidos } from "../data/partidos";
import TablaPosiciones from "../components/TablaPosiciones";

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

const jornadas = [...new Set(partidos.map((partido) => partido.jornada))].sort(
  (a, b) => a - b,
);

// Determina la jornada actual según la fecha de hoy: es la jornada
// más reciente cuya fecha de inicio ya llegó (sin importar si todos
// sus partidos ya se jugaron o no). Se usa solo para el texto
// "Jornada X" del encabezado, no para filtrar la tabla de posiciones.

function obtenerJornadaActual() {
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
}

// Cuenta TODOS los partidos con estado "finalizado", sin importar
// a qué jornada pertenezcan. Así, en cuanto actualizas un resultado
// a mano en partidos.js, se refleja de inmediato en la tabla,
// sin esperar a que se complete toda la jornada.

function obtenerTablaPosiciones() {
  const partidosFinalizados = partidos.filter(
    (partido) => partido.estado === "finalizado",
  );

  const tabla = equipos.map((equipo) => {
    const partidosEquipo = partidosFinalizados
      .filter(
        (partido) => partido.local === equipo || partido.visitante === equipo,
      )
      .sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
      );

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
      ultimosTres: ultimos.slice(-3),
    };
  });

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
  const jornadaActual = obtenerJornadaActual();
  const tabla = obtenerTablaPosiciones();

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
    </>
  );
}

export default Posiciones;
