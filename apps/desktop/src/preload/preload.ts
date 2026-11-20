import { contextBridge } from 'electron';

export interface ElectronAPI {
  platform: NodeJS.Platform;
  arch: string;
  isElectron: boolean;
  version: string;
}

const api: ElectronAPI = {
  platform: process.platform,
  arch: process.arch,
  isElectron: true,
  version: process.versions.electron ?? '1.0.0',
};

contextBridge.exposeInMainWorld('electronAPI', api);
