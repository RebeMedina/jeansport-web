import { useEffect, useRef, useState } from "react";
import { fetchSheet } from "../data/sheets";
import { parseNoticias } from "../data/parseNoticias";

const DEFAULT_POLL_MS = 10_000;

const CACHE_KEY = "jeansport_noticias_cache";

function obtenerCache() {
  try {
    const cache = localStorage.getItem(CACHE_KEY);

    if (!cache) {
      return null;
    }

    const datos = JSON.parse(cache);

    if (!Array.isArray(datos)) {
      return null;
    }

    return datos;
  } catch (error) {
    console.error(
      "Error leyendo cache de noticias:",
      error
    );

    return null;
  }
}

function guardarCache(noticias) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify(noticias)
    );
  } catch (error) {
    console.error(
      "Error guardando cache de noticias:",
      error
    );
  }
}

export function useNoticias({
  pollIntervalMs = DEFAULT_POLL_MS,
} = {}) {
  const [noticias, setNoticias] = useState(() => {
    return obtenerCache() || [];
  });

  const [loading, setLoading] = useState(() => {
    return obtenerCache() === null;
  });

  const [error, setError] = useState(null);

  const timerRef = useRef(null);

  const cargandoRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (cargandoRef.current) {
        return;
      }

      cargandoRef.current = true;

      try {
        const rawNoticias = await fetchSheet("Noticias");

        if (cancelled) {
          return;
        }

        const nuevasNoticias = parseNoticias(rawNoticias);

        setNoticias(nuevasNoticias);

        guardarCache(nuevasNoticias);

        setError(null);
      } catch (err) {
        console.error(
          "Error cargando noticias:",
          err
        );

        if (!cancelled) {
          setError(err);
        }
      } finally {
        cargandoRef.current = false;

        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    timerRef.current = setInterval(
      load,
      pollIntervalMs
    );

    return () => {
      cancelled = true;

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [pollIntervalMs]);

  return {
    noticias,
    loading,
    error,
  };
}