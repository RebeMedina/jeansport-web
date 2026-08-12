import { useState } from "react";

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <a className="brand" href="/" onClick={() => setMenuAbierto(false)}>
          <span className="logo-box">
            <img src="/logo.png" alt="JeanSport" />
          </span>

          <span className="brand-text">
            <strong>JEANSPORT</strong>
            <small>Pasión por el fútbol</small>
          </span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto((prev) => !prev)}
        >
          {menuAbierto ? "✕" : "☰"}
        </button>

        <nav className={`main-nav ${menuAbierto ? "menu-open" : ""}`}>
          <a href="/" onClick={() => setMenuAbierto(false)}>
            Inicio
          </a>

          <a href="/noticias" onClick={() => setMenuAbierto(false)}>
            Noticias
          </a>

          <a href="/resultados" onClick={() => setMenuAbierto(false)}>
            Resultados
          </a>

          <a href="/posiciones" onClick={() => setMenuAbierto(false)}>
            Posiciones
          </a>

          <a href="/goleadores" onClick={() => setMenuAbierto(false)}>
            Goleadores
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
