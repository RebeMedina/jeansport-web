import { obtenerLogo } from "../data/equipos";
import { goleadores } from "../data/goleadores";

function Goleadores() {
  return (
    <>
      <section className="container page-hero">
        <span className="eyebrow">ESTADÍSTICAS</span>

        <h1>Tabla de goleadores</h1>

        <p>Los máximos goleadores de la Liga Promerica.</p>
      </section>

      <section className="container section">
        <div className="tabla-wrap goleadores-wrap">
          <table className="tabla tabla-goleadores">
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>G</th>
              </tr>
            </thead>

            <tbody>
              {goleadores.map((jugador, index) => {
                const logo = obtenerLogo(jugador.equipo);

                return (
                  <tr key={`${jugador.nombre}-${index}`}>
                    <td>
                      <span className="goleador-posicion">{index + 1}</span>
                    </td>

                    <td className="goleador-info">
                      {logo && (
                        <img
                          src={logo}
                          alt={`Escudo de ${jugador.equipo}`}
                          className="goleador-foto"
                        />
                      )}

                      <div className="goleador-datos">
                        <strong className="goleador-nombre">
                          {jugador.nombre}
                        </strong>

                        <span className="goleador-equipo">
                          {jugador.equipo}
                        </span>
                      </div>
                    </td>

                    <td className="goleador-goles">{jugador.goles}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default Goleadores;
