import { createContext, useContext } from "react";
import { usePartidos } from "../hooks/usePartidos";
import { useNoticias } from "../hooks/useNoticias";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const {
    partidos,
    loading: loadingPartidos,
    error: errorPartidos,
  } = usePartidos({
    pollIntervalMs: 5_000,
  });

  const {
    noticias,
    loading: loadingNoticias,
    error: errorNoticias,
  } = useNoticias({
    pollIntervalMs: 10_000,
  });

  const value = {
    partidos,
    loadingPartidos,
    errorPartidos,

    noticias,
    loadingNoticias,
    errorNoticias,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useAppData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useAppData debe usarse dentro de <DataProvider>");
  }

  return context;
}
