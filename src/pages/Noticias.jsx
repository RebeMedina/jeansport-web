import { obtenerLogo } from "../data/equipos";
import { noticias } from "../data/noticias";


function Noticias() {
return (
<> <section className="container page-hero"> <span className="eyebrow">ACTUALIDAD</span>


    <h1>Noticias</h1>

    <p>
      Las últimas noticias de los equipos de la Primera División de Costa
      Rica.
    </p>
  </section>

  <section className="container section">
    <div className="news-grid noticias-grid">
      {noticias.map((noticia, index) => {
        const logos = noticia.equipos
          .map((equipo) => obtenerLogo(equipo))
          .filter(Boolean);

        return (
          <article
            className={`news-card ${
              index === 0 ? "featured" : ""
            }`}
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

              <small>{noticia.fecha}</small>

              <div className="noticia-action">
                <a
                  href={noticia.enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
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
