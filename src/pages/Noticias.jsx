
import { obtenerLogo } from "../data/equipos";
import { noticias } from "../data/noticias";

function calcularTiempoRelativo(fechaISO) {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  const ahora = new Date();

  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const diaFecha = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());

  const diffMs = hoy.getTime() - diaFecha.getTime();
  const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias <= 0) return "Hoy";
  if (diffDias === 1) return "Hace 1 día";
  if (diffDias < 30) return `Hace ${diffDias} días`;

  const diffMeses = Math.floor(diffDias / 30);
  if (diffMeses === 1) return "Hace 1 mes";
  if (diffMeses < 12) return `Hace ${diffMeses} meses`;

  const diffAnios = Math.floor(diffMeses / 12);
  return diffAnios === 1 ? "Hace 1 año" : `Hace ${diffAnios} años`;
}
function Noticias() {
  const noticiasOrdenadas = [...noticias].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha),
  );

  return (
    <>
      <section className="container page-hero">
        <span className="eyebrow">ACTUALIDAD</span>

        <h1>Noticias</h1>

        <p>
          Las últimas noticias de los equipos de la Primera División de Costa
          Rica.
        </p>
      </section>

      <section className="container section">
        <div className="news-grid noticias-grid">
          {noticiasOrdenadas.map((noticia, index) => {
            const logos = noticia.equipos
              .map((equipo) => obtenerLogo(equipo))
              .filter(Boolean);

            return (
              <article
                className={`news-card ${index === 0 ? "featured" : ""}`}
                key={noticia.titulo}
              >
                <div className="news-image noticias-logos">
                  <div className="noticias-logos-container">
                    {logos.map((logo, logoIndex) => (
                      <img
                        key={`${noticia.titulo}-${logoIndex}`}
                        src={logo}
                        alt={`Logo de ${noticia.equipos[logoIndex]}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="news-content">
                  <span className="tag">LIGA PROMERICA</span>

                  <h3>{noticia.titulo}</h3>

                  <p>{noticia.descripcion}</p>

                  <small>{calcularTiempoRelativo(noticia.fecha)}</small>

                  <div className="noticia-action">
                    <a
                      href={noticia.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary">
                      Ver publicación →
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default Noticias;