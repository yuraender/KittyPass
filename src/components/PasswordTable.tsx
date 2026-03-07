import { useState } from "react";
import { Eye, EyeOff, Copy, Check, Pencil, Trash2, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordEntry {
  id: number | string;
  title: string;
  username: string;
  password: string;
  description?: string;
  categoryId?: string | null;
}

interface PasswordTableProps {
  passwords: PasswordEntry[];
  onAdd: () => void;
  onEdit: (password: PasswordEntry) => void;
  onDelete: (id: string) => void;
}

export function PasswordTable({ passwords, onAdd, onEdit, onDelete }: PasswordTableProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter passwords by search
  const filteredPasswords = passwords.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleVisibility = (id: string) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const copyPassword = async (id: string, password: string) => {
    await navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const maskPassword = (password: string) => "•".repeat(Math.min(password.length, 12));

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 gradient-button text-primary-foreground rounded text-sm font-medium shadow-button hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
          <div className="h-5 w-px bg-border" />
          <span className="text-sm text-muted-foreground">
            Записей: {filteredPasswords.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
            className="w-48 pl-8 pr-7 py-1.5 text-sm rounded border border-border bg-card focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-pink-soft rounded"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted border-b border-border">
            <tr>
              <th className="text-left px-3 py-2 font-semibold text-foreground w-1/5">Название</th>
              <th className="text-left px-3 py-2 font-semibold text-foreground w-1/4">Имя пользователя</th>
              <th className="text-left px-3 py-2 font-semibold text-foreground w-1/5">Пароль</th>
              <th className="text-left px-3 py-2 font-semibold text-foreground">Описание</th>
              <th className="text-center px-3 py-2 font-semibold text-foreground w-24">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredPasswords.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">{searchQuery ? "🔍" : "😿"}</span>
                    <p>{searchQuery ? "Ничего не найдено" : "Нет записей"}</p>
                    {!searchQuery && (
                      <button
                        onClick={onAdd}
                        className="text-primary hover:underline"
                      >
                        Добавить первый пароль
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredPasswords.map((entry, index) => (
                <tr
                  key={entry.id}
                  onClick={() => setSelectedId(entry.id)}
                  onDoubleClick={() => onEdit(entry)}
                  className={cn(
                    "border-b border-border cursor-pointer transition-colors",
                    selectedId === entry.id
                      ? "bg-primary/10"
                      : index % 2 === 0
                      ? "bg-card"
                      : "bg-muted/30",
                    "hover:bg-pink-soft/50"
                  )}
                >
                  <td className="px-3 py-2 font-medium text-foreground">{entry.title}</td>
                  <td className="px-3 py-2 text-foreground font-mono text-xs">{entry.username}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs text-foreground">
                        {visiblePasswords.has(entry.id) ? entry.password : maskPassword(entry.password)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVisibility(entry.id);
                        }}
                        className="p-1 hover:bg-pink-soft rounded transition-colors"
                      >
                        {visiblePasswords.has(entry.id) ? (
                          <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyPassword(entry.id, entry.password);
                        }}
                        className="p-1 hover:bg-pink-soft rounded transition-colors"
                      >
                        {copiedId === entry.id ? (
                          <Check className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground truncate max-w-xs">{entry.description || "—"}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(entry);
                        }}
                        className="p-1.5 hover:bg-pink-soft rounded transition-colors"
                        title="Редактировать"
                      >
                        <Pencil className="w-3.5 h-3.5 text-primary" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(entry.id);
                        }}
                        className="p-1.5 hover:bg-destructive/20 rounded transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
