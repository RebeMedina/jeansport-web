function Hero() {
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
      <div className="hero-card">
        <div className="ball">⚽</div>
        <p>FÚTBOL · NOTICIAS · RESULTADOS</p>
      </div>
    </section>
  );
}

export default Hero;
