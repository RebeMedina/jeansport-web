import { Link } from "react-router";
import { partidos } from "../data/partidos";
import { obtenerEstadoPartido } from "../data/estadoPartido";
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

function StandingsSection() {
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
      ultimosTres: ultimos.slice(-5),
    };
  });

  tabla.sort((a, b) => {
    // 1. Más puntos
    if (a.puntos !== b.puntos) {
      return b.puntos - a.puntos;
    }

    // 2. Mejor diferencia de goles
    if (a.diferenciaGoles !== b.diferenciaGoles) {
      return b.diferenciaGoles - a.diferenciaGoles;
    }

    // 3. Más goles a favor
    if (a.golesFavor !== b.golesFavor) {
      return b.golesFavor - a.golesFavor;
    }

    // 4. Más partidos ganados
    if (a.ganados !== b.ganados) {
      return b.ganados - a.ganados;
    }

    // 5. Orden alfabético como último desempate
    return a.nombre.localeCompare(b.nombre);
  });

  const primerosCinco = tabla.slice(0, 5);

  return (
    <section className="container section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">CLASIFICACIÓN</span>

          <h2>Tabla de posiciones</h2>
        </div>

        <Link to="/posiciones">Tabla completa →</Link>
      </div>

      <TablaPosiciones tabla={primerosCinco} />
    </section>
  );
}

export default StandingsSection;
