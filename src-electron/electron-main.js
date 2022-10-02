import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import { initialize, enable } from '@electron/remote/main';
import path from 'path';
import os from 'os';

const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const DownloadManager = require('electron-download-manager');

DownloadManager.register({
  downloadFolder: app.getPath('userData') + '\\upload',
});

// log
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

initialize();

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions')
    );
  }
} catch (_) {}

let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    show: true,
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    backgroundColor: '#000',

    frame: false,
    kiosk: true,
    webPreferences: {
      contextIsolation: true,
      webviewTag: true,
      webSecurity: false,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);
  mainWindow.setMenu(null);

  if (process.env.DEBUGGING) {
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.webContents.on('devtools-opened', () => {
      // mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  enable(mainWindow.webContents);

  // check for Update
  autoUpdater.checkForUpdates();
  setInterval(() => {
    log.info('check for Update ...');
    autoUpdater.checkForUpdates();
  }, 1000 * 60 * 60);
}

app.whenReady().then(() => {
  createWindow();
});

function sendStatusToWindow(event_text) {
  log.info(event_text);
  mainWindow.webContents.send('app-update-event', event_text);
}

// event
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', (ev, info) => {
  sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', (ev, info) => {
  sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', (ev, err) => {
  sendStatusToWindow('Error in auto-updater.' + err);
});
autoUpdater.on('download-progress', (ev, progressObj) => {
  sendStatusToWindow('Download progress...');
});
autoUpdater.on('update-downloaded', (ev, info) => {
  sendStatusToWindow('Update downloaded; will install in 5 seconds');
});
autoUpdater.on('update-downloaded', (ev, info) => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  setTimeout(function () {
    autoUpdater.quitAndInstall();
  }, 5000);
});

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('relaunch', () => {
  app.relaunch();
  app.exit();
});

ipcMain.on('closeDevTools', () => {
  mainWindow.webContents.closeDevTools();
});

// showDevTools
ipcMain.on('showDevTools', () => {
  mainWindow.webContents.openDevTools({ mode: 'detach' });
});

// download posters
ipcMain.on('download-files', function (event, arg) {
  DownloadManager.bulkDownload(
    {
      urls: arg,
    },
    function (error, finished, errors) {
      if (error) {
        log.info('errors: ' + errors);
        return;
      }
      log.info('all finished', finished);
      event.sender.send('download-finished');
    }
  );
});
