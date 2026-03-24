import { Minus, Square, X, ChevronRight } from "lucide-react";
import { ReactNode, useState, useRef, useEffect } from "react";
import { useTheme, themePresets } from "@/contexts/ThemeContext";
import { ThemeSettingsDialog } from "@/components/ThemeSettingsDialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WindowFrameProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function WindowFrame({ title, icon, children }: WindowFrameProps) {
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const [themeTab, setThemeTab] = useState<"colors" | "background">("colors");
  const [themeOpen, setThemeOpen] = useState(false);
  const [themesSubOpen, setThemesSubOpen] = useState(false);
  const { currentTheme, setTheme, backgroundImage, backgroundOpacity } = useTheme();
  const fileMenuRef = useRef<HTMLDivElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(e.target as Node)) {
        setFileMenuOpen(false);
      }
      if (viewMenuRef.current && !viewMenuRef.current.contains(e.target as Node)) {
        setViewMenuOpen(false);
        setThemesSubOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleExport = async () => {
    const result = await window.electronAPI.exportData();
    if (result.canceled)
      return;
    if (result.success) {
      toast.success("Пароли успешно экспортированы", {
        description: `Файл сохранен: ${result.filePath.split(/[/\\]/).pop()}`,
      });
    } else {
      toast.error("Ошибка экспорта", { description: result.error });
    }
  };
  const handleImport = async () => {
    const result = await window.electronAPI.importData();
    if (result.canceled) {
      return;
    }
    if (result.success) {
      toast.success("Импорт завершен");
    } else {
      toast.error("Ошибка импорта", {
        description: result.error || "Неизвестная ошибка"
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden border-2 border-border rounded-lg shadow-card">
      {/* Background image */}
      {backgroundImage && (
        <div
        className="absolute inset-0 bg-cover bg-no-repeat pointer-events-none z-10"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: "center 65px",
          opacity: backgroundOpacity,
        }}
        />
      )}

      {/* Title bar */}
      <div className="relative titlebar flex items-center justify-between px-3 py-1.5 gradient">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary-foreground">{icon}</span>}
          <span className="text-sm font-bold text-primary-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => window.electronAPI.minimizeWindow()}
            className="p-1 hover:bg-primary-foreground/20 rounded transition-colors">
            <Minus className="w-3.5 h-3.5 text-primary-foreground" />
          </button>
          <button
            onClick={() => window.electronAPI.maximizeWindow()}
            className="p-1 hover:bg-primary-foreground/20 rounded transition-colors">
            <Square className="w-3 h-3 text-primary-foreground" />
          </button>
          <button
            onClick={() => window.electronAPI.closeWindow()}
            className="p-1 hover:bg-destructive rounded transition-colors">
            <X className="w-3.5 h-3.5 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Menu bar */}
      <div className="relative z-20 flex items-center gap-1 px-2 py-1 bg-muted border-b border-border text-sm">
        <div className="relative" ref={fileMenuRef}>
          <button
            onClick={() => setFileMenuOpen((v) => !v) }
            className={`px-2 py-0.5 rounded text-foreground ${fileMenuOpen ? "bg-pink-soft" : "hover:bg-pink-soft"}`}
          >
            Файл
          </button>
          {/* Dropdown меню */}
          {fileMenuOpen && (
            <div
              className="absolute left-0 top-full mt-0.5 w-52 bg-popover border border-border rounded shadow-card py-1 text-sm hover:bg-accent transition-colors"
              style={{ backgroundColor: "hsl(var(--card))" }}>
              <button
                onClick={() => {
                    setFileMenuOpen(false);
                    handleExport();
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span>Экспорт данных</span>
              </button>
              <button
                onClick={() => {
                    setFileMenuOpen(false);
                    handleImport();
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span>Импорт данных</span>
              </button>
            </div>
          )}
        </div>
        <button className="px-2 py-0.5 hover:bg-pink-soft rounded text-foreground">Правка</button>
        <div className="relative" ref={viewMenuRef}>
          <button
            onClick={() => { setViewMenuOpen((v) => !v); setThemesSubOpen(false); }}
            className={`px-2 py-0.5 rounded text-foreground ${viewMenuOpen ? "bg-pink-soft" : "hover:bg-pink-soft"}`}
          >
            Вид
          </button>
          {/* Dropdown меню */}
          {viewMenuOpen && (
            <div
              className="absolute left-0 top-full mt-0.5 w-52 bg-popover border border-border rounded shadow-card py-1 text-sm hover:bg-accent transition-colors"
              style={{ backgroundColor: "hsl(var(--card))" }}>
              {/* Themes submenu */}
              <div
                className="relative"
                onMouseEnter={() => setThemesSubOpen(true)}
                onMouseLeave={() => setThemesSubOpen(false)}
              >
                <button className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors">
                <span>🎨 Темы</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                {themesSubOpen && (
                <div
                  className="absolute left-full top-0 w-48 bg-popover border border-border rounded shadow-card py-1"
                  style={{ backgroundColor: "hsl(var(--card))" }}>
                  {themePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setTheme(preset.id);
                        setViewMenuOpen(false);
                        setThemesSubOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-border flex-shrink-0"
                        style={{ background: `hsl(${preset.colors.primary})` }}
                      />
                      <span>{preset.emoji} {preset.name}</span>
                      {currentTheme.id === preset.id && (
                        <span className="ml-auto text-primary">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                )}
              </div>
              <div className="h-px bg-border my-1" />
              <button
                onClick={() => {
                    setViewMenuOpen(false);
                    setThemeTab("colors");
                    setTimeout(() => {
                      setThemeOpen(true);
                    }, 10);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span>🖌️ Цвета</span>
              </button>
              <button
                onClick={() => {
                    setViewMenuOpen(false);
                    setThemeTab("background");
                    setTimeout(() => {
                      setThemeOpen(true);
                    }, 10);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span>🖼️ Фон</span>
              </button>
            </div>
          )}
        </div>
        <button className="px-2 py-0.5 hover:bg-pink-soft rounded text-foreground">Помощь</button>
      </div>

      {/* Content */}
      <div className="relative flex-1 overflow-hidden">
        {children}
      </div>

      {/* Status bar */}
      <div className="relative flex items-center justify-between px-3 py-1 bg-muted border-t border-border text-xs text-muted-foreground">
        <span></span>
        <span>KittyPass v1.0.0</span>
      </div>

      <div className={cn(
        "fixed z-50 flex items-center justify-center bg-foreground/30 transition-all duration-200",
        themeOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      )} style={{ inset: "33px 0 0 0" }}>
        <ThemeSettingsDialog isOpen={themeOpen} onClose={() => setThemeOpen(false)} initialTab={themeTab} />
      </div>
    </div>
  );
}
