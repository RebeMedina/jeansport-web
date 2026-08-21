function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-wrap">
        <div className="footer-brand">
          <strong>JEANSPORT</strong>

          <p>Pasión por el fútbol</p>
        </div>

        <div className="footer-social">
          {/* Correo */}
          <a
            href="mailto:jeansportcr@gmail.com"
            aria-label="Correo electrónico"
            className="footer-social-link"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3 5h18v14H3V5zm0 1.5 9 6 9-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/share/197RBtynEE/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="footer-social-link"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v4h4v-4h3.5l.5-4H13V9c0-.7.3-1 1-1z"
                fill="currentColor"
              />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/jeansport_cr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="footer-social-link"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <circle
                cx="12"
                cy="12"
                r="4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </a>

          {/* TikTok */}
          <span
            className="footer-social-link footer-social-disabled"
            aria-label="TikTok próximamente"
            title="TikTok próximamente"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M16.5 3c.4 2.3 1.8 3.8 4 4.1v3.2c-1.5 0-2.8-.4-4-1.1v6.3c0 4-2.8 6.5-6.5 6.5C6.5 22 4 19.5 4 16.2c0-3.2 2.4-5.7 5.7-5.9v3.3c-1.4.1-2.4 1-2.4 2.4 0 1.5 1.1 2.7 2.7 2.7 1.8 0 2.9-1.2 2.9-3.1V3h3.6z"
                fill="currentColor"
              />
            </svg>
          </span>

          {/* YouTube */}
          <span
            className="footer-social-link footer-social-disabled"
            aria-label="YouTube próximamente"
            title="YouTube próximamente"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M21.5 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.5.5a2.8 2.8 0 0 0-2 2C2 8.9 2 12 2 12s0 3.1.5 4.8a2.8 2.8 0 0 0 2 2c1.7.5 7.5.5 7.5.5s5.8 0 7.5-.5a2.8 2.8 0 0 0 2-2c.5-1.7.5-4.8.5-4.8s0-3.1-.5-4.8z"
                fill="currentColor"
              />

              <path d="m10 15.5 5-3.5-5-3.5v7z" fill="var(--panel)" />
            </svg>
          </span>
        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} JeanSport. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
