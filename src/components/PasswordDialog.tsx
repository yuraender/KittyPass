import { useState, useEffect } from "react";
import { X, Sparkles, Eye, EyeOff } from "lucide-react";
import { PasswordEntry } from "./PasswordTable";
import { Category } from "./CategorySidebar";

interface PasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<PasswordEntry, "id"> & { id?: number }) => void;
  categories: Category[];
  initialData?: PasswordEntry | null;
  selectedCategoryId: number | null;
}

export function PasswordDialog({
  isOpen,
  onClose,
  onSave,
  categories,
  initialData,
  selectedCategoryId,
}: PasswordDialogProps) {
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isOpen)
      return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    if (initialData) {
      setTitle(initialData.title);
      setUsername(initialData.username);
      setPassword(initialData.password);
      setDescription(initialData.description);
      setCategoryId(initialData.category_id);
    } else {
      setTitle("");
      setUsername("");
      setPassword("");
      setDescription("");
      setCategoryId(selectedCategoryId);
    }
    setShowPassword(false);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [initialData, selectedCategoryId, isOpen]);

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*_";
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !username || !password) return;

    onSave({
      id: initialData?.id,
      title,
      username,
      password,
      description,
      categoryId,
    });

    onClose();
  };

  if (!isOpen)
    return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/30" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-card border-2 border-border rounded-lg shadow-card overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-3 py-1.5 gradient">
          <span className="text-sm font-bold text-primary-foreground">
            {initialData ? "Редактировать запись" : "Новая запись"}
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-primary-foreground/20 rounded transition-colors"
          >
            <X className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Название *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Instagram"
              className="w-full px-3 py-2 text-sm rounded border border-border bg-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Категория
            </label>
            <select
              value={categoryId || ""}
              onChange={(e) => setCategoryId(e.target.value || null)}
              className="w-full px-3 py-2 text-sm rounded border border-border bg-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">-</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} selected={categoryId !== null && String(categoryId) === String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Username */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Имя пользователя *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2 text-sm rounded border border-border bg-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Пароль *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Твой секретный пароль"
                className="w-full px-3 py-2 pr-20 text-sm rounded border border-border bg-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                required
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-0.5">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 hover:bg-pink-soft rounded transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="p-1.5 hover:bg-pink-soft rounded transition-colors"
                  title="Сгенерировать"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Заметки..."
              rows={2}
              className="w-full px-3 py-2 text-sm rounded border border-border bg-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded border border-border bg-muted hover:bg-pink-soft transition-colors text-foreground"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded gradient text-primary-foreground shadow-button hover:opacity-90 transition-opacity font-medium"
            >
              {initialData ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
