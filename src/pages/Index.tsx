import { useState } from "react";
import { Shield } from "lucide-react";
import { WindowFrame } from "@/components/WindowFrame";
import { CategorySidebar, Category } from "@/components/CategorySidebar";

// Demo categories
const initialCategories: Category[] = [
  { id: "social", name: "Соцсети", icon: "message_circle_more", isSystem: true },
  { id: "games", name: "Игры", icon: "gamepad", isSystem: true },
  { id: "shopping", name: "Магазины", icon: "shopping", isSystem: true },
];

export default function Index() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

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
      </div>
    </WindowFrame>
  );
}
