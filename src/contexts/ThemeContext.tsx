import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ThemePreset {
  id: string;
  name: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    gradientFirst: string;
    gradientSecond: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    input: string;
    ring: string;
    pinkSoft: string;
    pinkMedium: string;
    pinkDark: string;
    lavender: string;
    lavenderDark: string;
    cream: string;
    coral: string;
    shadowSoft: string;
    shadowCard: string;
    shadowButton: string;
  };
}

export const themePresets: ThemePreset[] = [
  {
    id: "pink",
    name: "Розовая",
    colors: {
      background: "350 100% 98%",
      foreground: "340 30% 25%",
      card: "0 0% 100%",
      cardForeground: "340 30% 25%",
      primary: "340 80% 65%",
      primaryForeground: "0 0% 100%",
      gradientFirst: "340 80% 65%",
      gradientSecond: "320 70% 60%",
      muted: "340 40% 94%",
      mutedForeground: "340 20% 50%",
      accent: "20 90% 75%",
      accentForeground: "20 60% 25%",
      border: "340 40% 90%",
      input: "340 40% 92%",
      ring: "340 80% 65%",
      pinkSoft: "350 80% 88%",
      pinkMedium: "340 75% 75%",
      pinkDark: "340 60% 55%",
      lavender: "280 60% 88%",
      lavenderDark: "280 50% 70%",
      cream: "40 60% 96%",
      coral: "15 85% 70%",
      shadowSoft: "0 4px 20px -4px hsl(340 60% 70% / 0.25)",
      shadowCard: "0 8px 30px -8px hsl(340 60% 60% / 0.2)",
      shadowButton: "0 4px 15px -3px hsl(340 80% 60% / 0.4)",
    },
  },
  {
    id: "purple",
    name: "Фиолетовая",
    colors: {
      background: "270 60% 98%",
      foreground: "270 30% 20%",
      card: "0 0% 100%",
      cardForeground: "270 30% 20%",
      primary: "270 60% 60%",
      primaryForeground: "0 0% 100%",
      gradientFirst: "270 60% 60%",
      gradientSecond: "170 50% 42%",
      muted: "270 30% 94%",
      mutedForeground: "270 15% 50%",
      accent: "320 60% 70%",
      accentForeground: "320 50% 25%",
      border: "270 30% 88%",
      input: "270 30% 92%",
      ring: "270 60% 60%",
      pinkSoft: "270 50% 90%",
      pinkMedium: "270 50% 72%",
      pinkDark: "270 45% 50%",
      lavender: "280 60% 88%",
      lavenderDark: "280 50% 65%",
      cream: "270 30% 96%",
      coral: "320 60% 70%",
      shadowSoft: "0 4px 20px -4px hsl(270 50% 60% / 0.25)",
      shadowCard: "0 8px 30px -8px hsl(270 50% 55% / 0.2)",
      shadowButton: "0 4px 15px -3px hsl(270 60% 55% / 0.4)",
    },
  },
  {
    id: "mint",
    name: "Мятная",
    colors: {
      background: "160 50% 97%",
      foreground: "160 30% 20%",
      card: "0 0% 100%",
      cardForeground: "160 30% 20%",
      primary: "160 55% 45%",
      primaryForeground: "0 0% 100%",
      gradientFirst: "160 55% 45%",
      gradientSecond: "160 55% 45%",
      muted: "160 30% 93%",
      mutedForeground: "160 15% 45%",
      accent: "140 50% 60%",
      accentForeground: "140 40% 20%",
      border: "160 30% 88%",
      input: "160 30% 91%",
      ring: "160 55% 45%",
      pinkSoft: "160 40% 88%",
      pinkMedium: "160 45% 65%",
      pinkDark: "160 40% 40%",
      lavender: "180 40% 88%",
      lavenderDark: "180 35% 60%",
      cream: "160 25% 96%",
      coral: "140 50% 60%",
      shadowSoft: "0 4px 20px -4px hsl(160 45% 50% / 0.25)",
      shadowCard: "0 8px 30px -8px hsl(160 45% 45% / 0.2)",
      shadowButton: "0 4px 15px -3px hsl(160 55% 42% / 0.4)",
    },
  },
  {
    id: "orange",
    name: "Оранжевая",
    colors: {
      background: "25 80% 97%",
      foreground: "20 35% 22%",
      card: "0 0% 100%",
      cardForeground: "20 35% 22%",
      primary: "20 80% 60%",
      primaryForeground: "0 0% 100%",
      gradientFirst: "20 80% 60%",
      gradientSecond: "15 70% 55%",
      muted: "25 40% 93%",
      mutedForeground: "20 20% 48%",
      accent: "10 70% 65%",
      accentForeground: "10 50% 22%",
      border: "25 35% 88%",
      input: "25 35% 91%",
      ring: "20 80% 60%",
      pinkSoft: "25 60% 90%",
      pinkMedium: "20 65% 72%",
      pinkDark: "20 55% 50%",
      lavender: "35 50% 88%",
      lavenderDark: "35 40% 62%",
      cream: "40 60% 96%",
      coral: "10 70% 65%",
      shadowSoft: "0 4px 20px -4px hsl(20 60% 55% / 0.25)",
      shadowCard: "0 8px 30px -8px hsl(20 60% 50% / 0.2)",
      shadowButton: "0 4px 15px -3px hsl(20 80% 55% / 0.4)",
    },
  },
  {
    id: "night",
    name: "Ночная",
    colors: {
      background: "240 20% 12%",
      foreground: "240 15% 90%",
      card: "240 20% 16%",
      cardForeground: "240 15% 90%",
      primary: "260 60% 65%",
      primaryForeground: "0 0% 100%",
      gradientFirst: "260 60% 55%",
      gradientSecond: "280 50% 50%",
      muted: "240 18% 20%",
      mutedForeground: "240 10% 60%",
      accent: "280 50% 60%",
      accentForeground: "280 30% 92%",
      border: "240 15% 22%",
      input: "240 18% 22%",
      ring: "260 60% 65%",
      pinkSoft: "240 15% 20%",
      pinkMedium: "260 40% 50%",
      pinkDark: "260 35% 40%",
      lavender: "250 25% 25%",
      lavenderDark: "250 30% 45%",
      cream: "240 15% 18%",
      coral: "280 50% 60%",
      shadowSoft: "0 4px 20px -4px hsl(260 50% 30% / 0.4)",
      shadowCard: "0 8px 30px -8px hsl(260 50% 25% / 0.4)",
      shadowButton: "0 4px 15px -3px hsl(260 60% 40% / 0.5)",
    },
  },
];

