import { useState, useEffect } from "react";
import { X, Upload, Trash2, Image, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, themePresets } from "@/contexts/ThemeContext";

interface ThemeSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "colors" | "background";
}

const bgPresets = [
  { id: "kururu", name: "Крул", url: "https://i.pinimg.com/736x/f9/7e/0b/f97e0b212ca91942abdba5e30667df88.jpg" },
  { id: "pjsekai", name: "Секай", url: "https://i.pinimg.com/originals/bb/c6/6a/bbc66afcd54da101ca1e5743aa68deef.jpg" },
  { id: "caracal", name: "Каракал", url: "https://images.unsplash.com/photo-1562522845-dc05ff0fdc1b?w=1200&q=80" },
  { id: "sakura", name: "Сакура", url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1200&q=80" },
  { id: "stars", name: "Звезды", url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80" },
];

interface ColorField {
  key: string;
  label: string;
  cssVar: string;
}

const editableColors: ColorField[] = [
  { key: "primary", label: "Основной", cssVar: "--primary" },
  { key: "foreground", label: "Текст", cssVar: "--foreground" },
  { key: "gradientFirst", label: "Градиент 1", cssVar: "--gradient-first" },
  { key: "gradientSecond", label: "Градиент 2", cssVar: "--gradient-second" },
  { key: "accent", label: "Акцент", cssVar: "--accent" },
  { key: "muted", label: "Затемнение", cssVar: "--muted" },
  { key: "card", label: "Фон диалогов", cssVar: "--card" },
  { key: "border", label: "Границы", cssVar: "--border" },
];

function hslStringToHex(hslStr: string): string {
  const parts = hslStr.trim().split(/\s+/);
  if (parts.length < 3)
    return "#ff69b4";
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHslString(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result)
    return "340 80% 65%";
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function ThemeSettingsDialog({ isOpen, onClose, initialTab }: ThemeSettingsDialogProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const { currentTheme, setTheme, setCustomColors, backgroundImage, setBackgroundImage, backgroundOpacity, setBackgroundOpacity } = useTheme();
  const [customUrl, setCustomUrl] = useState("");
  const [localColors, setLocalColors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"colors" | "background">(initialTab);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
      const timeout = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timeout);
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    setActiveTab(initialTab);
    const colors: Record<string, string> = {};
    for (const field of editableColors) {
      const val = (currentTheme.colors as Record<string, string>)[field.key];
      colors[field.key] = val || "";
    }
    setLocalColors(colors);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentTheme, initialTab]);

  if (!shouldRender)
    return null;

  const handleCustomUrl = () => {
    if (customUrl.trim()) {
      setBackgroundImage(customUrl.trim());
      setCustomUrl("");
    }
  };

  const handleColorChange = (key: string, hex: string) => {
    const hsl = hexToHslString(hex);
    setLocalColors((prev) => ({ ...prev, [key]: hsl }));
    setCustomColors({ [key]: hsl });
  };

  const handleReset = () => {
    const preset = themePresets.find((t) => t.id === currentTheme.id);
    if (preset) {
      setTheme(preset.id);
      const colors: Record<string, string> = {};
      for (const field of editableColors) {
        colors[field.key] = (preset.colors as Record<string, string>)[field.key];
      }
      setLocalColors(colors);
    }
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center transition-all duration-200",
      visible ? "opacity-100" : "opacity-0"
    )}>
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-[520px] max-h-[80vh] bg-card border-2 border-border rounded-lg shadow-card overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-3 py-1.5 gradient">
          <span className="text-sm font-bold text-primary-foreground">⚙️ Настройки темы</span>
          <button onClick={onClose} className="p-1 hover:bg-primary-foreground/20 rounded">
            <X className="w-3.5 h-3.5 text-primary-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-muted">
          <button
            onClick={() => setActiveTab("colors")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              activeTab === "colors" ? "bg-card text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            🖌️ Цвета
          </button>
          <button
            onClick={() => setActiveTab("background")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              activeTab === "background" ? "bg-card text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            🖼️ Фон
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === "colors" && (
            <>
              {/* Color themes */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Цветовая тема</h3>
                <div className="grid grid-cols-5 gap-2">
                  {themePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setTheme(preset.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-2.5 rounded-lg border-2 transition-all",
                        currentTheme.id === preset.id
                          ? "border-primary bg-primary/10 shadow-soft"
                          : "border-border hover:border-primary/50 bg-card"
                      )}
                    >
                      <div
                        className="w-8 h-8 rounded-full border border-border"
                        style={{ background: `hsl(${preset.colors.primary})` }}
                      />
                      <span className="text-[10px] text-muted-foreground leading-tight text-center">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color pickers */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Настройка цветов</h3>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Сбросить
                  </button>
                </div>
                <div
                  className="grid grid-cols-2 gap-3"
                  style={{ margin: "0 80px", columnGap: "55px" }}>
                  {editableColors.map((field) => (
                    <div key={field.key} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={hslStringToHex(localColors[field.key] || "")}
                        onChange={(e) => handleColorChange(field.key, e.target.value)}
                        className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
                      />
                      <div>
                        <p className="text-xs font-medium text-foreground">{field.label}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{localColors[field.key]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "background" && (
            <>
              {/* Background image */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Картинка</h3>
                  {backgroundImage && (
                    <button
                      onClick={() => setBackgroundImage(null)}
                      className="flex items-center gap-1 text-xs text-destructive hover:underline"
                    >
                  <Trash2 className="w-3 h-3" />
                      Убрать
                    </button>
                  )}
                </div>

                {/* Preset backgrounds */}
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {bgPresets.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setBackgroundImage(bg.url)}
                      className={cn(
                        "relative h-14 rounded-md overflow-hidden border-2 transition-all",
                        backgroundImage === bg.url
                          ? "border-primary shadow-soft"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-foreground/60 text-primary-foreground text-[9px] text-center py-0.5">
                        {bg.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom URL */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Image className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCustomUrl()}
                      placeholder="Вставьте URL картинки..."
                      className="w-full pl-8 pr-3 py-1.5 text-sm rounded border border-border bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={handleCustomUrl}
                    className="px-3 py-1.5 text-sm gradient text-primary-foreground rounded hover:opacity-90 transition-opacity"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Background opacity */}
              {backgroundImage && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Прозрачность: {Math.round(backgroundOpacity * 100)}%
                  </h3>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={backgroundOpacity}
                    onChange={(e) => setBackgroundOpacity(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom */}
        <div className="flex justify-end px-4 py-3 border-t border-border bg-muted">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm gradient text-primary-foreground rounded shadow-button hover:opacity-90 transition-opacity"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}
