import { useState } from "react";
import { obtenerLogo } from "../data/equipos";
import { obtenerEquipoDeLaJornada } from "../data/equipoJornada";
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

function TarjetaJugador({ jugador }) {
  if (!jugador) return null;

  const nombreEquipo = nombresEquipos[jugador.equipo] || jugador.equipo;
  const logo = obtenerLogo(nombreEquipo);

  return (
    <div className="jornada-jugador">
      {logo && (
        <img
          src={logo}
          alt={`Escudo de ${nombreEquipo}`}
          className="jornada-jugador-logo"
        />
      )}
      <strong className="jornada-jugador-nombre">{jugador.nombre}</strong>
    </div>
  );
}

function EquipoJornada() {
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState(
    obtenerJornadaActual(),
  );

  const { Goleadores, portero } = obtenerEquipoDeLaJornada(
    jornadaSeleccionada,
  );

  return (
    <div>
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

      {Goleadores.length === 0 && !portero ? (
        <div className="empty-state">
          <h3>Sin datos para esta jornada</h3>
          <p>Todavía no hay goles registrados en la Jornada {jornadaSeleccionada}.</p>
        </div>
      ) : (
        <div className="jornada-equipo">
          <div className="jornada-fila jornada-fila-Goleadores">
            {Goleadores.map((jugador) => (
              <TarjetaJugador key={jugador.id} jugador={jugador} />
            ))}
          </div>

          {portero && (
            <div className="jornada-fila jornada-fila-portero">
              <TarjetaJugador jugador={portero} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EquipoJornada;