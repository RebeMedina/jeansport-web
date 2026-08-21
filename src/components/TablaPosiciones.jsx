import { obtenerLogo } from "../data/equipos";

function obtenerClaseResultado(resultado) {
  if (resultado === "ganado") {
    return "resultado resultado-verde";
  }

  if (resultado === "empatado") {
    return "resultado resultado-naranja";
  }

  if (resultado === "perdido") {
    return "resultado resultado-rojo";
  }

  return "resultado";
}

function TablaPosiciones({ tabla }) {
  return (
    <div className="tabla-wrap posiciones-wrap">
      <table className="tabla tabla-posiciones">
        <thead>
          <tr>
            <th>#</th>
            <th>Equipo</th>
            <th>PJ</th>
            <th>G</th>
            <th>E</th>
            <th>P</th>
            <th>GF</th>
            <th>GC</th>
            <th>DG</th>
            <th>PTS</th>
            <th>Últimos 5</th>
          </tr>
        </thead>

        <tbody>
          {tabla.map((equipo, index) => {
            const logo = obtenerLogo(equipo.equipo);
            const posicion = index + 1;

            return (
              <tr
                key={equipo.equipo}
                className={posicion <= 4 ? "fila-clasificacion" : ""}
              >
                <td>
                  <span className="posicion">{posicion}</span>
                </td>

                <td className="club-cell">
                  {logo && (
                    <img
                      src={logo}
                      alt={`Escudo de ${equipo.nombre}`}
                      className="tabla-logo"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  <strong>{equipo.nombre}</strong>
                </td>

                <td>{equipo.jugados}</td>

                <td>{equipo.ganados}</td>

                <td>{equipo.empatados}</td>

                <td>{equipo.perdidos}</td>

                <td>{equipo.golesFavor}</td>

                <td>{equipo.golesContra}</td>

                <td>{equipo.diferenciaGoles}</td>

                <td className="puntos">
                  <strong>{equipo.puntos}</strong>
                </td>

                <td>
                  <div className="ultimos">
                    {equipo.ultimosCinco?.map((resultado, resultadoIndex) => (
                      <span
                        key={`${equipo.equipo}-${resultadoIndex}`}
                        className={obtenerClaseResultado(resultado)}
                        title={resultado}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPosiciones;
