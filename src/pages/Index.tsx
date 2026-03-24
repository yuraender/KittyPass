import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { WindowFrame } from "@/components/WindowFrame";
import { CategorySidebar, Category } from "@/components/CategorySidebar";
import { PasswordTable, PasswordEntry } from "@/components/PasswordTable";
import { PasswordDialog } from "@/components/PasswordDialog";
import { cn } from "@/lib/utils";

const electronAPI = (window as any).electronAPI;

// System categories
const systemCategories: Category[] = [
  { name: "Соцсети", icon: "message_circle_more" },
  { name: "Игры", icon: "gamepad" },
  { name: "Магазины", icon: "shopping" },
];

export default function Index() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [editingPassword, setEditingPassword] = useState<PasswordEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Category handlers
  const loadCategories = async () => {
    let cats = await electronAPI.getCategories();
    if (cats.length === 0) {
      for (const cat of systemCategories) {
        const created = await electronAPI.addCategory({
          name: cat.name,
          icon: cat.icon,
          isSystem: 1,
        });
      }
      cats = await electronAPI.getCategories();
    }
    setCategories(cats);
  };

  const handleAddCategory = async (name: string) => {
    await electronAPI.addCategory({ name, icon: 'folder' });
    loadCategories();
  };

  const handleDeleteCategory = async (id: string) => {
    await electronAPI.removeCategory(id);
    loadCategories();
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
    }
  };

  // Password handlers
  const loadPasswords = async (categoryId: string | null = null) => {
    const passwords = await electronAPI.getPasswords(categoryId);
    setPasswords(passwords);
  };
  useEffect(() => {
    loadCategories();
    loadPasswords(selectedCategoryId);
  }, [selectedCategoryId]);

  const handleAddPassword = () => {
    setEditingPassword(null);
    setIsDialogOpen(true);
  };

  const handleEditPassword = (password: PasswordEntry) => {
    setEditingPassword(password);
    setIsDialogOpen(true);
  };

  const handleDeletePassword = async (id: string) => {
    await electronAPI.removePassword(id);
    loadPasswords(selectedCategoryId);
  };

  const handleSavePassword = async (data: Omit<PasswordEntry, "id"> & { id?: string }) => {
    if (data.id) {
      // Update existing
      await electronAPI.updatePassword(data);
    } else {
      // Add new
      await electronAPI.addPassword(data);
    }
    loadPasswords(selectedCategoryId);
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
            passwords={passwords}
            onAdd={handleAddPassword}
            onEdit={handleEditPassword}
            onDelete={handleDeletePassword}
          />
        </div>
      </div>

      {/* Password editing dialog */}
      <div className={cn(
        "fixed z-50 flex items-center justify-center bg-foreground/30 transition-all duration-200",
        isDialogOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      )} style={{ inset: "33px 0 0 0" }}>
        <PasswordDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSavePassword}
          categories={categories}
          initialData={editingPassword}
          selectedCategoryId={selectedCategoryId}
        />
      </div>
    </WindowFrame>
  );
}
