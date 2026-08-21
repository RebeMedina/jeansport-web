import { partidos as calendario } from "./partidos";

function toBool(v) {
  if (v === undefined || v === null) {
    return false;
  }

  const s = String(v).trim().toUpperCase();

  return (
    s === "TRUE" ||
    s === "1" ||
    s === "SI" ||
    s === "SÍ"
  );
}

function toNumOrUndefined(v) {
  if (
    v === undefined ||
    v === null ||
    String(v).trim() === ""
  ) {
    return undefined;
  }

  const n = Number(v);

  return Number.isNaN(n) ? undefined : n;
}

function normalizarHora(v) {
  if (!v) {
    return "";
  }

  const texto = String(v).trim();

  if (!texto) {
    return "";
  }

  if (texto.includes("T")) {
    const hora = texto.split("T")[1];

    if (hora) {
      return hora.substring(0, 5);
    }
  }

  if (/^\d{2}:\d{2}:\d{2}/.test(texto)) {
    return texto.substring(0, 5);
  }

  if (/^\d{2}:\d{2}$/.test(texto)) {
    return texto;
  }

  return texto.substring(0, 5);
}

export function parsePartidos(rawPartidos, rawGoles) {
  /*
   * ============================================================
   * 1. AGRUPAR GOLES
   * ============================================================
   */

  const golesPorPartido = {};

  for (const g of rawGoles || []) {
    const partidoId = Number(g.partidoId);

    if (Number.isNaN(partidoId)) {
      continue;
    }

    if (!golesPorPartido[partidoId]) {
      golesPorPartido[partidoId] = {
        local: [],
        visitante: [],
      };
    }

    const gol = {
      jugadorId: g.jugadorId,
      minuto: toNumOrUndefined(g.minuto),
    };

    if (toBool(g.propia)) {
      gol.propia = true;
    }

    const equipo = String(g.equipo || "")
      .trim()
      .toLowerCase();

    if (equipo === "local") {
      golesPorPartido[partidoId].local.push(gol);
    }

    if (equipo === "visitante") {
      golesPorPartido[partidoId].visitante.push(gol);
    }
  }

  /*
   * ============================================================
   * 2. CREAR MAPA DE DATOS DE GOOGLE SHEETS
   * ============================================================
   */

  const datosSheets = {};

  for (const p of rawPartidos || []) {
    const id = Number(p.id);

    if (Number.isNaN(id)) {
      continue;
    }

    datosSheets[id] = p;
  }

  /*
   * ============================================================
   * 3. PARTIMOS DEL CALENDARIO LOCAL
   * ============================================================
   *
   * partidos.js es la fuente del calendario:
   *
   * - fecha
   * - jornada
   * - local
   * - visitante
   * - hora
   *
   * Google Sheets solamente actualiza:
   *
   * - golesLocal
   * - golesVisitante
   * - walkover
   * - goles
   */

  return calendario
    .map((partidoBase) => {
      const datos = datosSheets[partidoBase.id] || {};

      const goles =
        golesPorPartido[partidoBase.id] || {
          local: [],
          visitante: [],
        };

      /*
       * ========================================================
       * MARCADOR
       * ========================================================
       */

      const tieneMarcadorLocal =
        datos.golesLocal !== undefined &&
        datos.golesLocal !== null &&
        String(datos.golesLocal).trim() !== "";

      const tieneMarcadorVisitante =
        datos.golesVisitante !== undefined &&
        datos.golesVisitante !== null &&
        String(datos.golesVisitante).trim() !== "";

      /*
       * Si Sheets tiene marcador, usamos Sheets.
       *
       * Si no tiene marcador, conservamos el de partidos.js
       * solamente para partidos que ya tenían resultado.
       */

      let golesLocal = partidoBase.golesLocal;
      let golesVisitante = partidoBase.golesVisitante;

      if (tieneMarcadorLocal) {
        golesLocal = Number(datos.golesLocal);
      }

      if (tieneMarcadorVisitante) {
        golesVisitante = Number(datos.golesVisitante);
      }

      /*
       * ========================================================
       * DETALLE DE GOLES
       * ========================================================
       */

      let golesLocalDetalle =
        goles.local.length > 0
          ? goles.local
          : partidoBase.golesLocalDetalle || [];

      let golesVisitanteDetalle =
        goles.visitante.length > 0
          ? goles.visitante
          : partidoBase.golesVisitanteDetalle || [];

      /*
       * ========================================================
       * WALKOVER
       * ========================================================
       */

      const walkover = toBool(datos.walkover)
        ? true
        : partidoBase.walkover || false;

      /*
       * ========================================================
       * HORA
       * ========================================================
       *
       * La hora principal viene de partidos.js.
       *
       * Si algún día quieres modificar una hora desde Sheets,
       * también lo permitimos.
       */

      let hora = partidoBase.hora || "";

      if (
        datos.hora !== undefined &&
        datos.hora !== null &&
        String(datos.hora).trim() !== ""
      ) {
        hora = normalizarHora(datos.hora);
      }

      /*
       * ========================================================
       * ESTADO
       * ========================================================
       *
       * NO lo calculamos aquí.
       *
       * obtenerEstadoPartido() será quien determine:
       *
       * proximo
       * en-curso
       * finalizado
       */

      const partido = {
        ...partidoBase,

        golesLocal,
        golesVisitante,

        golesLocalDetalle,
        golesVisitanteDetalle,

        hora,

        walkover,
      };

      /*
       * Si el partido no tiene marcador en Sheets y tampoco
       * tenía marcador en partidos.js, dejamos los goles como
       * undefined.
       */

      if (
        !tieneMarcadorLocal &&
        partidoBase.golesLocal === undefined
      ) {
        delete partido.golesLocal;
      }

      if (
        !tieneMarcadorVisitante &&
        partidoBase.golesVisitante === undefined
      ) {
        delete partido.golesVisitante;
      }

      return partido;
    })
    .sort((a, b) => a.id - b.id);
}