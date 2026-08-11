function InstagramCTA() {
  return (
    <section className="instagram-cta container">
      {" "}
      <div>
        {" "}
        <span className="eyebrow">REDES SOCIALES</span>
        <h2>Seguinos en Instagram</h2>
        <p>
          Las noticias, memes y contenido deportivo de JeanSport también están
          en redes.
        </p>
      </div>
      <a
        className="btn btn-primary instagram-button"
        href="https://instagram.com/jeansport_cr"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          className="instagram-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            stroke="currentColor"
            strokeWidth="2"
          />

          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />

          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
        Instagram
      </a>
    </section>
  );
}

export default InstagramCTA;
