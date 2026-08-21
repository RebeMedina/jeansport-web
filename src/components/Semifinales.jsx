import { obtenerLogo } from "../data/equipos";

const nombresEquipos = {
  "san-carlos": "A.D. San Carlos",
  escorpiones: "Escorpiones F.C.",
  cartagines: "C.S. Cartaginés",
  "inter-sc": "Inter San Carlos",
  herediano: "C.S. Herediano",
  puntarenas: "Puntarenas F.C.",
  saprissa: "Deportivo Saprissa",
  "perez-zeledon": "Municipal Pérez Zeledón",
  sporting: "Sporting F.C.",
  alajuelense: "L.D. Alajuelense",
};

const semifinales = [
  {
    id: "semifinal-1",
    ida: {
      fecha: "2026-12-09",
    },
    vuelta: {
      fecha: "2026-12-12",
    },
    clasificadoLocal: 4,
    clasificadoVisitante: 1,
  },
  {
    id: "semifinal-2",
    ida: {
      fecha: "2026-12-10",
    },
    vuelta: {
      fecha: "2026-12-13",
    },
    clasificadoLocal: 3,
    clasificadoVisitante: 2,
  },
];

const MESES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

function formatearFecha(fechaISO) {
  const [anioStr, mesStr, diaStr] = fechaISO.split("-");

  const anio = Number(anioStr);
  const mes = Number(mesStr);
  const dia = Number(diaStr);

  const fecha = new Date(anio, mes - 1, dia);

  return `${diaStr} ${MESES[mes - 1]} · ${DIAS[fecha.getDay()]}`;
}

function EquipoColumna({ posicion, equipo }) {
  if (!equipo) {
    return (
      <div className="sf-partido-equipo sf-partido-equipo--pendiente">
        <span className="sf-partido-logo--placeholder">{posicion}°</span>

        <span className="sf-partido-nombre">Clasificado {posicion}</span>
      </div>
    );
  }

  return (
    <div className="sf-partido-equipo">
      <img
        className="sf-partido-logo"
        src={obtenerLogo(equipo)}
        alt={nombresEquipos[equipo]}
      />
    </div>
  );
}

function PartidoCard({
  etiqueta,
  fecha,
  posicionLocal,
  posicionVisitante,
  equipoLocal,
  equipoVisitante,
}) {
  return (
    <div className="sf-partido">
      <span className="sf-partido-etiqueta">{etiqueta}</span>

      <div className="sf-partido-fila">
        <EquipoColumna posicion={posicionLocal} equipo={equipoLocal} />

        <div className="sf-partido-marcador">
          <span className="sf-marcador-caja"></span>

          <span className="sf-marcador-guion">-</span>

          <span className="sf-marcador-caja"></span>
        </div>

        <EquipoColumna posicion={posicionVisitante} equipo={equipoVisitante} />
      </div>

      <span className="sf-partido-fecha">{formatearFecha(fecha)}</span>
    </div>
  );
}

export function SemifinalesBracket({ equiposClasificados }) {
  return (
    <div className="sf-bracket">
      <h2 className="sf-titulo">Semifinales</h2>

      {semifinales.map((serie) => {
        const equipoLocal =
          equiposClasificados?.[serie.clasificadoLocal] ?? null;

        const equipoVisitante =
          equiposClasificados?.[serie.clasificadoVisitante] ?? null;

        return (
          <div key={serie.id} className="sf-serie">
            <PartidoCard
              etiqueta="Ida"
              fecha={serie.ida.fecha}
              posicionLocal={serie.clasificadoLocal}
              posicionVisitante={serie.clasificadoVisitante}
              equipoLocal={equipoLocal}
              equipoVisitante={equipoVisitante}
            />

            <PartidoCard
              etiqueta="Vuelta"
              fecha={serie.vuelta.fecha}
              posicionLocal={serie.clasificadoVisitante}
              posicionVisitante={serie.clasificadoLocal}
              equipoLocal={equipoVisitante}
              equipoVisitante={equipoLocal}
            />
          </div>
        );
      })}
    </div>
  );
}

function Semifinales({ equiposClasificados }) {
  return (
    <>
      <section className="container page-hero">
        <span className="eyebrow">PLAYOFFS</span>

        <h1>Semifinales</h1>

        <p>Primera División de Costa Rica</p>
      </section>

      <section className="container section">
        <SemifinalesBracket equiposClasificados={equiposClasificados} />
      </section>
    </>
  );
}

export default Semifinales;
