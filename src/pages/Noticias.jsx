import { useEffect, useState } from "react";
import { obtenerLogo } from "../data/equipos";
import { useAppData } from "../context/DataContext";
import NoticiaModal from "../components/NoticiaModal";

function calcularTiempoRelativo(fechaISO) {
  if (!fechaISO) return "";

  const fecha = new Date(`${fechaISO}T00:00:00`);
  const ahora = new Date();

  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

  const diaFecha = new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
  );

  const diffMs = hoy.getTime() - diaFecha.getTime();

  const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias <= 0) {
    return "Hoy";
  }

  if (diffDias === 1) {
    return "Hace 1 día";
  }

  if (diffDias < 30) {
    return `Hace ${diffDias} días`;
  }

  const diffMeses = Math.floor(diffDias / 30);

  if (diffMeses === 1) {
    return "Hace 1 mes";
  }

  if (diffMeses < 12) {
    return `Hace ${diffMeses} meses`;
  }

  const diffAnios = Math.floor(diffMeses / 12);

  return diffAnios === 1 ? "Hace 1 año" : `Hace ${diffAnios} años`;
}

function Noticias() {
  const { noticias, loadingNoticias, errorNoticias } = useAppData();

  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);

  /*
   * ============================================================
   * CERRAR MODAL CON ESC
   * ============================================================
   */

  useEffect(() => {
    function manejarEscape(event) {
      if (event.key === "Escape") {
        setNoticiaSeleccionada(null);
      }
    }

    if (noticiaSeleccionada) {
      document.addEventListener("keydown", manejarEscape);
    }

    return () => {
      document.removeEventListener("keydown", manejarEscape);
    };
  }, [noticiaSeleccionada]);

  /*
   * ============================================================
   * BLOQUEAR SCROLL CUANDO EL MODAL ESTÁ ABIERTO
   * ============================================================
   */

  useEffect(() => {
    if (noticiaSeleccionada) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [noticiaSeleccionada]);

  /*
   * ============================================================
   * ABRIR NOTICIA
   * ============================================================
   */

  function abrirNoticia(noticia) {
    setNoticiaSeleccionada(noticia);
  }

  /*
   * ============================================================
   * CERRAR NOTICIA
   * ============================================================
   */

  function cerrarNoticia() {
    setNoticiaSeleccionada(null);
  }

  /*
   * ============================================================
   * ORDENAR NOTICIAS
   * ============================================================
   *
   * Google Sheets puede estar ordenado de antigua a nueva.
   * Aquí las mostramos de nueva a antigua.
   */

  const noticiasOrdenadas = [...noticias].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha),
  );

  /*
   * ============================================================
   * LOADING INICIAL
   * ============================================================
   *
   * Si ya tenemos noticias provenientes del cache,
   * NO mostramos "Cargando noticias".
   */

  if (loadingNoticias && noticias.length === 0) {
    return (
      <section className="container section">
        <p>Cargando noticias...</p>
      </section>
    );
  }

  /*
   * ============================================================
   * ERROR
   * ============================================================
   *
   * Si tenemos datos cacheados, seguimos mostrando esos datos
   * aunque falle una actualización.
   */

  if (errorNoticias && noticias.length === 0) {
    return (
      <section className="container section">
        <p>No se pudieron cargar las noticias. Intenta de nuevo más tarde.</p>
      </section>
    );
  }

  return (
    <>
      {/* ======================================================
          HERO DE LA PÁGINA
      ====================================================== */}

      <section className="container page-hero">
        <span className="eyebrow">ACTUALIDAD</span>

        <h1>Noticias</h1>

        <p>
          Las últimas noticias de los equipos de la Primera División de Costa
          Rica.
        </p>
      </section>

      {/* ======================================================
          LISTADO DE NOTICIAS
      ====================================================== */}

      <section className="container section">
        <div className="news-grid noticias-grid">
          {noticiasOrdenadas.map((noticia, index) => {
            const logos = (noticia.equipos || [])
              .map((equipo) => obtenerLogo(equipo))
              .filter(Boolean);

            return (
              <article
                className={`news-card ${index === 0 ? "featured" : ""}`}
                key={noticia.id}
              >
                {/* ==========================================
                      LOGOS
                  ========================================== */}

                <div className="news-image noticias-logos">
                  <div className="noticias-logos-container">
                    {logos.map((logo, logoIndex) => (
                      <img
                        key={`${noticia.id}-${logoIndex}`}
                        src={logo}
                        alt={`Logo de ${noticia.equipos[logoIndex]}`}
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                </div>

                {/* ==========================================
                      CONTENIDO DE LA CARD
                  ========================================== */}

                <div className="news-content">
                  <span className="tag">LIGA PROMERICA</span>

                  <h3>{noticia.titulo}</h3>

                  <p>{noticia.descripcion}</p>

                  {/* ================================
                        FECHA + AUTOR
                    ================================= */}

                  <div className="noticia-meta">
                    <small>{calcularTiempoRelativo(noticia.fecha)}</small>

                    {noticia.autor && (
                      <>
                        <span>•</span>

                        <small>{noticia.autor}</small>
                      </>
                    )}
                  </div>

                  {/* ================================
                        BOTÓN
                    ================================= */}

                  <div className="noticia-action">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => abrirNoticia(noticia)}
                    >
                      Leer nota completa
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ======================================================
          MODAL
      ====================================================== */}

      {noticiaSeleccionada && (
        <NoticiaModal noticia={noticiaSeleccionada} onClose={cerrarNoticia} />
      )}
    </>
  );
}

export default Noticias;
