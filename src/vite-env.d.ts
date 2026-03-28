/// <reference types="vite/client" />

interface Category {
  id: number;
  name: string;
  icon: string;
  is_system: boolean;
}

interface PasswordEntry {
  id: number;
  title: string;
  username: string;
  password: string;
  description: string | null;
  category_id: number | null;
}

interface ElectronAPI {
  // Window
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;

  // Categories
  getCategories: () => Promise<Category[]>;
  addCategory: (data: { name: string; icon?: string = 'folder', is_system?: number = 0 }) => Promise<Category>;
  removeCategory: (id: number) => Promise<void>;

  // Passwords
  getPasswords: (categoryId?: number | null) => Promise<PasswordEntry[]>;
  addPassword: (pwd: PasswordEntry) => Promise<{ id: number }>;
  updatePassword: (pwd: PasswordEntry) => Promise<void>;
  removePassword: (id: number) => Promise<void>;

  // Export/import
  exportData: () => Promise<void>;
  importData: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
