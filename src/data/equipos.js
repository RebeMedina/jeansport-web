const LOGOS_EQUIPOS = {
  saprissa:
    "https://img.sofascore.com/api/v1/team/6574/image",

  cartagines:
    "https://img.sofascore.com/api/v1/team/7044/image",

  sporting:
    "https://img.sofascore.com/api/v1/team/262906/image",

  escorpiones:
    "https://img.sofascore.com/api/v1/team/391662/image",

  "perez zeledon":
    "https://img.sofascore.com/api/v1/team/6576/image",

  puntarenas:
    "https://img.sofascore.com/api/v1/team/7046/image",

  alajuelense:
    "https://img.sofascore.com/api/v1/team/6572/image",

  herediano:
    "https://img.sofascore.com/api/v1/team/7045/image",

  "inter san carlos":
    "https://img.sofascore.com/api/v1/team/531301/image",

  "san carlos":
    "https://img.sofascore.com/api/v1/team/7047/image",
};

function normalizarNombre(nombre) {
return nombre
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.replace(/[.']/g, "")
.replace(/-/g, " ")
.replace(/\s+/g, " ")
.trim();
}

export function obtenerLogo(nombreEquipo) {
  const nombre = normalizarNombre(nombreEquipo);

  if (nombre.includes("saprissa")) {
    return LOGOS_EQUIPOS.saprissa;
  }

  if (nombre.includes("cartagines")) {
    return LOGOS_EQUIPOS.cartagines;
  }

  if (nombre.includes("sporting")) {
    return LOGOS_EQUIPOS.sporting;
  }

  if (nombre.includes("escorpiones")) {
    return LOGOS_EQUIPOS.escorpiones;
  }

  if (nombre.includes("perez") || nombre.includes("zeledon")) {
    return LOGOS_EQUIPOS["perez zeledon"];
  }

  if (nombre.includes("puntarenas")) {
    return LOGOS_EQUIPOS.puntarenas;
  }

  if (
    nombre.includes("alajuelense") ||
    nombre.includes("liga deportiva")
  ) {
    return LOGOS_EQUIPOS.alajuelense;
  }

  if (nombre.includes("herediano")) {
    return LOGOS_EQUIPOS.herediano;
  }

  // Inter San Carlos
  if (
    nombre.includes("inter san carlos") ||
    nombre === "inter sc" ||
    nombre.includes("inter sc")
  ) {
    return LOGOS_EQUIPOS["inter san carlos"];
  }

  // San Carlos
  if (nombre.includes("san carlos")) {
    return LOGOS_EQUIPOS["san carlos"];
  }

  return "";
}