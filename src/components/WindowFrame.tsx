import { Minus, Square, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

interface WindowFrameProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function WindowFrame({ title, icon, children }: WindowFrameProps) {
  const [isImporting, setIsImporting] = useState(false);
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
    if (isImporting)
      return;
    setIsImporting(true);
    const result = await window.electronAPI.importData();
    if (result.canceled) {
      setIsImporting(false);
      return;
    }
    if (result.success) {
      toast.success("Импорт завершен");
    } else {
      toast.error("Ошибка импорта", {
        description: result.error || "Неизвестная ошибка"
      });
    }
    setIsImporting(false);
  };
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden border-2 border-pink-medium/50 rounded-lg shadow-card">
      {/* Title bar */}
      <div className="titlebar flex items-center justify-between px-3 py-1.5 gradient-button select-none">
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
      <div className="flex items-center gap-1 px-2 py-1 bg-muted border-b border-border text-sm">
        <div className="relative group">
          <button className="px-3 py-0.5 hover:bg-pink-soft rounded text-foreground font-medium">
            Файл
          </button>
          {/* Dropdown меню */}
          <div className="absolute hidden group-hover:block pt-1 z-50">
            <div className="bg-popover border border-border rounded-md shadow-lg py-1 w-48 text-sm">
              <button
                onClick={handleExport}
                className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Экспорт данных
              </button>
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
              >
                Импорт данных
              </button>
            </div>
          </div>
        </div>
        <button className="px-2 py-0.5 hover:bg-pink-soft rounded text-foreground">Правка</button>
        <button className="px-2 py-0.5 hover:bg-pink-soft rounded text-foreground">Вид</button>
        <button className="px-2 py-0.5 hover:bg-pink-soft rounded text-foreground">Помощь</button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-muted border-t border-border text-xs text-muted-foreground">
        <span></span>
        <span>KittyPass v1.0.0</span>
      </div>
    </div>
  );
}
