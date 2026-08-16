const DURACION_ESTIMADA_MINUTOS = 120; // 2 horas

export function obtenerEstadoPartido(partido) {
  if (partido.estado === "finalizado") return "finalizado";
  if (!partido.hora) return partido.estado || "proximo";

  const inicio = new Date(`${partido.fecha}T${partido.hora}:00`);
  const fin = new Date(inicio.getTime() + DURACION_ESTIMADA_MINUTOS * 60000);
  const ahora = new Date();

  const tieneResultado =
    typeof partido.golesLocal === "number" &&
    typeof partido.golesVisitante === "number";

  if (ahora < inicio) {
    return partido.estado === "en-curso" ? "en-curso" : "proximo";
  }

  // Pasaron las 2 horas: se cierra sí o sí.
  // Si hay resultado, finalizado. Si no, queda en-curso hasta que lo cargues
  // (pero apenas lo cargues, el chequeo de arriba ya lo va a cerrar).
  if (ahora > fin) {
    return tieneResultado ? "finalizado" : "en-curso";
  }

  return "en-curso";
}