import { Link } from "react-router";
import { obtenerLogo } from "../data/equipos";
import { goleadores } from "../data/goleadores";

function StatsSection() {
  const goleadoresOrdenados = [...goleadores]
    .map((jugador) => ({
      ...jugador,
      promedio:
        jugador.partidosJugados > 0
          ? jugador.goles / jugador.partidosJugados
          : 0,
    }))
    .sort(
      (a, b) =>
        b.goles - a.goles ||
        b.promedio - a.promedio ||
        a.nombre.localeCompare(b.nombre),
    );

  const primerosCinco = goleadoresOrdenados.slice(0, 5);

  return (
    <section className="container section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">GOLEADORES</span>
          <h2>Máximos goleadores</h2>
        </div>

        <Link to="/estadisticas">Ver estadísticas →</Link>
      </div>

      <div className="tabla-wrap goleadores-wrap">
        <table className="tabla tabla-goleadores">
          <thead>
            <tr>
              <th>#</th>
              <th>Jugador</th>
              <th>Goles</th>
              <th>Prom.</th>
            </tr>
          </thead>

          <tbody>
            {primerosCinco.map((jugador, index) => {
              const logo = obtenerLogo(jugador.equipo);

              return (
                <tr key={jugador.nombre}>
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

                    <div>
                      <div className="goleador-nombre">{jugador.nombre}</div>
                      <div className="goleador-equipo">{jugador.equipo}</div>
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
  );
}

export default StatsSection;
