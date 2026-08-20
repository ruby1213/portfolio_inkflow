import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { I18N, detectLang } from "./i18n.js";

/* ---------------- Theme (dark mode) ---------------- */
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("yh_theme");
    if (stored) return stored === "dark";
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("yh_theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleDark = useCallback(() => setDark((d) => !d), []);

  const value = useMemo(() => ({ dark, toggleDark }), [dark, toggleDark]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

/* ---------------- i18n ---------------- */
const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem("yh_lang") || detectLang(),
  );

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : lang;
  }, [lang]);

  const setLang = useCallback((l) => {
    setLangState(l);
    localStorage.setItem("yh_lang", l);
  }, []);

  const t = useCallback(
    (key) => I18N[lang]?.[key] ?? I18N.en[key] ?? key,
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
