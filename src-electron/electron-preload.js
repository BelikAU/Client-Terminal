import { contextBridge, ipcRenderer, shell } from 'electron';
import { dialog, app } from '@electron/remote';

import path from 'path';
import os from 'os';

// ipcRenderer.on('message', function (event, text) {
//   console.log('update message', text);
// });

const child = require('child_process').execFile;
const exec = require('child_process').exec;

const shutdown = require('electron-shutdown-command');
const sendkeys = require('sendkeys');

const executTunungPath =
  'C:\\TerminalApps\\iliTuningPackage\\iliTuningTool.exe';

contextBridge.exposeInMainWorld('electronApi', {
  openFileDialog: async (title, folder, filters) => {
    const response = await dialog.showOpenDialog({
      title,
      filters,
      properties: ['openFile', 'multiSelections'],
    });
    return response.filePaths;
  },

  reboot: () => {
    shutdown.reboot({
      timerseconds: 10,
    });
    return 'reboot';
  },

  shutdown: () => {
    shutdown.shutdown({
      timerseconds: 10,
    });
    return 'shutdown';
  },

  restartApp: () => {
    ipcRenderer.send('relaunch');
    return 'restart';
  },

  networkInterfaces: () => {
    const response = os.networkInterfaces();
    return response;
  },

  disableTouch: (val) => {
    console.log('touchSens', val);
    if (val === true) {
    } else {
    }
    return val;
  },

  runExplorer: () => {
    console.log('explorer');
    shell.showItemInFolder('C:\\TerminalApps\\PlayList');
    return 'explorer';
  },

  runTuning: () => {
    console.log('iliTuningTool');
    child(executTunungPath, function (err, data) {
      if (err) {
        console.error(err);
      }
      return 'iliTuningTool';
    });
  },

  displayOff: () => {
    console.log('display off');
    exec(
      'powershell.exe (Add-Type \'[DllImport(\\"user32.dll\\")]^public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);\' -Name a -Pas)::SendMessage(0xffff,0x0112,0xF170,2)',
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      }
    );
  },

  displayOn: () => {
    console.log('display on');
    sendkeys('foobar').then(() => console.log('success'));
  },

  showDevTools: () => {
    console.log('app version', app.getVersion());
    ipcRenderer.send('showDevTools');
  },

  closeDevTools: () => {
    ipcRenderer.send('closeDevTools');
  },

  getPath: () => {
    return path.resolve(__dirname, process.env.QUASAR_PUBLIC_FOLDER);
  },

  getDownloadPath: () => {
    return app.getPath('userData');
  },

  // upload files
  sendLinkToDownload: (links) => {
    return new Promise((resolve) => {
      ipcRenderer.send('download-files', links);
      ipcRenderer.on('download-finished', (event, result) => {
        resolve(result);
      });
    });
  },
});
