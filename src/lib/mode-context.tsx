"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Mode = "demo" | "live";

const ModeContext = createContext<{ mode: Mode; setMode: (m: Mode) => void }>({
  mode: "demo",
  setMode: () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("demo");
  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
