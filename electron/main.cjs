const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./database.cjs');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

ipcMain.handle('get-categories', () => db.getCategories());
ipcMain.handle('add-category', (event, { name, icon }) => db.addCategory(name, icon));
ipcMain.handle('remove-category', (event, id) => db.removeCategory(id));
ipcMain.handle('get-passwords', (event, categoryId) => db.getPasswords(categoryId));
ipcMain.handle('add-password', (event, password) => db.addPassword(password));
ipcMain.handle('update-password', (event, password) => db.updatePassword(password));
ipcMain.handle('remove-password', (event, id) => db.removePassword(id));

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
