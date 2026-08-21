import { obtenerLogo } from "../data/equipos";
import { partidoCuentaParaTabla } from "../data/estadoPartido";
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

const equipos = Object.keys(nombresEquipos);

function obtenerTablaPosiciones(partidos) {
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
      } else if (golesEquipo === golesRival) {
        empatados++;
      } else {
        perdidos++;
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

function SemifinalesSection() {
  const { partidos, loadingPartidos } = useAppData();

  if (loadingPartidos) {
    return <section className="container section"></section>;
  }

  /*
   * Tomamos la misma tabla que utiliza la clasificación.
   */
  const tabla = obtenerTablaPosiciones(partidos);

  /*
   * Los cuatro primeros lugares de la tabla
   * determinan los cruces provisionales.
   */
  const primerLugar = tabla[0];
  const segundoLugar = tabla[1];
  const tercerLugar = tabla[2];
  const cuartoLugar = tabla[3];

  const semifinales = [
    {
      id: 1,
      local: primerLugar,
      visitante: cuartoLugar,
    },
    {
      id: 2,
      local: segundoLugar,
      visitante: tercerLugar,
    },
  ];

  return (
    <section className="container section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">APERTURA 2026</span>

          <h2>Semifinales provisionales</h2>

          <p className="seccion-descripcion">
            Así estarían quedando los cruces según la tabla actual.
          </p>
        </div>
      </div>

      <div className="semifinales-grid">
        {semifinales.map((semifinal) => {
          const equipoLocal = semifinal.local;

          const equipoVisitante = semifinal.visitante;

          const nombreLocal = equipoLocal?.nombre || "Clasificado";

          const nombreVisitante = equipoVisitante?.nombre || "Clasificado";

          const logoLocal = equipoLocal ? obtenerLogo(nombreLocal) : null;

          const logoVisitante = equipoVisitante
            ? obtenerLogo(nombreVisitante)
            : null;

          return (
            <article className="semifinal-card" key={semifinal.id}>
              <div className="semifinal-header">
                <span>SEMIFINAL {semifinal.id}</span>

                <span>PROVISIONAL</span>
              </div>

              <div className="semifinal-partido">
                {/* LOCAL */}
                <div className="semifinal-equipo">
                  <div className="semifinal-posicion">
                    {semifinal.id === 1 ? "1.º" : "2.º"}
                  </div>

                  {logoLocal && (
                    <img
                      src={logoLocal}
                      alt={`Escudo de ${nombreLocal}`}
                      className="semifinal-logo"
                    />
                  )}
                </div>

                {/* VS */}
                <div className="semifinal-vs">VS</div>

                {/* VISITANTE */}
                <div className="semifinal-equipo">
                  <div className="semifinal-posicion">
                    {semifinal.id === 1 ? "4.º" : "3.º"}
                  </div>

                  {logoVisitante && (
                    <img
                      src={logoVisitante}
                      alt={`Escudo de ${nombreVisitante}`}
                      className="semifinal-logo"
                    />
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="semifinales-nota">
        Los cruces pueden cambiar según los resultados de las próximas jornadas.
      </p>
    </section>
  );
}

export default SemifinalesSection;
