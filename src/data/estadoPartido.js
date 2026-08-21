const DURACION_ESTIMADA_MINUTOS = 120;

export function obtenerEstadoPartido(partido) {
  if (!partido) {
    return "proximo";
  }

  // Si Google Sheets ya indica que terminó,
  // respetamos ese estado.
  if (partido.estado === "finalizado") {
    return "finalizado";
  }

  // Si no hay fecha u hora, mantenemos el estado recibido.
  if (!partido.fecha || !partido.hora) {
    return partido.estado || "proximo";
  }

  const fecha = String(partido.fecha).split("T")[0];
  const hora = String(partido.hora).substring(0, 5);

  const [anio, mes, dia] = fecha.split("-").map(Number);
  const [horas, minutos] = hora.split(":").map(Number);

  if (
    !anio ||
    !mes ||
    !dia ||
    Number.isNaN(horas) ||
    Number.isNaN(minutos)
  ) {
    return partido.estado || "proximo";
  }

  /*
   * Costa Rica = UTC-6.
   *
   * Ejemplo:
   * 2026-08-16 15:00 Costa Rica
   * = 2026-08-16 21:00 UTC
   */

  const inicio = new Date(
    Date.UTC(anio, mes - 1, dia, horas + 6, minutos, 0)
  );

  if (Number.isNaN(inicio.getTime())) {
    return partido.estado || "proximo";
  }

  const ahora = new Date();

  const fin = new Date(
    inicio.getTime() + DURACION_ESTIMADA_MINUTOS * 60 * 1000
  );

  if (ahora < inicio) {
    return "proximo";
  }

  if (ahora >= fin) {
    return "finalizado";
  }

  return "en-curso";
}

/*
 * Verifica que el partido tenga un marcador válido.
 */
export function partidoTieneResultado(partido) {
  return (
    partido &&
    typeof partido.golesLocal === "number" &&
    typeof partido.golesVisitante === "number"
  );
}

/*
 * Un partido solamente cuenta para la tabla
 * cuando:
 *
 * 1. Tiene ambos goles.
 * 2. Está finalizado.
 */
export function partidoCuentaParaTabla(partido) {
  if (!partidoTieneResultado(partido)) {
    return false;
  }

  return obtenerEstadoPartido(partido) === "finalizado";
}

/*
 * Las estadísticas oficiales utilizan
 * exactamente la misma regla.
 */
export function partidoCuentaParaEstadisticas(partido) {
  if (!partidoTieneResultado(partido)) {
    return false;
  }

  return obtenerEstadoPartido(partido) === "finalizado";
}