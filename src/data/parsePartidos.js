function toBool(v) {
  if (v === undefined || v === null) return false;

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

/*
 * ============================================================
 * NORMALIZAR FECHA
 * ============================================================
 *
 * Acepta:
 *
 * 2026-08-16
 * 2026-08-16T06:00:00.000Z
 *
 * Devuelve:
 *
 * 2026-08-16
 */

function normalizarFecha(v) {
  if (!v) return "";

  const texto = String(v).trim();

  if (!texto) return "";

  // Si viene como ISO.
  if (texto.includes("T")) {
    return texto.split("T")[0];
  }

  // Si ya viene como YYYY-MM-DD.
  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    return texto;
  }

  return texto;
}

/*
 * ============================================================
 * NORMALIZAR HORA
 * ============================================================
 *
 * Acepta:
 *
 * 15:00
 * 15:00:00
 * 1899-12-30T15:00:00.000Z
 *
 * Devuelve:
 *
 * 15:00
 */

function normalizarHora(v) {
  if (!v) return "";

  const texto = String(v).trim();

  if (!texto) return "";

  /*
   * Si Apps Script devuelve una fecha ISO,
   * buscamos la parte de la hora.
   */
  if (texto.includes("T")) {
    const hora = texto.split("T")[1];

    if (hora) {
      return hora.substring(0, 5);
    }
  }

  /*
   * Si ya viene como HH:mm:ss.
   */
  if (/^\d{2}:\d{2}:\d{2}/.test(texto)) {
    return texto.substring(0, 5);
  }

  /*
   * Si ya viene como HH:mm.
   */
  if (/^\d{2}:\d{2}$/.test(texto)) {
    return texto;
  }

  return texto.substring(0, 5);
}

export function parsePartidos(rawPartidos, rawGoles) {
  /*
   * ============================================================
   * AGRUPAR GOLES POR PARTIDO
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
   * CREAR PARTIDOS
   * ============================================================
   */

  return (rawPartidos || [])
    .filter(
      (p) =>
        p.id !== undefined &&
        p.id !== ""
    )
    .map((p) => {
      const id = Number(p.id);

      const goles =
        golesPorPartido[id] || {
          local: [],
          visitante: [],
        };

      const golesLocal =
        goles.local.length;

      const golesVisitante =
        goles.visitante.length;

      const partido = {
        id,

        fecha: normalizarFecha(
          p.fecha
        ),

        jornada: Number(
          p.jornada
        ),

        local: p.local,

        golesLocal,

        golesLocalDetalle:
          goles.local,

        visitante:
          p.visitante,

        golesVisitante,

        golesVisitanteDetalle:
          goles.visitante,

        estado: String(
          p.estado || ""
        )
          .trim()
          .toLowerCase(),
      };

      if (
        p.hora !== undefined &&
        p.hora !== null &&
        String(p.hora).trim() !== ""
      ) {
        partido.hora =
          normalizarHora(
            p.hora
          );
      }

      if (
        toBool(p.walkover)
      ) {
        partido.walkover = true;
      }

      return partido;
    })
    .sort(
      (a, b) => a.id - b.id
    );
}