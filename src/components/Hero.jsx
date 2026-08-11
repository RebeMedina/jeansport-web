import { obtenerLogo } from "../data/equipos";

function Hero() {
  const logoPuntarenas = obtenerLogo("Puntarenas F.C.");

  return (
    <section className="hero container">
      {" "}
      <div className="hero-copy">
        {" "}
        <span className="eyebrow">JEANSPORT</span>
        <h1>
          Todo el fútbol,
          <br />
          <span>en un solo lugar.</span>
        </h1>
        <p>
          Noticias, resultados, tablas y actualidad del fútbol de Costa Rica y
          del mundo.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="/noticias">
            Ver noticias
          </a>

          <a className="btn btn-secondary" href="/resultados">
            Resultados
          </a>
        </div>
      </div>
      <a
        href="/noticias"
        className="hero-card hero-news-card"
        aria-label="Ver noticia de Puntarenas FC"
      >
      
        {logoPuntarenas && (
          <img
            src={logoPuntarenas}
            alt="Escudo de Puntarenas F.C."
            className="hero-news-logo"
          />
        )}

        <h2>Comunicado oficial UNAFUT</h2>

        <p>
          El Comité de Competición concluyó que Puntarenas FC no logró demostrar
          lo interpuesto con el jugador Walter Cortés.
        </p>

        <span className="hero-news-link">Ver noticia →</span>
      </a>
    </section>
  );
}

export default Hero;
