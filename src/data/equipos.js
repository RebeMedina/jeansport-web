const LOGOS_EQUIPOS = {
"saprissa":
"https://images.statsengine.playbyplay.api.geniussports.com/19b9fd102d9ef48591d37c1aa069d37dT1.png",

"cartagines":
"https://images.statsengine.playbyplay.api.geniussports.com/fa2caa94351bb0b7582389a56a18eb65T1.png",

"sporting":
"https://images.statsengine.playbyplay.api.geniussports.com/8bfadddecfdb8f97f261ff04d51ef209T1.png",

"escorpiones":
"https://images.statsengine.playbyplay.api.geniussports.com/7d615541d195d65e0bf9dccf37a68667T1.jpg",

"perez zeledon":
"https://images.statsengine.playbyplay.api.geniussports.com/2aea1ae2222f8691fbfb1aba3491c8d9T1.png",

"puntarenas":
"https://images.statsengine.playbyplay.api.geniussports.com/fcbb8e831cdde70f3193b6f1d06befe0T1.png",

"alajuelense":
"https://images.statsengine.playbyplay.api.geniussports.com/cc12dc0e1be3a31cbdb19e41082a0e67T1.png",

"herediano":
"https://images.statsengine.playbyplay.api.geniussports.com/097764c20d0c208daab3b0cc955c057eT1.png",

"inter san carlos":
"https://images.statsengine.playbyplay.api.geniussports.com/75dd6c094f9fa26b7ffe7e1c29bab3b4T1.png",

"san carlos":
"https://images.statsengine.playbyplay.api.geniussports.com/0919ab0447ec918050240f581ddb98d1T1.png",
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

if (nombre.includes("inter san carlos")) {
return LOGOS_EQUIPOS["inter san carlos"];
}

if (nombre.includes("san carlos")) {
return LOGOS_EQUIPOS["san carlos"];
}

return "";
}
