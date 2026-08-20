
// ANTES esto probablemente exportaba un array `goleadores` ya calculado
// a partir del import estático de partidos.js. Ahora partidos llega
// async desde Sheets, así que esto se convierte en una FUNCIÓN que
// recibe el array de partidos ya cargado y devuelve los goleadores.
//
// NOTA: no tenía el contenido original de este archivo, así que
// reconstruí la lógica según cómo se usa `goleadores` en Estadisticas.jsx
// y Goleadores.jsx (id, nombre, equipo, goles, ordenado descendente).
// Si tu versión original calculaba algo distinto (por ejemplo, un
// desempate distinto, o cómo cuenta partidosJugados), compárteme el
// archivo original y lo ajusto exacto.

import { jugadoresPorId } from "./jugadores";

export function calcularGoleadores(partidos) {
  const conteoGoles = {};
  const partidosJugadosPorEquipo = {};

  partidos.forEach((partido) => {
    const tieneGoles =
      typeof partido.golesLocal === "number" &&
      typeof partido.golesVisitante === "number";

    if (!tieneGoles) return;

    partidosJugadosPorEquipo[partido.local] =
      (partidosJugadosPorEquipo[partido.local] || 0) + 1;
    partidosJugadosPorEquipo[partido.visitante] =
      (partidosJugadosPorEquipo[partido.visitante] || 0) + 1;

    const golesDelPartido = [
      ...(partido.golesLocalDetalle || []),
      ...(partido.golesVisitanteDetalle || []),
    ];

    golesDelPartido.forEach((gol) => {
      // Los autogoles no cuentan para la tabla de goleadores
      if (!gol.jugadorId || gol.propia) return;

      conteoGoles[gol.jugadorId] = (conteoGoles[gol.jugadorId] || 0) + 1;
    });
  });

  const goleadores = Object.entries(conteoGoles).map(([jugadorId, goles]) => {
    const jugador = jugadoresPorId[jugadorId];
    const equipo = jugador?.equipo;
    const partidosJugados = equipo
      ? partidosJugadosPorEquipo[equipo] || 0
      : 0;

    return {
      id: jugadorId,
      nombre: jugador?.nombre || jugadorId,
      equipo,
      goles,
      promedio: partidosJugados > 0 ? goles / partidosJugados : null,
    };
  });

  goleadores.sort((a, b) => {
    if (b.goles !== a.goles) return b.goles - a.goles;
    return a.nombre.localeCompare(b.nombre);
  });

  return goleadores;
}