interface ThemeContextType {
  currentTheme: ThemePreset;
  setTheme: (id: string) => void;
  setCustomColors: (colors: Record<string, string>) => void;
  backgroundImage: string | null;
  setBackgroundImage: (url: string | null) => void;
  backgroundOpacity: number;
  setBackgroundOpacity: (v: number) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}

function applyTheme(theme: ThemePreset) {
  const root = document.documentElement;
  const c = theme.colors;
  root.style.setProperty("--background", c.background);
  root.style.setProperty("--foreground", c.foreground);
  root.style.setProperty("--card", c.card);
  root.style.setProperty("--card-foreground", c.cardForeground);
  root.style.setProperty("--primary", c.primary);
  root.style.setProperty("--primary-foreground", c.primaryForeground);
  root.style.setProperty("--gradient-first", c.gradientFirst);
  root.style.setProperty("--gradient-second", c.gradientSecond);
  root.style.setProperty("--gradient", "linear-gradient(135deg, hsl(var(--gradient-first)) 0%, hsl(var(--gradient-second)) 100%)");
  root.style.setProperty("--muted", c.muted);
  root.style.setProperty("--muted-foreground", c.mutedForeground);
  root.style.setProperty("--accent", c.accent);
  root.style.setProperty("--accent-foreground", c.accentForeground);
  root.style.setProperty("--border", c.border);
  root.style.setProperty("--input", c.input);
  root.style.setProperty("--ring", c.ring);
  root.style.setProperty("--pink-soft", c.pinkSoft);
  root.style.setProperty("--pink-medium", c.pinkMedium);
  root.style.setProperty("--pink-dark", c.pinkDark);
  root.style.setProperty("--lavender", c.lavender);
  root.style.setProperty("--lavender-dark", c.lavenderDark);
  root.style.setProperty("--cream", c.cream);
  root.style.setProperty("--coral", c.coral);
  root.style.setProperty("--shadow-soft", c.shadowSoft);
  root.style.setProperty("--shadow-card", c.shadowCard);
  root.style.setProperty("--shadow-button", c.shadowButton);
}

