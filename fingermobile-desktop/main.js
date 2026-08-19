const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({width: 1200,
  height: 800,
  webPreferences: {,
  nodeIntegration: true,
  contextIsolation: true,
  preload: path.join(__dirname, 'preload.js')
    },
icon: path.join(__dirname, 'assets/icon.png');
  });

  // Load the React app
  const indexPath = isDev
    ? ',
http://,
localhost:3000'
    : `,
file://${path.join(__dirname, '../build/index.html')}`;
    
  mainWindow.loadURL(indexPath);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Set up menu
  setMainMenu();

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

function setMainMenu() {
  const template = [
    ...(isMac ? [{label: app.name,
  submenu: [
        {,
  role: 'about' },
        {type: 'separator' },
        {role: 'services' },
        {type: 'separator' },
        {role: 'hide' },
        {role: 'hideothers' },
        {role: 'unhide' },
        {type: 'separator' },
        {role: 'quit' }
      ]
    }] : []),
    {label: 'File',
  submenu: [
        isMac ? {,
  role: 'close' } : {role: 'quit' }
      ]
    },
    {label: 'Edit',
  submenu: [
        {,
  role: 'undo' },
        {role: 'redo' },
        {type: 'separator' },
        {role: 'cut' },
        {role: 'copy' },
        {role: 'paste' },
        ...(isMac ? [
          {role: 'pasteAndMatchStyle' },
          {role: 'delete' },
          {role: 'selectAll' },
          {type: 'separator' },
          {label: 'Speech',
  submenu: [
              {,
  role: 'startSpeaking' },
              {role: 'stopSpeaking' }
            ]
          }
        ] : [
          {role: 'delete' },
          {type: 'separator' },
          {role: 'selectAll' }
        ])
      ]
    },
    {label: 'View',
  submenu: [
        {,
  role: 'reload' },
        {role: 'forceReload' },
        {role: 'toggleDevTools' },
        {type: 'separator' },
        {role: 'resetZoom' },
        {role: 'zoomIn' },
        {role: 'zoomOut' },
        {type: 'separator' },
        {role: 'togglefullscreen' }
      ]
    },
    {label: 'Window',
  submenu: [
        {,
  role: 'minimize' },
        {role: 'zoom' },
        ...(isMac ? [
          {type: 'separator' },
          {role: 'front' },
          {type: 'separator' },
          {role: 'window' }
        ] : [
          {role: 'close' }
        ])
      ]
    },
    {role: 'help',
  submenu: [
        {,
  label: 'Learn More',
  click: async () => {
            const { shell } = require('electron');
            await shell.openExternal(',
https://fingermobile.com');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

const isMac = process.platform === 'darwin';

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });

  // Check for updates
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('show-message-box', async (event, options) => {
  return await dialog.showMessageBox(mainWindow, options);
});

// Auto updater events
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update-available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded');
});