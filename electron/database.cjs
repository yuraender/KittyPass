const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

// Папка для хранения базы (%APPDATA%/kitty-pass)
const userDataPath = app.getPath('userData');
const dbFolder = path.join(userDataPath, 'data');
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
}
const dbPath = path.join(dbFolder, 'kittypass.db');

// Инициализация базы
const db = new Database(dbPath, { verbose: console.log });
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_system INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS passwords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  username TEXT,
  password TEXT NOT NULL,
  description TEXT,
  category_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(category_id) REFERENCES categories(id)
);
`);

// Категории
const getCategories = () => db.prepare('SELECT * FROM categories ORDER BY id ASC').all();
const addCategory = (name, icon = 'folder', isSystem = 0) => {
  const stmt = db.prepare('INSERT INTO categories (name, icon, is_system) VALUES (?, ?, ?)');
  const info = stmt.run(name, icon, isSystem);
  return { id: info.lastInsertRowid, name, icon, isSystem };
};
const removeCategory = (id) => {
  const updatePasswords = db.prepare(`UPDATE passwords SET category_id = NULL WHERE category_id = ?`);
  updatePasswords.run(id);
  const deleteCategory = db.prepare(`DELETE FROM categories WHERE id = ?`);
  deleteCategory.run(id);
  return true;
};

// Пароли
const getPasswords = (categoryId = null) => {
  if (categoryId)
    return db.prepare('SELECT * FROM passwords WHERE category_id = ? ORDER BY title ASC').all(categoryId);
  return db.prepare('SELECT * FROM passwords ORDER BY title ASC').all();
};
const addPassword = ({ title, username, password, description, categoryId }) => {
  const stmt = db.prepare(`
    INSERT INTO passwords (title, username, password, description, category_id)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(title, username, password, description, categoryId);
  return { id: info.lastInsertRowid };
};
const updatePassword = ({ id, title, username, password, description, categoryId }) => {
  db.prepare(`
    UPDATE passwords
    SET title = ?, username = ?, password = ?, description = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(title, username, password, description, categoryId, id);
};
const removePassword = (id) => db.prepare('DELETE FROM passwords WHERE id = ?').run(id);

module.exports = {
  path: dbPath,
  getCategories,
  addCategory,
  removeCategory,
  getPasswords,
  addPassword,
  updatePassword,
  removePassword,
};
