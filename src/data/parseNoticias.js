export function parseNoticias(rawNoticias) {
  return (rawNoticias || [])
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

      fecha: String(
        noticia.fecha || "",
      ).split("T")[0],
    }))
    .filter(
      (noticia) =>
        !Number.isNaN(noticia.id),
    )
    .sort(
      (a, b) =>
        new Date(b.fecha) -
        new Date(a.fecha),
    );
}