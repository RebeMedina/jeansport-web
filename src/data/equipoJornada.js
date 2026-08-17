import { partidos } from "./partidos.js";
import { jugadores, jugadoresPorId } from "./jugadores.js";

// Portero asumido = primer jugador registrado en la plantilla de cada
// equipo (jugadores.js preserva el orden de plantillas.js).
const porteroPorEquipo = {};
jugadores.forEach((jugador) => {
  if (!porteroPorEquipo[jugador.equipo]) {
    porteroPorEquipo[jugador.equipo] = jugador;
  }
});

export function obtenerEquipoDeLaJornada(jornada, cantidadDelanteros = 3) {
  const partidosJornada = partidos.filter(
    (partido) => partido.jornada === jornada && !partido.walkover,
  );

  // Goles anotados solo en esta jornada, por jugador
  const golesJornada = {};

  partidosJornada.forEach((partido) => {
    const goles = [
      ...(partido.golesLocalDetalle || []),
      ...(partido.golesVisitanteDetalle || []),
    ];

    goles.forEach((gol) => {
      if (!gol.jugadorId || gol.propia) return;
      golesJornada[gol.jugadorId] = (golesJornada[gol.jugadorId] || 0) + 1;
    });
  });

  const delanteros = Object.entries(golesJornada)
    .map(([jugadorId, goles]) => {
      const jugador = jugadoresPorId[jugadorId];

      return {
        id: jugadorId,
        nombre: jugador ? jugador.nombre : jugadorId,
        equipo: jugador ? jugador.equipo : null,
        goles,
      };
    })
    .sort((a, b) => b.goles - a.goles || a.nombre.localeCompare(b.nombre))
    .slice(0, cantidadDelanteros);

  // Mejor registro defensivo de la jornada: menos goles recibidos
  const registrosDefensivos = [];

  partidosJornada.forEach((partido) => {
    if (
      typeof partido.golesLocal !== "number" ||
      typeof partido.golesVisitante !== "number"
    ) {
      return;
    }

    registrosDefensivos.push({
      equipo: partido.local,
      golesRecibidos: partido.golesVisitante,
    });

    registrosDefensivos.push({
      equipo: partido.visitante,
      golesRecibidos: partido.golesLocal,
    });
  });

  registrosDefensivos.sort((a, b) => a.golesRecibidos - b.golesRecibidos);

  const mejorRegistro = registrosDefensivos[0] || null;
  const portero = mejorRegistro ? porteroPorEquipo[mejorRegistro.equipo] : null;

  return {
    jornada,
    delanteros,
    portero: portero
      ? {
          id: portero.id,
          nombre: portero.nombre,
          equipo: portero.equipo,
          golesRecibidos: mejorRegistro.golesRecibidos,
        }
      : null,
  };
}