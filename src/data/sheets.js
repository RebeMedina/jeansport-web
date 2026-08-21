import { partidos } from "./partidos";

const API_URL =
  "https://script.google.com/macros/s/AKfycbwiFQ5ymZ5U5vy6trV8bNjFRjoc-zHULZNSz6YZ4I8Y5IKwg2DsQ4BsXZB4Lw-NkT0NFA/exec";

/*
 * ============================================================
 * GOOGLE SHEETS
 * ============================================================
 */

export async function fetchSheet(sheetName) {
  const url = `${API_URL}?sheet=${encodeURIComponent(sheetName)}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `No se pudo cargar la hoja "${sheetName}".`
    );
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  if (!Array.isArray(data)) {
    throw new Error(
      `La hoja "${sheetName}" no devolvió una lista válida.`
    );
  }

  return data;
}

/*
 * ============================================================
 * NORMALIZAR GOLES
 * ============================================================
 */

function normalizarGol(valor) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return null;
  }

  const numero = Number(valor);

  return Number.isNaN(numero) ? null : numero;
}

/*
 * ============================================================
 * NORMALIZAR BOOLEAN
 * ============================================================
 */

function normalizarBoolean(valor) {
  if (
    valor === true ||
    valor === 1 ||
    valor === "1" ||
    valor === "true" ||
    valor === "TRUE" ||
    valor === "True"
  ) {
    return true;
  }

  return false;
}

/*
 * ============================================================
 * PARTIDOS
 * ============================================================
 *
 * partidos.js es la fuente principal del calendario.
 *
 * Google Sheets solamente actualiza:
 *
 * - local
 * - golesLocal
 * - visitante
 * - golesVisitante
 * - walkover
 *
 * Todo lo demás continúa viniendo de partidos.js.
 *
 * ============================================================
 */

export async function obtenerPartidos() {
  const partidosSheet = await fetchSheet("Partidos");

  return partidos.map((partido) => {
    const partidoSheet = partidosSheet.find(
      (p) => Number(p.id) === Number(partido.id)
    );

    /*
     * Si todavía no existe en Google Sheets,
     * conservamos completamente partidos.js.
     */

    if (!partidoSheet) {
      return {
        ...partido,
      };
    }

    /*
     * Si existe en Google Sheets,
     * solamente actualizamos los campos permitidos.
     */

    return {
      ...partido,

      local:
        partidoSheet.local ||
        partido.local,

      golesLocal:
        normalizarGol(
          partidoSheet.golesLocal
        ) ?? partido.golesLocal,

      visitante:
        partidoSheet.visitante ||
        partido.visitante,

      golesVisitante:
        normalizarGol(
          partidoSheet.golesVisitante
        ) ?? partido.golesVisitante,

      walkover:
        partidoSheet.walkover !== undefined &&
        partidoSheet.walkover !== ""
          ? normalizarBoolean(
              partidoSheet.walkover
            )
          : Boolean(partido.walkover),
    };
  });
}

/*
 * ============================================================
 * GOLES
 * ============================================================
 */

export async function obtenerGoles() {
  return await fetchSheet("Goles");
}

/*
 * ============================================================
 * NOTICIAS
 * ============================================================
 */

export async function obtenerNoticias() {
  const noticias = await fetchSheet("Noticias");

  return noticias.sort((a, b) => {
    const fechaA = new Date(a.fecha);
    const fechaB = new Date(b.fecha);

    return fechaB - fechaA;
  });
}

/*
 * ============================================================
 * NOTICIA POR ID
 * ============================================================
 */

export async function obtenerNoticiaPorId(id) {
  const noticias = await obtenerNoticias();

  return noticias.find(
    (noticia) =>
      Number(noticia.id) === Number(id)
  );
}

/*
 * ============================================================
 * GOLES DE UN PARTIDO
 * ============================================================
 */

export async function obtenerGolesPartido(partidoId) {
  const goles = await obtenerGoles();

  return goles.filter(
    (gol) =>
      Number(gol.partidoId) === Number(partidoId)
  );
}

/*
 * ============================================================
 * PARTIDO POR ID
 * ============================================================
 */

export async function obtenerPartidoPorId(id) {
  const partidosActualizados =
    await obtenerPartidos();

  return partidosActualizados.find(
    (partido) =>
      Number(partido.id) === Number(id)
  );
}

/*
 * ============================================================
 * CARGAR TODOS LOS DATOS
 * ============================================================
 */

export async function cargarDatos() {
  const [
    partidosActualizados,
    goles,
    noticias,
  ] = await Promise.all([
    obtenerPartidos(),
    obtenerGoles(),
    obtenerNoticias(),
  ]);

  return {
    partidos: partidosActualizados,
    goles,
    noticias,
  };
}