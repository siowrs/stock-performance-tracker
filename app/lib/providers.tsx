"use client";

import { createContext, useContext, useState } from "react";
type SelectedContext = {
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
};

const SelectedContext = createContext<SelectedContext | null>(null);

export function SelectorProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <SelectedContext.Provider
      value={{
        selected,
        setSelected,
      }}
    >
      {children}
    </SelectedContext.Provider>
  );
}

export function useSelectedContext() {
  const context = useContext(SelectedContext);

  if (!context) {
    throw new Error(
      "useSelectedContext must be used within a SelectedContextProvider"
    );
  }

  return context;
}
