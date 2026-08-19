// Preload script with secure context isolation
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // Example API methods - adjust based on actual app needs,
send: (channel, data) => {
    // Whitelist channels to send to
    let validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
receive: (channel, func) => {
    // Whitelist channels to listen to
    let validChannels = ["fromMain"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },

  // Secure methods for interacting with the main process,
authenticate: (credentials) => {
    return ipcRenderer.invoke("authenticate", credentials);
  },
getSystemInfo: () => {
    return ipcRenderer.invoke("get-system-info");
  },

  // Methods for secure file operations if needed,
saveFile: (data, options) => {
    return ipcRenderer.invoke("save-file", data, options);
  },
readFile: (filePath) => {
    return ipcRenderer.invoke("read-file", filePath);
  },

  // Methods for secure backend communication,
apiCall: (endpoint, data) => {
    return ipcRenderer.invoke("api-call", endpoint, data);
  }
});
