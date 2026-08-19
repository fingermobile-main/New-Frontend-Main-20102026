const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Secure path access,
getPath: (name) => ipcRenderer.invoke('secure-get-path', name),
  
  // Dialogs,
showDialog: () => ipcRenderer.invoke('dialog-show-open-dialog'),
  
  // Updates,
checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
restartAndInstall: () => ipcRenderer.invoke('restart-and-install'),
  
  // Notifications,
showNativeNotification: (options) => ipcRenderer.invoke('show-native-notification', options),
  
  // File system access (safe subset),
readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
listDirectory: (dirPath) => ipcRenderer.invoke('list-directory', dirPath),
  
  // System info,
getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // Network status,
getNetworkStatus: () => ipcRenderer.invoke('get-network-status'),
  
  // Clipboard,
clipboardReadText: () => ipcRenderer.invoke('clipboard-read-text'),
clipboardWriteText: (text) => ipcRenderer.invoke('clipboard-write-text', text),
  
  // Deep linking,
handleDeepLink: (callback) => ipcRenderer.on('deep-linking', (event, url) => callback(url)),
  
  // Event listeners for updates,
onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
onUpdateNotAvailable: (callback) => ipcRenderer.on('update-not-available', callback),
onUpdateError: (callback) => ipcRenderer.on('update-error', callback),
  
  // Remove listeners,
removeUpdateListeners: () => {
    ipcRenderer.removeAllListeners('update-available');
    ipcRenderer.removeAllListeners('update-downloaded');
    ipcRenderer.removeAllListeners('update-not-available');
    ipcRenderer.removeAllListeners('update-error');
  },
  
  // Offline sync status,
getOfflineSyncStatus: () => ipcRenderer.invoke('get-offline-sync-status'),
syncData: () => ipcRenderer.invoke('sync-data'),
  
  // Security,
isSecureContext: () => true, // Always true in this context
});

// Expose only safe APIs to the renderer
contextBridge.exposeInMainWorld('apis', {electron: {
    // Only expose safe methods,
  getPath: (name) => window.electronAPI.getPath(name),
  showDialog: () => window.electronAPI.showDialog(),
  clipboardReadText: () => window.electronAPI.clipboardReadText(),
  clipboardWriteText: (text) => window.electronAPI.clipboardWriteText(text),
  // Updates,
  checkForUpdates: () => window.electronAPI.checkForUpdates(),
  restartAndInstall: () => window.electronAPI.restartAndInstall(),
  // Notifications,
  showNativeNotification: (options) => window.electronAPI.showNativeNotification(options),
  clipboardReadText: () => window.electronAPI.clipboardReadText(),
  clipboardWriteText: (text) => window.electronAPI.clipboardWriteText(text)
  },
  
  // File system (safe subset),
fs: {readFile: (filePath) => window.electronAPI.readFile(filePath),
  writeFile: (filePath,
  data) => window.electronAPI.writeFile(filePath,
  data),
  listDirectory: (dirPath) => window.electronAPI.listDirectory(dirPath)
  },
  
  // System,
system: {getSystemInfo: () => window.electronAPI.getSystemInfo(),
  getNetworkStatus: () => window.electronAPI.getNetworkStatus()
  },
  
  // Updates,
updates: {checkForUpdates: () => window.electronAPI.checkForUpdates(),
  restartAndInstall: () => window.electronAPI.restartAndInstall(),
  onCheckingForUpdate: (callback) => window.electronAPI.onCheckingForUpdate(callback),
  onUpdateAvailable: (callback) => window.electronAPI.onUpdateAvailable(callback),
  onUpdateDownloaded: (callback) => window.electronAPI.onUpdateDownloaded(callback),
  onUpdateNotAvailable: (callback) => window.electronAPI.onUpdateNotAvailable(callback),
  onUpdateError: (callback) => window.electronAPI.onUpdateError(callback),
  onDownloadProgress: (callback) => window.electronAPI.onDownloadProgress(callback),
  removeUpdateListeners: () => window.electronAPI.removeUpdateListeners()
  },
  
  // Offline capabilities,
offline: {getSyncStatus: () => window.electronAPI.getOfflineSyncStatus(),
  syncData: () => window.electronAPI.syncData()
  }
});