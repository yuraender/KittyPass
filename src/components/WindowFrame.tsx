import { Minus, Square, X } from "lucide-react";
import { ReactNode } from "react";

interface WindowFrameProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function WindowFrame({ title, icon, children }: WindowFrameProps) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden border-2 border-pink-medium/50 rounded-lg shadow-card m-2">
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-1.5 gradient-button select-none">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary-foreground">{icon}</span>}
          <span className="text-sm font-bold text-primary-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-primary-foreground/20 rounded transition-colors">
            <Minus className="w-3.5 h-3.5 text-primary-foreground" />
          </button>
          <button className="p-1 hover:bg-primary-foreground/20 rounded transition-colors">
            <Square className="w-3 h-3 text-primary-foreground" />
          </button>
          <button className="p-1 hover:bg-destructive rounded transition-colors">
            <X className="w-3.5 h-3.5 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Menu bar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-muted border-b border-border text-sm">
        <button className="px-2 py-0.5 hover:bg-pink-soft rounded text-foreground">Файл</button>
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
        <span>KittyPass v1.0.0</span>
        <span>Всего паролей: </span>
      </div>
    </div>
  );
}
