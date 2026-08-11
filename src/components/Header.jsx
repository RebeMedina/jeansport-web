function Header() {
  return (
    <header className="site-header">
      {" "}
      <div className="container nav-wrap">
        {" "}
        <a className="brand" href="/">
          {" "}
          <span className="logo-box">
            {" "}
            <img src="/logo.png" alt="JeanSport" />{" "}
            
          </span>
          <span className="brand-text">
            <strong>JEANSPORT</strong>
            <small>Pasión por el fútbol</small>
          </span>
        </a>
        <button
          className="menu-toggle"
          aria-label="Abrir menú"
          aria-expanded="false"
          type="button"
        >
          ☰
        </button>
        <nav className="main-nav">
          <a className="active" href="/">
            Inicio
          </a>

          <a href="/noticias">Noticias</a>

          <a href="/resultados">Resultados</a>

          <a href="/posiciones">Posiciones</a>

          <a href="/goleadores">Goleadores</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
