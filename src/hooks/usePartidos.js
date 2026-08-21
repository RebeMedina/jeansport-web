import { useEffect, useRef, useState } from "react";
import { fetchSheet } from "../data/sheets";
import { parsePartidos } from "../data/parsePartidos";

const DEFAULT_POLL_MS = 5_000;
const CACHE_KEY = "jeansport_partidos_cache";

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
    console.error("Error leyendo cache de partidos:", error);
    return null;
  }
}

function guardarCache(partidos) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify(partidos)
    );
  } catch (error) {
    console.error("Error guardando cache de partidos:", error);
  }
}

export function usePartidos({
  pollIntervalMs = DEFAULT_POLL_MS,
} = {}) {
  const [partidos, setPartidos] = useState(() => {
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
        const [rawPartidos, rawGoles] = await Promise.all([
          fetchSheet("Partidos"),
          fetchSheet("Goles"),
        ]);

        if (cancelled) {
          return;
        }

        const nuevosPartidos = parsePartidos(
          rawPartidos,
          rawGoles
        );

        setPartidos(nuevosPartidos);

        guardarCache(nuevosPartidos);

        setError(null);
      } catch (err) {
        console.error("Error cargando partidos:", err);

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
    partidos,
    loading,
    error,
  };
}