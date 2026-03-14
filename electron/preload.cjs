const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  getCategories: () => ipcRenderer.invoke('get-categories'),
  addCategory: (data) => ipcRenderer.invoke('add-category', data),
  removeCategory: (id) => ipcRenderer.invoke('remove-category', id),
  getPasswords: (categoryId) => ipcRenderer.invoke('get-passwords', categoryId),
  addPassword: (data) => ipcRenderer.invoke('add-password', data),
  updatePassword: (data) => ipcRenderer.invoke('update-password', data),
  removePassword: (id) => ipcRenderer.invoke('remove-password', id),
  exportData: () => ipcRenderer.invoke('exportData'),
  importData: () => ipcRenderer.invoke('importData'),
});
