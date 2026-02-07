import { useState } from "react";
import { Shield } from "lucide-react";
import { WindowFrame } from "@/components/WindowFrame";
import { CategorySidebar, Category } from "@/components/CategorySidebar";
import { PasswordTable, PasswordEntry } from "@/components/PasswordTable";
import { PasswordDialog } from "@/components/PasswordDialog";

// Demo categories
const initialCategories: Category[] = [
  { id: "social", name: "Соцсети", icon: "message_circle_more", isSystem: true },
  { id: "games", name: "Игры", icon: "gamepad", isSystem: true },
  { id: "shopping", name: "Магазины", icon: "shopping", isSystem: true },
];

// Demo passwords
const initialPasswords: PasswordEntry[] = [
  {
    id: "1",
    title: "Discord",
    username: "yuraender",
    password: "SomePassword",
    description: "Мой дс аккаунт",
    categoryId: "social",
  },
  {
    id: "2",
    title: "Genshin Impact",
    username: "yuraender@yandex.ru",
    password: "EbuSobak12731723",
    description: "qiqi mainer",
    categoryId: "games",
  },
  {
    id: "3",
    title: "Wildberries",
    username: "something@gmail.com",
    password: "password1",
    description: "Параша, а не магаз",
    categoryId: "shopping",
  },
];

export default function Index() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [passwords, setPasswords] = useState<PasswordEntry[]>(initialPasswords);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [editingPassword, setEditingPassword] = useState<PasswordEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Category handlers
  const handleAddCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      icon: "folder",
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Move passwords from deleted category to uncategorized
    setPasswords((prev) =>
      prev.map((p) => (p.categoryId === id ? { ...p, categoryId: null } : p))
    );
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
    }
  };

  // Filter passwords by selected category
  const filteredPasswords = selectedCategoryId
    ? passwords.filter((p) => p.categoryId === selectedCategoryId)
    : passwords;

  // Password handlers
  const handleAddPassword = () => {
    setEditingPassword(null);
    setIsDialogOpen(true);
  };

  const handleEditPassword = (password: PasswordEntry) => {
    setEditingPassword(password);
    setIsDialogOpen(true);
  };

  const handleDeletePassword = (id: string) => {
    setPasswords((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSavePassword = (data: Omit<PasswordEntry, "id"> & { id?: string }) => {
    if (data.id) {
      // Update existing
      setPasswords((prev) =>
        prev.map((p) => (p.id === data.id ? { ...p, ...data } as PasswordEntry : p))
      );
    } else {
      // Add new
      const newPassword: PasswordEntry = {
        ...data,
        id: Date.now().toString(),
      };
      setPasswords((prev) => [newPassword, ...prev]);
    }
  };

  return (
    <WindowFrame
      title="KittyPass - Менеджер паролей"
      icon={<Shield className="w-4 h-4" />}
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <CategorySidebar
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
          onAdd={handleAddCategory}
          onDelete={handleDeleteCategory}
        />

        {/* Main content */}
        <div className="flex-1 bg-card">
          <PasswordTable
            passwords={filteredPasswords}
            onAdd={handleAddPassword}
            onEdit={handleEditPassword}
            onDelete={handleDeletePassword}
          />
        </div>
      </div>

      {/* Password editing dialog */}
      <PasswordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSavePassword}
        categories={categories}
        initialData={editingPassword}
        selectedCategoryId={selectedCategoryId}
      />
    </WindowFrame>
  );
}
