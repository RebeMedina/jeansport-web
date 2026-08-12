import { obtenerLogo } from "../data/equipos";

function NewsSection() {
  const logoPuntarenas = obtenerLogo("Puntarenas F.C.");

  return (
    <section className="container section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">ACTUALIDAD</span>
          <h2>Últimas noticias</h2>
        </div>

        <a href="/noticias">Ver todas →</a>
      </div>

      <div className="news-grid">
        <article className="news-card featured">
          <div className="news-image gradient-one noticias-logos">
            {logoPuntarenas && (
              <img
                src={logoPuntarenas}
                alt="Escudo de Puntarenas F.C."
                className="news-team-logo"
              />
            )}
          </div>

          <div className="news-content">
            <span className="tag">LIGA PROMERICA</span>

            <h3>Comunicado oficial UNAFUT</h3>

            <p>
              El Comité de Competición concluyó que Puntarenas FC no logró
              demostrar lo interpuesto con el jugador Walter Cortés.
            </p>

            <small>Hace 2 días · JeanSport</small>

            <div className="noticia-action">
              <a
                href="https://www.instagram.com/p/Db6ikwxmzUq/?img_index=1"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Ver publicación →
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default NewsSection;
