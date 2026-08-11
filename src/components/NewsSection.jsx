function NewsSection() {
  return (
    <section className="container section">
      {" "}
      <div className="section-heading">
        {" "}
        <div>
          {" "}
          <span className="eyebrow">ACTUALIDAD</span>{" "}
          <h2>Últimas noticias</h2>{" "}
        </div>
        <a href="/noticias">Ver todas →</a>
      </div>
      <div className="news-grid">
        <article className="news-card featured">
          <div className="news-image gradient-one">
            <span>⚽</span>
          </div>

          <div className="news-content">
            <span className="tag">Costa Rica</span>

            <h3>Aquí irá tu noticia principal de JeanSport</h3>

            <p>
              Reemplaza este contenido por la noticia que quieras destacar en
              portada.
            </p>

            <small>Hoy · JeanSport</small>
          </div>
        </article>

        <article className="news-card">
          <div className="news-image gradient-two">
            <span>🏆</span>
          </div>

          <div className="news-content">
            <span className="tag">Liga Nacional</span>

            <h3>Resultados y novedades de la jornada</h3>

            <small>Hoy · JeanSport</small>
          </div>
        </article>

        <article className="news-card">
          <div className="news-image gradient-three">
            <span>🌎</span>
          </div>

          <div className="news-content">
            <span className="tag">Internacional</span>

            <h3>Las noticias que están marcando el fútbol mundial</h3>

            <small>Hoy · JeanSport</small>
          </div>
        </article>
      </div>
    </section>
  );
}

export default NewsSection;
