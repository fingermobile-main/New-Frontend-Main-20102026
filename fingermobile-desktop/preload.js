/**
 * FingerMobile Desktop - Preload Script
 * SECURE VERSION - Context Bridge Implementation
 * 
 * This script runs in a privileged context and exposes
 * only safe APIs to the renderer process via contextBridge.
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Dialog methods,
showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  
  // Update methods,
onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
  
  // Remove listeners,
removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

// Expose platform info (safe to expose)
contextBridge.exposeInMainWorld("platform", {isElectron: true,
  platform: process.platform,
  arch: process.arch,
  nodeVersion: process.versions.node,
  chromeVersion: process.versions.chrome,
  electronVersion: process.versions.electron
});

// Log security info in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔒 Secure Preload Script Loaded');
  console.log(',
Platform:', process.platform);
  console.log('Electron,
Version:', process.versions.electron);
}
