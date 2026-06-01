// =============================================================================
//  MAIN.JS — Electron main process
//  This file controls the desktop window. You don't need to edit anything here.
// =============================================================================

const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 480,
    minWidth: 400,
    minHeight: 340,
    title: 'Pebbles',
    icon: path.join(__dirname, 'assets', 'logo.ico'),
    backgroundColor: '#F3EFFF',
    show: false, // show only after ready-to-show for a smooth launch
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Hide the default menu bar (keeps the app clean)
  win.setMenuBarVisibility(false);

  win.loadFile('index.html');

  // Show once content is ready — prevents the white flash on startup
  win.once('ready-to-show', () => {
    win.show();
  });

  // Open any links that point to external URLs in the system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  // macOS: re-create window when dock icon is clicked and no windows are open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
