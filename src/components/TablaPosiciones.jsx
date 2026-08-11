import { obtenerLogo } from "../data/equipos";

function TablaPosiciones({ tabla }) {
  const formatearDiferencia = (diferencia) => {
    if (diferencia > 0) {
      return `+${diferencia}`;
    }

    return diferencia;
  };

  const obtenerClaseResultado = (resultado) => {
    if (resultado === "ganado") {
      return "resultado resultado-verde";
    }

    if (resultado === "empatado") {
      return "resultado resultado-naranja";
    }

    return "resultado resultado-rojo";
  };

  const obtenerTituloResultado = (resultado) => {
    if (resultado === "ganado") {
      return "Victoria";
    }

    if (resultado === "empatado") {
      return "Empate";
    }

    return "Derrota";
  };

  return (
    <div className="tabla-container tabla-posiciones-container">
      <div className="tabla-scroll">
        <table className="tabla tabla-posiciones">
          <thead>
            <tr>
              <th>Club</th>
              <th>PJ</th>
              <th>G</th>
              <th>E</th>
              <th>P</th>
              <th>GF</th>
              <th>GC</th>
              <th>DG</th>
              <th>Puntos</th>
              <th>Últimos 3</th>
            </tr>
          </thead>

          <tbody>
            {tabla.map((equipo, index) => {
              const logo = obtenerLogo(equipo.nombre);

              return (
                <tr key={equipo.equipo}>
                  <td className="club-cell">
                    <span className="posicion">{index + 1}</span>

                    {logo && (
                      <img
                        src={logo}
                        alt={`Escudo de ${equipo.nombre}`}
                        className="tabla-logo"
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

                  <td>{formatearDiferencia(equipo.diferenciaGoles)}</td>

                  <td className="puntos">{equipo.puntos}</td>

                  <td>
                    <div className="ultimos">
                      {equipo.ultimosTres.map((resultado, resultadoIndex) => (
                        <span
                          key={`${equipo.equipo}-${resultadoIndex}`}
                          className={obtenerClaseResultado(resultado)}
                          title={obtenerTituloResultado(resultado)}
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
    </div>
  );
}

export default TablaPosiciones;
