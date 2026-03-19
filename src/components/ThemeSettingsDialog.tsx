import { useState } from "react";
import { X, Upload, Trash2, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, themePresets } from "@/contexts/ThemeContext";

interface ThemeSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const bgPresets = [
  { id: "kururu", name: "Крул", url: "https://i.pinimg.com/736x/f9/7e/0b/f97e0b212ca91942abdba5e30667df88.jpg" },
  { id: "pjsekai", name: "Секай", url: "https://i.pinimg.com/originals/bb/c6/6a/bbc66afcd54da101ca1e5743aa68deef.jpg" },
  { id: "caracal", name: "Каракал", url: "https://images.unsplash.com/photo-1562522845-dc05ff0fdc1b?w=1200&q=80" },
  { id: "sakura", name: "Сакура", url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1200&q=80" },
  { id: "stars", name: "Звезды", url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80" },
];

export function ThemeSettingsDialog({ isOpen, onClose }: ThemeSettingsDialogProps) {
  const { currentTheme, setTheme, backgroundImage, setBackgroundImage, backgroundOpacity, setBackgroundOpacity } = useTheme();
  const [customUrl, setCustomUrl] = useState("");

  if (!isOpen) return null;

  const handleCustomUrl = () => {
    if (customUrl.trim()) {
      setBackgroundImage(customUrl.trim());
      setCustomUrl("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
      <div className="w-[520px] max-h-[80vh] bg-card border-2 border-border rounded-lg shadow-card overflow-hidden flex flex-col">
        {/* Title bar */}
        <div className="flex items-center justify-between px-3 py-1.5 gradient-button">
          <span className="text-sm font-bold text-primary-foreground">🎨 Настройки темы</span>
          <button onClick={onClose} className="p-1 hover:bg-primary-foreground/20 rounded">
            <X className="w-3.5 h-3.5 text-primary-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
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

          {/* Background image */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Фон</h3>
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
                className="px-3 py-1.5 text-sm gradient-button text-primary-foreground rounded hover:opacity-90 transition-opacity"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Background opacity */}
          {backgroundImage && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Прозрачность фона: {Math.round(backgroundOpacity * 100)}%
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
        </div>

        {/* Bottom */}
        <div className="flex justify-end px-4 py-3 border-t border-border bg-muted">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm gradient-button text-primary-foreground rounded shadow-button hover:opacity-90 transition-opacity"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}
