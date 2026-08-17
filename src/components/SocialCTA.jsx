function SocialCTA() {
  return (
    <section className="social-cta container">
      <div>
        <span className="eyebrow">REDES SOCIALES</span>
        <h2>Seguinos en redes</h2>
        <p>
          Las noticias y contenido deportivo de JeanSport también están en
          redes.
        </p>
      </div>

      <div className="social-buttons">
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
            <circle
              cx="12"
              cy="12"
              r="4"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
          Instagram
        </a>

        <a
          className="btn btn-primary facebook-button"
          href="https://www.facebook.com/share/197RBtynEE"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            className="facebook-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v5h4v-5h3l1-4h-4V9c0-.6.4-1 1-1Z" />
          </svg>
          Facebook
        </a>
      </div>
    </section>
  );
}

export default SocialCTA;
