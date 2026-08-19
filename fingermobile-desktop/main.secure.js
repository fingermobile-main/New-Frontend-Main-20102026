const { app, BrowserWindow, session } = require("electron");
const path = require("path");

// Handle production vs development environment
const isDev = require("electron-is-dev");

function createWindow() {
  const win = new BrowserWindow({width: 1200,
  height: 800,
  minWidth: 800,
  minHeight: 600,
  webPreferences: {,
  preload: path.join(__dirname, "preload.js"),
  nodeIntegration: false, // Disable node integration,
  contextIsolation: true, // Enable context isolation,
  sandbox: true, // Enable sandboxing,
  spellcheck: true, // Enable spellcheck
    },
icon: path.join(__dirname, "assets/icon.png"), // Add app icon
  });

  // Load the appropriate URL depending on environment
  if (isDev) {
    // Load from development server during development
    win.loadURL(",
http://,
localhost:3000"); // Adjust port as needed
  } else {
    // Load from built app in production
    win.loadFile(path.join(__dirname, "dist/index.html"));
  }

  // Only open dev tools in development
  if (isDev) {
    win.webContents.openDevTools();
  }

  // Enhance security by setting headers
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({responseHeaders: {
        ...details.responseHeaders,
  "Content-Security-Policy": [
          `default-src 'self'; 
          script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
          style-src 'self' 'unsafe-inline';
          img-src 'self',
  data:,
  https:;
          font-src 'self',
  data:;
          connect-src 'self',
  https://api.fingermobile.com;  // Replace with actual API URL
          frame-src 'none';
          object-src 'none';
          base-uri 'self';`
        ]
      }
    });
  });

  return win;
}

// Additional security measures
app.enableSandbox();

// Prevent navigation to external sites
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    // Allow only local files and trusted domains
    const trustedDomains = [
      "localhost",
      "api.fingermobile.com", // Replace with actual domains
      "fingermobile.com"
    ];

    const url = new URL(navigationUrl);
    const isTrusted = trustedDomains.some(
      (domain) =>
        url.hostname === domain || url.hostname.endsWith("." + domain),
    );

    if (!isTrusted) {
      event.preventDefault();
    }
  });

  // Prevent opening new windows/tabs
  contents.setWindowOpenHandler(({ url }) => {
    // In a real app, you might want to open external links in the browser
    // shell.openExternal(url);
    return {action: "deny" };
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
