/// <reference types="vite/client" />

interface Category {
  id: number | string;
  name: string;
  icon: string;
  isSystem?: boolean;
}

interface PasswordEntry {
  id: number | string;
  title: string;
  username: string;
  password: string;
  description?: string;
  categoryId?: string | null;
}

interface ElectronAPI {
  // Window
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;

  // Categories
  getCategories: () => Promise<Category[]>;
  addCategory: (data: { name: string; icon?: string }) => Promise<Category>;
  removeCategory: (id: number | string) => Promise<void>;

  // Passwords
  getPasswords: (categoryId?: number | string | null) => Promise<PasswordEntry[]>;
  addPassword: (pwd: PasswordEntry) => Promise<{ id: number | string }>;
  updatePassword: (pwd: PasswordEntry) => Promise<void>;
  removePassword: (id: number | string) => Promise<void>;

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
