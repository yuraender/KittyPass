const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getCategories: () => ipcRenderer.invoke('get-categories'),
  addCategory: (data) => ipcRenderer.invoke('add-category', data),
  removeCategory: (id) => ipcRenderer.invoke('remove-category', id),
  getPasswords: (categoryId) => ipcRenderer.invoke('get-passwords', categoryId),
  addPassword: (pwd) => ipcRenderer.invoke('add-password', pwd),
  updatePassword: (pwd) => ipcRenderer.invoke('update-password', pwd),
  removePassword: (id) => ipcRenderer.invoke('remove-password', id),
});
