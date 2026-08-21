import { useEffect, useState } from "react";
import { obtenerLogo } from "../data/equipos";
import { useAppData } from "../context/DataContext";
import NoticiaModal from "../components/NoticiaModal";

/*
 * ============================================================
 * CONVERTIR FECHA
 * ============================================================
 *
 * Google Sheets puede entregar la fecha como:
 *
 * 2026-08-20
 *
 * o como:
 *
 * Wed Aug 20 2026 00:00:00 GMT-0600 (...)
 *
 * Esta función soporta ambos formatos.
 */

function convertirFecha(fecha) {
  if (!fecha) {
    return null;
  }

  /*
   * Si ya es un objeto Date
   */
  if (fecha instanceof Date) {
    if (!Number.isNaN(fecha.getTime())) {
      return fecha;
    }

    return null;
  }

  const valor = String(fecha).trim();

  if (!valor) {
    return null;
  }

  /*
   * ==========================================================
   * FORMATO YYYY-MM-DD
   * ==========================================================
   *
   * Lo convertimos manualmente para evitar problemas de zona
   * horaria.
   */

  const match = valor.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (match) {
    const [, anio, mes, dia] = match;

    const fechaLocal = new Date(Number(anio), Number(mes) - 1, Number(dia));

    if (!Number.isNaN(fechaLocal.getTime())) {
      return fechaLocal;
    }
  }

  /*
   * ==========================================================
   * OTROS FORMATOS
   * ==========================================================
   */

  const fechaConvertida = new Date(valor);

  if (!Number.isNaN(fechaConvertida.getTime())) {
    return fechaConvertida;
  }

  console.warn("No se pudo convertir la fecha:", fecha);

  return null;
}

/*
 * ============================================================
 * TIEMPO RELATIVO
 * ============================================================
 */

function calcularTiempoRelativo(fechaOriginal) {
  const fecha = convertirFecha(fechaOriginal);

  if (!fecha) {
    return "Fecha no disponible";
  }

  const ahora = new Date();

  /*
   * Normalizamos ambas fechas a medianoche.
   */

  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

  const diaFecha = new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
  );

  const diffMs = hoy.getTime() - diaFecha.getTime();

  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  /*
   * Fecha futura
   */

  if (diffDias < 0) {
    return "Próximamente";
  }

  /*
   * Hoy
   */

  if (diffDias === 0) {
    return "Hoy";
  }

  /*
   * Ayer
   */

  if (diffDias === 1) {
    return "Hace 1 día";
  }

  /*
   * Menos de 30 días
   */

  if (diffDias < 30) {
    return `Hace ${diffDias} días`;
  }

  /*
   * Meses
   */

  const diffMeses = Math.floor(diffDias / 30);

  if (diffMeses === 1) {
    return "Hace 1 mes";
  }

  if (diffMeses < 12) {
    return `Hace ${diffMeses} meses`;
  }

  /*
   * Años
   */

  const diffAnios = Math.floor(diffMeses / 12);

  if (diffAnios === 1) {
    return "Hace 1 año";
  }

  return `Hace ${diffAnios} años`;
}

/*
 * ============================================================
 * FORMATO DE FECHA
 * ============================================================
 *
 * Esto es opcional pero útil para el modal o para mostrar
 * una fecha completa si después quieres utilizarla.
 */

function formatearFecha(fechaOriginal) {
  const fecha = convertirFecha(fechaOriginal);

  if (!fecha) {
    return "Fecha no disponible";
  }

  return fecha.toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/*
 * ============================================================
 * COMPONENTE
 * ============================================================
 */

function Noticias() {
  const { noticias, loadingNoticias, errorNoticias } = useAppData();

  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);

  /*
   * ==========================================================
   * CERRAR MODAL CON ESC
   * ==========================================================
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
   * ==========================================================
   * BLOQUEAR SCROLL DEL BODY
   * ==========================================================
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
   * ==========================================================
   * ABRIR NOTICIA
   * ==========================================================
   */

  function abrirNoticia(noticia) {
    setNoticiaSeleccionada(noticia);
  }

  /*
   * ==========================================================
   * CERRAR NOTICIA
   * ==========================================================
   */

  function cerrarNoticia() {
    setNoticiaSeleccionada(null);
  }

  /*
   * ==========================================================
   * ORDENAR NOTICIAS
   * ==========================================================
   *
   * MÁS RECIENTE
   *       ↓
   * MÁS ANTIGUA
   *
   * Si dos noticias tienen la misma fecha, usamos el ID
   * para mantener un orden consistente.
   */

  const noticiasOrdenadas = [...(noticias || [])].sort((a, b) => {
    const fechaA = convertirFecha(a.fecha);

    const fechaB = convertirFecha(b.fecha);

    /*
     * Si ambas fechas existen
     */

    if (fechaA && fechaB) {
      const diferencia = fechaB.getTime() - fechaA.getTime();

      /*
       * Si tienen fechas diferentes,
       * la más reciente va primero.
       */

      if (diferencia !== 0) {
        return diferencia;
      }
    }

    /*
     * Si tienen la misma fecha,
     * el ID más alto va primero.
     */

    return Number(b.id || 0) - Number(a.id || 0);
  });

  /*
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (loadingNoticias && noticias.length === 0) {
    return (
      <section className="container section">
        <p>Cargando noticias...</p>
      </section>
    );
  }

  /*
   * ==========================================================
   * ERROR
   * ==========================================================
   */

  if (errorNoticias && noticias.length === 0) {
    return (
      <section className="container section">
        <p>No se pudieron cargar las noticias. Intenta de nuevo más tarde.</p>
      </section>
    );
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      {/* ======================================================
          HERO
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
          LISTADO
      ====================================================== */}

      <section className="container section">
        <div className="news-grid noticias-grid">
          {noticiasOrdenadas.map((noticia, index) => {
            /*
             * ==================================================
             * LOGOS
             * ==================================================
             */

            const logos = (noticia.equipos || [])
              .map((equipo) => obtenerLogo(equipo))
              .filter(Boolean);

            /*
             * ==================================================
             * FECHA
             * ==================================================
             */

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
                        alt={`Logo de ${noticia.equipos?.[logoIndex] || ""}`}
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                </div>

                {/* ==========================================
                      CONTENIDO
                  ========================================== */}

                <div className="news-content">
                  <span className="tag">LIGA PROMERICA</span>

                  <h3>{noticia.titulo}</h3>

                  <p>{noticia.descripcion}</p>

                  {/* ======================================
                        FECHA + AUTOR
                    ====================================== */}

                  <div className="noticia-meta">
                    <small>{calcularTiempoRelativo(noticia.fecha)}</small>

                    {noticia.autor && (
                      <>
                        <span>•</span>

                        <small>{noticia.autor}</small>
                      </>
                    )}
                  </div>

                  {/* ======================================
                        BOTÓN
                    ====================================== */}

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
