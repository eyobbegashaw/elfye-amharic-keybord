import { app, BrowserWindow, ipcMain, session } from 'electron';
import path from 'path';
import fs from 'fs';
import {
  getImeStatus,
  installOrRepairIme,
  uninstallIme,
  openOsKeyboardSettings,
} from './imeManager';
import { loadSettings, saveSettings, DesktopSettings } from './settingsStore';
import { checkForUpdates } from './updater';

let mainWindow: BrowserWindow | null = null;

function resolveAppIcon(): string | undefined {
  const candidates = [
    path.join(__dirname, '../../dist/icon.png'),
    path.join(__dirname, '../../public/icon.png'),
  ];
  return candidates.find((p) => fs.existsSync(p));
}

function registerIpcHandlers(): void {
  ipcMain.handle('ime:getStatus', async () => getImeStatus());
  ipcMain.handle('ime:install', async () => installOrRepairIme());
  ipcMain.handle('ime:repair', async () => installOrRepairIme());
  ipcMain.handle('ime:uninstall', async () => uninstallIme());
  ipcMain.handle('ime:openOsSettings', async () => openOsKeyboardSettings());

  ipcMain.handle('settings:get', () => loadSettings());
  ipcMain.handle('settings:update', (_event, partial: Partial<DesktopSettings>) =>
    saveSettings(partial),
  );

  ipcMain.handle('app:checkUpdate', async () => checkForUpdates());
}

function createWindow(): void {
  // Secure defaults: contextIsolation true, nodeIntegration false, sandbox true
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 840,
    minHeight: 620,
    title: 'እልፍዬ (Elfye) — Amharic Phonetic Keyboard',
    icon: resolveAppIcon(),
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  // Strict CSP to disallow remote script injection while allowing Noto Serif Ethiopic font
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data:;",
        ],
      },
    });
  });

  // Disallow opening new windows or navigating to untrusted origins
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://') && !url.startsWith('http://localhost')) {
      event.preventDefault();
    }
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
