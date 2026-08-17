import { Link } from "react-router";
import { obtenerLogo } from "../data/equipos";
import { noticias } from "../data/noticias";

function Hero() {
  const noticiaReciente = [...noticias].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha),
  )[0];

  const logo = obtenerLogo(noticiaReciente?.equipos?.[0]);

  return (
    <section className="hero container">
      <div className="hero-copy">
        <span className="eyebrow">JEANSPORT</span>

        <h1>
          Todo el fútbol,
          <br />
          <span>en un solo lugar.</span>
        </h1>

        <p>
          Noticias, resultados, tablas y actualidad del fútbol de Costa Rica.
        </p>

      </div>

      {noticiaReciente && (
        <Link
          to="/noticias"
          className="hero-card hero-news-card"
          aria-label={`Ver noticia: ${noticiaReciente.titulo}`}
        >
          {logo && (
            <img
              src={logo}
              alt={`Escudo de ${noticiaReciente.equipos[0]}`}
              className="hero-news-logo"
            />
          )}

          <h2>{noticiaReciente.titulo}</h2>

          <p>{noticiaReciente.descripcion}</p>

          <span className="hero-news-link">Ver noticia →</span>
        </Link>
      )}
    </section>
  );
}

export default Hero;
