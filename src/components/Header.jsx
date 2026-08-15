import { useState } from "react";
import { Link } from "react-router";

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" to="/" onClick={cerrarMenu}>
          <span className="logo-box">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="JeanSport" />
          </span>

          <span className="brand-text">
            <strong>JEANSPORT</strong>
            <small>Pasión por el fútbol</small>
          </span>
        </Link>

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
          <Link to="/" onClick={cerrarMenu}>
            Inicio
          </Link>

          <Link to="/noticias" onClick={cerrarMenu}>
            Noticias
          </Link>

          <Link to="/resultados" onClick={cerrarMenu}>
            Resultados
          </Link>

          <Link to="/posiciones" onClick={cerrarMenu}>
            Posiciones
          </Link>

          <Link to="/estadisticas" onClick={cerrarMenu}>
            Estadísticas
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
