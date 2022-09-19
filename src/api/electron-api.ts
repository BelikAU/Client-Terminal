export interface ElectronFileFilter {
  name: string;
  extensions: string[];
}

export interface ElectronApi {
  openFileDialog: (
    title: string,
    folder: string,
    filters: ElectronFileFilter
  ) => Promise<string[]>;
  reboot: () => Promise<string[]>;
  shutdown: () => Promise<string[]>;
  restartApp: () => string[];
  networkInterfaces: () => string[];
  disableTouch: (val: boolean) => string[];
  runExplorer: () => string[];
  runTuning: () => string[];
  showDevTools: () => string[];
  closeDevTools: () => string[];
  displayOn: () => string[];
  displayOff: () => string[];
  getPath: () => string[];
  sendLinkToDownload: (linls: string[]) => Promise<string[]>;
}

// @ts-ignore
export const electronApi: ElectronApi = (window as { electronApi: ElectronApi })
  .electronApi;
