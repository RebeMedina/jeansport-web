import { partidos } from "../data/partidos";
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
function ResultsSection() {
  const resultados = partidos
    .filter((partido) => partido.estado === "finalizado")
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 3);
  const formatearFecha = (fecha) => {
    const [, mes, dia] = fecha.split("-");
    return `${dia}.${mes}`;
  };
  return (
    <section className="container section">
      {" "}
      <div className="section-heading">
        {" "}
        <div>
          {" "}
          <span className="eyebrow">COSTA RICA</span>{" "}
          <h2>Resultados recientes</h2>{" "}
        </div>{" "}
        <a href="/resultados" className="section-link">
          {" "}
          Ver resultados →{" "}
        </a>{" "}
      </div>{" "}
      <div className="resultados-container">
        {" "}
        {resultados.map((partido) => {
          const nombreLocal = nombresEquipos[partido.local] || partido.local;
          const nombreVisitante =
            nombresEquipos[partido.visitante] || partido.visitante;
          const logoLocal = obtenerLogo(nombreLocal);
          const logoVisitante = obtenerLogo(nombreVisitante);
          return (
            <article className="resultado-card" key={partido.id}>
              {" "}
              <div className="resultado-header">
                {" "}
                <span className="resultado-fecha">
                  {" "}
                  {formatearFecha(partido.fecha)}{" "}
                </span>{" "}
                <span>Jornada {partido.jornada}</span>{" "}
              </div>{" "}
              <div className="resultado-partido">
                {" "}
                <div className="equipo equipo-local">
                  {" "}
                  <strong className="equipo-nombre">
                    {" "}
                    {nombreLocal}{" "}
                  </strong>{" "}
                  {logoLocal && (
                    <img
                      className="equipo-logo"
                      src={logoLocal}
                      alt={`Escudo de ${nombreLocal}`}
                    />
                  )}{" "}
                </div>{" "}
                <div className="resultado-marcador">
                  {" "}
                  <strong className="marcador">
                    {" "}
                    {partido.golesLocal} - {partido.golesVisitante}{" "}
                  </strong>{" "}
                  <span className="estado-partido"> Finalizado </span>{" "}
                </div>{" "}
                <div className="equipo equipo-visitante">
                  {" "}
                  {logoVisitante && (
                    <img
                      className="equipo-logo"
                      src={logoVisitante}
                      alt={`Escudo de ${nombreVisitante}`}
                    />
                  )}{" "}
                  <strong className="equipo-nombre">
                    {" "}
                    {nombreVisitante}{" "}
                  </strong>{" "}
                </div>{" "}
              </div>{" "}
            </article>
          );
        })}{" "}
      </div>{" "}
    </section>
  );
}
export default ResultsSection;