const cssVarMap: Record<string, string> = {
  primary: "--primary",
  gradient: "--gradient",
  foreground: "--foreground",
  accent: "--accent",
  background: "--background",
  muted: "--muted",
  card: "--card",
  border: "--border",
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(() => {
    const saved = localStorage.getItem("theme-id");
    const base = themePresets.find((t) => t.id === saved) || themePresets[0];
    const customStr = localStorage.getItem("custom-colors");
    if (customStr) {
      try {
        const custom = JSON.parse(customStr);
        return { ...base, colors: { ...base.colors, ...custom } };
      } catch {
      }
    }
    return base;
  });
  const [backgroundImage, setBackgroundImage] = useState<string | null>(() => {
    const saved = localStorage.getItem("bg-image");
    return saved && saved !== "null" ? saved : null;
  });
  const [backgroundOpacity, setBackgroundOpacity] = useState<number>(() => {
    const saved = localStorage.getItem("bg-opacity");
    return saved ? parseFloat(saved) : 0.15;
  });

  useEffect(() => {
    applyTheme(currentTheme);
    localStorage.setItem("theme-id", currentTheme.id);
  }, [currentTheme]);

  useEffect(() => {
    if (backgroundImage) {
      localStorage.setItem("bg-image", backgroundImage);
    } else {
      localStorage.removeItem("bg-image");
    }
  }, [backgroundImage]);

  useEffect(() => {
    localStorage.setItem("bg-opacity", String(backgroundOpacity));
  }, [backgroundOpacity]);

  const setTheme = (id: string) => {
    const preset = themePresets.find((t) => t.id === id);
    if (preset) {
      setCurrentTheme(preset);
      localStorage.removeItem("custom-colors");
    }
  };
  const setCustomColors = (colors: Record<string, string>) => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(colors)) {
      const cssVar = cssVarMap[key];
      if (cssVar) root.style.setProperty(cssVar, value);
    }
    setCurrentTheme((prev) => {
      const updated = { ...prev, colors: { ...prev.colors, ...colors } };
      const basePreset = themePresets.find((t) => t.id === prev.id);
      if (basePreset) {
        const overrides: Record<string, string> = {};
        for (const [k, v] of Object.entries(updated.colors)) {
          if ((basePreset.colors as Record<string, string>)[k] !== v) {
            overrides[k] = v;
          }
        }
        overrides["--gradient"] = "linear-gradient(135deg, hsl(var(--gradient-first)) 0%, hsl(var(--gradient-second)) 100%)";
        if (Object.keys(overrides).length > 0) {
          localStorage.setItem("custom-colors", JSON.stringify(overrides));
        } else {
          localStorage.removeItem("custom-colors");
        }
      }
      return updated;
    });
  };

  return (
    <ThemeContext.Provider
      value={{ currentTheme, setTheme, setCustomColors, backgroundImage, setBackgroundImage, backgroundOpacity, setBackgroundOpacity }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
