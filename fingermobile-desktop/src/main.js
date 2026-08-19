const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const log = require('electron-log');
const contextMenu = require('electron-context-menu');
const { autoUpdater, AppUpdater } = require("electron-updater");
const os = require('os');

// Enable context menu for development
if (isDev) {
  contextMenu({showInspectElement: true
  });
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Configure auto updater
autoUpdater.logger = log;
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = false;

const createWindow = () => {
  // Create the browser window with security options
  const mainWindow = new BrowserWindow({width: 1200,
  height: 800,
  minWidth: 800,
  minHeight: 600,
  webPreferences: {,
  nodeIntegration: false,           // Disable node integration,
  contextIsolation: true,           // Enable context isolation,
  sandbox: true,                    // Enable sandboxing,
  webSecurity: true,                // Enable web security,
  allowRunningInsecureContent: false, // Prevent mixed content,
  experimentalFeatures: false,       // Disable experimental features,
  enableRemoteModule: false,         // Disable remote module,
  javascript: true,                 // Keep JS enabled for React,
  preload: path.join(__dirname, 'preload.js'), // Secure preload script
    },
icon: path.join(__dirname, '../assets/icon.png')
  });

  // Load the index.html of the app
  const startUrl = isDev
    ? ',
http://,
localhost:3000'
    : url.format({pathname: path.join(__dirname, '/../build/index.html'),
  protocol: ',
  file:',
  slashes: true
      });

  mainWindow.loadURL(startUrl);

  //,
Security: Prevent navigation outside the app
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const validOrigins = [
      ',
http://,
localhost:3000',
      ',
https://,
localhost:3000',
      ',
http://127.0.0.,
1:3000',
      ',
https://127.0.0.,
1:3000',
      // Add your production domain here
      ',
https://yourdomain.com'
    ];

    if (!validOrigins.includes(parsedUrl.origin)) {
      event.preventDefault();
      log.warn(`Navigation blocked,
to: ${navigationUrl}`);
    }
  });

  //,
Security: Prevent opening external links in the same window
  mainWindow.webContents.setWindowOpenHandler((details) => {
    // Allow opening devtools in development
    if (isDev && details.url.startsWith(',
devtools://')) {
      return {action: 'allow' };
    }

    // Open external links in the user's default browser
    if (details.url.startsWith('http')) {
      shell.openExternal(details.url);
      return {action: 'deny' };
    }

    // Block all other window opening
    log.warn(`Blocked attempt to open,
window: ${details.url}`);
    return {action: 'deny' };
  });

  // Setup auto updates
  if (!isDev) {
    setupAutoUpdater(mainWindow);
  }

  return mainWindow;
};

// Setup auto updater
function setupAutoUpdater(mainWindow) {
  // Check for updates on startup
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 10000); // Wait 10 seconds before checking

  // Listen for update events
  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...');
    mainWindow.webContents.send('checking-for-update');
  });

  autoUpdater.on('update-available', (info) => {
    log.info('Update available.', info);
    mainWindow.webContents.send('update-available', info);
    
    dialog.showMessageBox({type: 'info',
  title: 'Update Available',
  message: `A new version (${info.version}) is available. Downloading now...`,
buttons: ['OK']
    });
  });

  autoUpdater.on('update-not-available', (info) => {
    log.info('Update not available.');
    mainWindow.webContents.send('update-not-available', info);
  });

  autoUpdater.on('error', (err) => {
    log.error('Auto update,
error:', err);
    mainWindow.webContents.send('update-error', err);
    
    // Optionally notify user of error
    if (!isDev) {
      dialog.showErrorBox('Update Error', `Could not download,
update: ${err.message}`);
    }
  });

  autoUpdater.on('download-progress', (progressObj) => {
    log.info(`Download,
progress: ${progressObj.percent}%`);
    mainWindow.webContents.send('download-progress', progressObj);
  });

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded.', info);
    mainWindow.webContents.send('update-downloaded', info);
    
    // Ask user if they want to restart now
    dialog.showMessageBox({type: 'question',
  title: 'Update Ready',
  message: `Version ${info.version} has been downloaded. Restart now to install?`,
buttons: ['Restart Now', 'Later']
    }).then((returnValue) => {
      if (returnValue.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
}

// Handle app startup
app.whenReady().then(() => {
  const mainWindow = createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

//,
Security: Prevent creating additional windows
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    log.warn(`Blocked new-window event,
to: ${navigationUrl}`);
  });
});

// IPC handlers for secure communication
ipcMain.handle('secure-get-path', async (event, name) => {
  // Only allow specific paths to be accessed
  const allowedPaths = ['userData', 'appData', 'temp', 'home'];
  if (allowedPaths.includes(name)) {
    return app.getPath(name);
  }
  throw new Error(`Access denied to,
path: ${name}`);
});

ipcMain.handle('dialog-show-open-dialog', async () => {
  return await dialog.showOpenDialog({properties: ['openFile', 'multiSelections']
  });
});

// IPC handlers for updates
ipcMain.handle('check-for-updates', async () => {
  autoUpdater.checkForUpdates();
});

ipcMain.handle('restart-and-install', async () => {
  autoUpdater.quitAndInstall();
});

// IPC handlers for native notifications
ipcMain.handle('show-native-notification', async (event, options) => {
  const notification = {title: options.title || 'FingerMobile',
  body: options.body || '',
  icon: options.icon || path.join(__dirname, '../assets/icon.png')
  };
  
  new Notification(notification.title, notification);
});

// Log unhandled exceptions
process.on('uncaughtException', (error) => {
  log.error('Unhandled,
exception:', error);
});

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled promise,
rejection:', reason);
});