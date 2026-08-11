function Footer() {
  return (
    <footer className="site-footer">
      {" "}
      <div className="container footer-wrap">
        {" "}
        <div>
          {" "}
          <strong>JEANSPORT</strong> <p>Pasión por el fútbol.</p>{" "}
        </div>
        <div>
          <h3>Contacto</h3>

          <p>
            📧 <a href="mailto:jeansportcr@gmail.com">jeansportcr@gmail.com</a>
          </p>
        </div>
        <p>
          © {new Date().getFullYear()} JeanSport. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
