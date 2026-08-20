import { obtenerLogo } from "../data/equipos";

function calcularFecha(fechaISO) {
  if (!fechaISO) return "";

  const fecha = new Date(`${fechaISO}T00:00:00`);

  return fecha.toLocaleDateString("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function NoticiaModal({ noticia, onClose }) {
  if (!noticia) return null;

  const logos = (noticia.equipos || [])
    .map((equipo) => obtenerLogo(equipo))
    .filter(Boolean);

  function manejarClickFondo(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="noticia-modal-overlay" onClick={manejarClickFondo}>
      <div
        className="noticia-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="noticia-modal-titulo"
      >
        <button
          type="button"
          className="noticia-modal-cerrar"
          onClick={onClose}
          aria-label="Cerrar noticia"
        >
          ×
        </button>

        <div className="noticia-modal-logos">
          {logos.map((logo, index) => (
            <img
              key={`${noticia.id}-${index}`}
              src={logo}
              alt={`Logo de ${noticia.equipos[index]}`}
              referrerPolicy="no-referrer"
            />
          ))}
        </div>

        <div className="noticia-modal-contenido">
          <span className="tag">LIGA PROMERICA</span>

          <h2 id="noticia-modal-titulo">{noticia.titulo}</h2>

          <p className="noticia-modal-descripcion">{noticia.descripcion}</p>

          <div className="noticia-modal-meta">
            <span>{calcularFecha(noticia.fecha)}</span>

            {noticia.autor && (
              <>
                <span>•</span>
                <span>{noticia.autor}</span>
              </>
            )}
          </div>

          <div className="noticia-modal-linea" />

          <div className="noticia-modal-texto">
            {noticia.contenido ? (
              noticia.contenido
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((parrafo, index) => <p key={index}>{parrafo}</p>)
            ) : (
              <p>No hay contenido adicional para esta noticia.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoticiaModal;
