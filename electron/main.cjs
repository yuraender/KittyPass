const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const db = require('./database.cjs');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 650,
    frame: false,
    backgroundColor: '#1e1e1e',
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

ipcMain.on('window-minimize', (event) => {
  BrowserWindow.fromWebContents(event.sender).minimize();
});
ipcMain.on('window-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win.isMaximized())
    win.unmaximize();
  else
    win.maximize();
});
ipcMain.on('window-close', (event) => {
  BrowserWindow.fromWebContents(event.sender).close();
});
ipcMain.handle('get-categories', () => db.getCategories());
ipcMain.handle('add-category', (event, { name, icon }) => db.addCategory(name, icon));
ipcMain.handle('remove-category', (event, id) => db.removeCategory(id));
ipcMain.handle('get-passwords', (event, categoryId) => db.getPasswords(categoryId));
ipcMain.handle('add-password', (event, password) => db.addPassword(password));
ipcMain.handle('update-password', (event, password) => db.updatePassword(password));
ipcMain.handle('remove-password', (event, id) => db.removePassword(id));
ipcMain.handle('exportData', async () => {
  const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
    title: 'Экспорт данных',
    defaultPath: 'kittypass-backup.json',
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  });
  if (canceled || !filePath)
    return { success: false, canceled: true };
  try {
    const jsonData = db.exportData();
    fs.writeFileSync(filePath, jsonData, 'utf-8');
    return { success: true, filePath };
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, error: error.message };
  }
});
ipcMain.handle('importData', async () => {
  const { filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Иипорт данных',
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
    properties: ['openFile']
  });
  if (!filePaths || filePaths.length === 0)
    return { success: false, canceled: true };
  try {
    const jsonData = fs.readFileSync(filePaths[0], 'utf-8');
    db.importData(jsonData);
    return {
      success: true,
      filePath: filePaths[0]
    };
  } catch (error) {
    console.error('Import error:', error);
    return { success: false, error: error.message };
  }
});

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
