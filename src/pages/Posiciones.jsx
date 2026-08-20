import { useEffect, useState } from "react";
import { obtenerEstadoPartido } from "../data/estadoPartido";
import { useAppData } from "../context/DataContext";
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

// Antes estas dos funciones leían `partidos` de un import estático a
// nivel de módulo. Ahora reciben el array como parámetro, porque los
// datos llegan async desde Sheets y solo existen dentro del componente.

function obtenerJornadaActual(partidos, jornadas) {
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

function obtenerTablaPosiciones(partidos) {
  const partidosActivos = partidos.filter((partido) => {
    const estado = obtenerEstadoPartido(partido);

    return estado === "finalizado" || estado === "en-curso";
  });

  const tabla = equipos.map((equipo) => {
    const partidosEquipo = partidosActivos
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
      ultimosCinco: ultimos.slice(-5),
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
  const { partidos, loadingPartidos, errorPartidos } = useAppData();

  const [, setActualizacion] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setActualizacion((valor) => valor + 1);
    }, 30000);

    return () => clearInterval(intervalo);
  }, []);

  if (loadingPartidos) {
    return (
      <section className="container section">
      </section>
    );
  }

  if (errorPartidos) {
    return (
      <section className="container section">
        <p>No se pudo cargar la tabla de posiciones. Intenta de nuevo más tarde.</p>
      </section>
    );
  }

  const jornadas = [...new Set(partidos.map((partido) => partido.jornada))].sort(
    (a, b) => a - b,
  );

  const jornadaActual = obtenerJornadaActual(partidos, jornadas);
  const tabla = obtenerTablaPosiciones(partidos);

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