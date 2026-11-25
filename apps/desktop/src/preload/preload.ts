import { contextBridge, ipcRenderer } from 'electron';
import type { ImeStatus, ImeActionResult } from '../main/imeManager';
import type { DesktopSettings } from '../main/settingsStore';
import type { UpdateCheckResult } from '../main/updater';

export type { ImeStatus, ImeActionResult, DesktopSettings, UpdateCheckResult };

export interface ElectronAPI {
  platform: NodeJS.Platform;
  arch: string;
  isElectron: boolean;
  version: string;
  getImeStatus: () => Promise<ImeStatus>;
  installIme: () => Promise<ImeActionResult>;
  repairIme: () => Promise<ImeActionResult>;
  uninstallIme: () => Promise<ImeActionResult>;
  openOsKeyboardSettings: () => Promise<boolean>;
  getSettings: () => Promise<DesktopSettings>;
  updateSettings: (partial: Partial<DesktopSettings>) => Promise<DesktopSettings>;
  checkForUpdates: () => Promise<UpdateCheckResult>;
}

const api: ElectronAPI = {
  platform: process.platform,
  arch: process.arch,
  isElectron: true,
  version: process.versions.electron ?? '1.0.0',
  getImeStatus: () => ipcRenderer.invoke('ime:getStatus'),
  installIme: () => ipcRenderer.invoke('ime:install'),
  repairIme: () => ipcRenderer.invoke('ime:repair'),
  uninstallIme: () => ipcRenderer.invoke('ime:uninstall'),
  openOsKeyboardSettings: () => ipcRenderer.invoke('ime:openOsSettings'),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (partial) => ipcRenderer.invoke('settings:update', partial),
  checkForUpdates: () => ipcRenderer.invoke('app:checkUpdate'),
};

contextBridge.exposeInMainWorld('electronAPI', api);
