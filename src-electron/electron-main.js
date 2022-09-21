import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import { initialize, enable } from '@electron/remote/main';
import path from 'path';
import os from 'os';
// const DeltaUpdater = require('@electron-delta/updater');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const DownloadManager = require('electron-download-manager');

DownloadManager.register({
  downloadFolder: app.getPath('userData') + '/upload',
});

// log
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

initialize();

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();
// let vkb;

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
  // vkb = new VirtualKeyboard(window.webContents);
  // display shadule
  // const { screen } = require('electron');

  // Create a window that fills the screen's available work area.
  // let displays = screen.getAllDisplays();
  // let externalDisplay = displays.find((display) => {
  //   return display.bounds.x !== 0 || display.bounds.y !== 0;
  // });

  // Create a window that fills the screen's available work area.
  // const primaryDisplay = screen.getPrimaryDisplay();
  // const { width, height } = primaryDisplay.workAreaSize;
  mainWindow = new BrowserWindow({
    show: true,
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    backgroundColor: '#000',

    // x: externalDisplay.bounds.x + 10,
    // y: externalDisplay.bounds.y + 10,
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

  // mainWindow.setPosition(1920, 0);

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

  try {
    setInterval(() => {
      log.info('check for Update ...');
      autoUpdater.checkForUpdates();
    }, 1000 * 60 * 5);
  } catch (error) {
    logger.error(error);
    log.info('deltaUpdater error', error);
  }
  // chek version
}

app.whenReady().then(() => {
  // const deltaUpdater = new DeltaUpdater({
  //   logger: require('electron-log'),
  //   // optionally set the autoUpdater from electron-updater
  //   autoUpdater: require('electron-updater').autoUpdater,
  //   // Where delta.json is hosted, for github provider it's not required to set the hostURL
  //   hostURL: 'http://localhost:3030/update/',
  // });

  createWindow();
});

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
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
  sendStatusToWindow('Error in auto-updater.');
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

// bot init
var mainProcessVars = {
  somevar: 'name',
  anothervar: 33,
};

ipcMain.on('variable-request', function (event, arg) {
  event.sender.send('variable-reply', [
    mainProcessVars[arg[0]],
    mainProcessVars[arg[1]],
  ]);
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
  // log.info('link mainprocess', arg);
  DownloadManager.bulkDownload(
    {
      urls: arg,
    },
    function (error, finished, errors) {
      if (error) {
        log.info('errors: ' + errors);
        return;
      }

      // const downloadPath = app.getPath('userData');

      log.info('all finished', finished);
      event.sender.send('download-finished');
    }
  );
});
