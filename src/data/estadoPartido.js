const DURACION_ESTIMADA_MINUTOS = 120; // 2 horas

export function obtenerEstadoPartido(partido) {
  if (!partido) {
    return "proximo";
  }

  // Si en Google Sheets ya está marcado como finalizado,
  // respetamos ese estado.
  if (partido.estado === "finalizado") {
    return "finalizado";
  }

  if (!partido.fecha || !partido.hora) {
    return partido.estado || "proximo";
  }

  // Google Sheets puede enviar fechas como:
  // 2026-08-16
  // 2026-08-16T06:00:00.000Z
  //
  // Solo necesitamos YYYY-MM-DD.
  const fecha = String(partido.fecha).split("T")[0];

  // Limpiamos la hora por si viene como:
  // 15:00:00
  // 15:00
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
   * Construimos el momento del partido usando UTC y
   * sumamos 6 horas para representar correctamente
   * la hora local de Costa Rica.
   *
   * Ejemplo:
   * 16/08/2026 15:00 Costa Rica
   * = 16/08/2026 21:00 UTC
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

  // Todavía no empieza.
  if (ahora < inicio) {
    return "proximo";
  }

  // Ya pasaron las 2 horas.
  if (ahora >= fin) {
    return "finalizado";
  }

  // Está dentro de las 2 horas del partido.
  return "en-curso";
}