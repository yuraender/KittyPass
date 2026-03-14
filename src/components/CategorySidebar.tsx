import { useState } from "react";
import { Folder, FolderOpen, Plus, Trash2, MessageCircleMore, Gamepad2, ShoppingBag, Key } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Category {
  id: number | string;
  name: string;
  icon: "message_circle_more" | "gamepad" | "shopping" | "folder";
  is_system?: boolean;
}

interface CategorySidebarProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
}

const iconMap = {
  message_circle_more: MessageCircleMore,
  gamepad: Gamepad2,
  shopping: ShoppingBag,
  key: Key,
  folder: Folder,
};

export function CategorySidebar({ categories, selectedId, onSelect, onAdd, onDelete }: CategorySidebarProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName("");
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") {
      setIsAdding(false);
      setNewName("");
    }
  };

  return (
    <div className="w-56 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted">
        <span className="text-sm font-semibold text-foreground">Категории</span>
        <button
          onClick={() => setIsAdding(true)}
          className="p-1 hover:bg-pink-soft rounded transition-colors"
          title="Добавить категорию"
        >
          <Plus className="w-4 h-4 text-primary" />
        </button>
      </div>

      {/* Categories list */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* All passwords */}
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors",
            selectedId === null
              ? "bg-primary text-primary-foreground"
              : "hover:bg-pink-soft text-foreground"
          )}
        >
          <Key className="w-4 h-4" />
          <span>Все пароли</span>
        </button>

        <div className="h-px bg-border my-2" />

        {/* Category items */}
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Folder;
          const isSelected = selectedId === cat.id;

          return (
            <div key={cat.id} className="group relative">
              <button
                onClick={() => onSelect(cat.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-pink-soft text-foreground"
                )}
              >
                {isSelected ? (
                  <FolderOpen className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                <span className="flex-1 truncate">{cat.name}</span>
              </button>
              {!cat.is_system && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(cat.id);
                  }}
                  className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity",
                    isSelected ? "hover:bg-primary-foreground/20" : "hover:bg-destructive/20"
                  )}
                  title="Удалить"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add new category input */}
        {isAdding && (
          <div className="mt-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (!newName.trim()) setIsAdding(false);
              }}
              placeholder="Название..."
              className="w-full px-2 py-1.5 text-sm rounded border border-primary bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}
