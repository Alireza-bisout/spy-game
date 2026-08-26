"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useState } from "react";

const Ctx = createContext(null);

function apply(next) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(next);
  root.style.colorScheme = next;
  try {
    localStorage.setItem("spy-theme", next);
  } catch {}
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("dark");

  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem("spy-theme");
      if (saved === "light" || saved === "dark") {
        setThemeState(saved);
        apply(saved);
      }
    } catch {}
  }, []);

  const setTheme = useCallback((next) => {
    const value = next === "light" ? "light" : "dark";
    setThemeState(value);
    apply(value);
  }, []);

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme");
  return v;
}
