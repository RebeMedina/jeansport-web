import { obtenerLogo } from "../data/equipos";

function TablaGoleadores({ goleadores }) {
  return (
    <div className="tabla-container tabla-goleadores-container">
      <div className="tabla-scroll">
        <table className="tabla tabla-goleadores">
          <thead>
            <tr>
              <th>#</th>
              <th>Jugador</th>
              <th>Goles</th>
              <th>PJ</th>
            </tr>
          </thead>

          <tbody>
            {goleadores.map((jugador, index) => {
              const logo = obtenerLogo(jugador.equipo);

              return (
                <tr key={`${jugador.nombre}-${index}`}>
                  <td className="goleador-posicion">
                    {index + 1}
                  </td>

                  <td className="goleador-info">
                    <div className="goleador-avatar">
                      {logo && (
                        <img
                          src={logo}
                          alt={`Escudo de ${jugador.equipo}`}
                        />
                      )}
                    </div>

                    <div>
                      <strong className="goleador-nombre">
                        {jugador.nombre}
                      </strong>

                      <span className="goleador-equipo">
                        {jugador.equipo}
                      </span>
                    </div>
                  </td>

                  <td className="goleador-goles">
                    {jugador.goles}
                  </td>

                  <td className="goleador-partidos">
                    {jugador.partidosJugados}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablaGoleadores;