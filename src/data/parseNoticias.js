function normalizarFecha(fecha) {
  if (!fecha) {
    return "";
  }

  // Si ya viene como Date
  if (fecha instanceof Date) {
    if (Number.isNaN(fecha.getTime())) {
      return "";
    }

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
  }

  const valor = String(fecha).trim();

  if (!valor) {
    return "";
  }

  // Si ya viene como YYYY-MM-DD
  const formatoISO = valor.match(
    /^(\d{4})-(\d{2})-(\d{2})$/,
  );

  if (formatoISO) {
    return valor;
  }

  // Intentar convertir cualquier otro formato
  const fechaConvertida = new Date(valor);

  if (Number.isNaN(fechaConvertida.getTime())) {
    console.warn(
      "No se pudo normalizar la fecha:",
      fecha,
    );

    return "";
  }

  const año = fechaConvertida.getFullYear();
  const mes = String(
    fechaConvertida.getMonth() + 1,
  ).padStart(2, "0");
  const dia = String(
    fechaConvertida.getDate(),
  ).padStart(2, "0");

  return `${año}-${mes}-${dia}`;
}

export function parseNoticias(rawNoticias) {
  const noticias = (rawNoticias || [])
    .filter(
      (noticia) =>
        noticia.id !== undefined &&
        noticia.id !== null &&
        String(noticia.id).trim() !== "",
    )
    .map((noticia) => ({
      id: Number(noticia.id),

      titulo: String(
        noticia.titulo || "",
      ).trim(),

      descripcion: String(
        noticia.descripcion || "",
      ).trim(),

      contenido: String(
        noticia.contenido || "",
      ).trim(),

      autor: String(
        noticia.autor || "",
      ).trim(),

      equipos: String(
        noticia.equipos || "",
      )
        .split(",")
        .map((equipo) => equipo.trim())
        .filter(Boolean),

      fecha: normalizarFecha(
        noticia.fecha,
      ),
    }))
    .filter(
      (noticia) =>
        !Number.isNaN(noticia.id),
    )
    .sort((a, b) => {
      const fechaA = a.fecha
        ? new Date(`${a.fecha}T00:00:00`).getTime()
        : 0;

      const fechaB = b.fecha
        ? new Date(`${b.fecha}T00:00:00`).getTime()
        : 0;

      // Más reciente primero
      if (fechaB !== fechaA) {
        return fechaB - fechaA;
      }

      // Si tienen la misma fecha, ID mayor primero
      return b.id - a.id;
    });

  return noticias;
}