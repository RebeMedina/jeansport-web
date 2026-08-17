import { partidos } from "./partidos.js";
import { jugadoresPorId } from "./jugadores.js";

/*
 * ============================================================
 * GOLES POR JUGADOR (derivado de partidos.js)
 * ============================================================
 *
 * Recorre golesLocalDetalle / golesVisitanteDetalle de cada partido
 * y cuenta goles por jugadorId. Se excluyen:
 * - Partidos con walkover (ganados en la mesa): no hubo goles reales.
 * - Goles sin jugadorId (dato faltante en la fuente).
 * - Autogoles (propia: true): cuentan para el marcador del equipo,
 *   pero no se le suman al historial goleador del jugador que los metió.
 *
 * 100% derivado: no hay ningún dato cargado a mano acá. Cuando se
 * agregue un gol en partidos.js, esta lista se actualiza sola.
 */

function calcularGolesPorJugador() {
  const conteo = {};

  partidos.forEach((partido) => {
    if (partido.walkover) return;

    const goles = [
      ...(partido.golesLocalDetalle || []),
      ...(partido.golesVisitanteDetalle || []),
    ];

    goles.forEach((gol) => {
      if (!gol.jugadorId || gol.propia) return;

      conteo[gol.jugadorId] = (conteo[gol.jugadorId] || 0) + 1;
    });
  });

  return conteo;
}

export function obtenerGoleadores() {
  const conteo = calcularGolesPorJugador();

  return Object.entries(conteo)
    .map(([jugadorId, goles]) => {
      const jugador = jugadoresPorId[jugadorId];

      return {
        id: jugadorId,
        nombre: jugador ? jugador.nombre : jugadorId,
        equipo: jugador ? jugador.equipo : null,
        goles,
      };
    })
    .sort((a, b) => b.goles - a.goles || a.nombre.localeCompare(b.nombre));
}

// Se mantiene este export para no romper los componentes que ya
// hacen `import { goleadores } from "../data/goleadores"`.
export const goleadores = obtenerGoleadores();