import { obtenerLogo } from "../data/equipos";
import { goleadores } from "../data/goleadores";

function Goleadores() {
  const goleadoresOrdenados = [...goleadores]
    .map((jugador) => ({
      ...jugador,
      promedio:
        jugador.partidosJugados > 0
          ? jugador.goles / jugador.partidosJugados
          : 0,
    }))
    .sort((a, b) => b.goles - a.goles);

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
                <th>Prom.</th>
              </tr>
            </thead>

            <tbody>
              {goleadoresOrdenados.map((jugador, index) => {
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

                    <td className="goleador-promedio">
                      {jugador.promedio.toFixed(2)}
                    </td>
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
