import { app, shell } from 'electron';
import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export interface ImeStatus {
  platform: NodeJS.Platform;
  arch: string;
  installed: boolean;
  activeInUser: boolean;
  binReady: boolean;
  details: {
    registered64?: boolean;
    registered32?: boolean;
    profileEnabled?: boolean;
    dll64Path?: string | null;
    dll32Path?: string | null;
    userInstalled?: boolean;
    systemInstalled?: boolean;
    ibusRunning?: boolean;
    engineRegistered?: boolean;
    bundlePath?: string | null;
    processRunning?: boolean;
  };
  error?: string;
}

export interface ImeActionResult {
  success: boolean;
  message: string;
  status: ImeStatus;
}

/**
 * Resolves the root folder containing native desktop-ime implementations.
 */
export function resolveDesktopImeRoot(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'desktop-ime');
  }
  // Dev mode: apps/desktop/dist-electron/main -> ../../../../apps/desktop-ime
  const candidates = [
    path.resolve(__dirname, '../../../desktop-ime'),
    path.resolve(__dirname, '../../../../apps/desktop-ime'),
    path.resolve(process.cwd(), '../desktop-ime'),
    path.resolve(process.cwd(), 'apps/desktop-ime'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}

function getEmptyStatus(error?: string): ImeStatus {
  return {
    platform: process.platform,
    arch: process.arch,
    installed: false,
    activeInUser: false,
    binReady: false,
    details: {},
    error,
  };
}

export async function getImeStatus(): Promise<ImeStatus> {
  const imeRoot = resolveDesktopImeRoot();

  try {
    if (process.platform === 'win32') {
      const scriptPath = path.join(imeRoot, 'windows', 'scripts', 'check-ime.ps1');
      const dll64 = path.join(imeRoot, 'windows', 'bin', 'x64', 'AmharicTSF64.dll');
      const binReady = fs.existsSync(dll64);

      if (!fs.existsSync(scriptPath)) {
        return { ...getEmptyStatus('Windows check-ime.ps1 script not found.'), binReady };
      }

      const { stdout } = await execFileAsync(
        'powershell.exe',
        ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', scriptPath],
        { timeout: 10000 },
      );

      const parsed = JSON.parse(stdout.trim());
      return {
        platform: 'win32',
        arch: process.arch,
        installed: Boolean(parsed.installed),
        activeInUser: Boolean(parsed.activeInUser),
        binReady,
        details: {
          registered64: Boolean(parsed.registered64),
          registered32: Boolean(parsed.registered32),
          profileEnabled: Boolean(parsed.profileEnabled),
          dll64Path: parsed.dll64Path ?? null,
          dll32Path: parsed.dll32Path ?? null,
        },
      };
    }

    if (process.platform === 'linux') {
      const scriptPath = path.join(imeRoot, 'linux', 'ibus-amharic', 'status.sh');
      const srcPath = path.join(imeRoot, 'linux', 'ibus-amharic', 'src', 'engine.c');
      const binReady = fs.existsSync(srcPath);

      if (!fs.existsSync(scriptPath)) {
        return { ...getEmptyStatus('Linux status.sh script not found.'), binReady };
      }

      const { stdout } = await execFileAsync('bash', [scriptPath], { timeout: 10000 });
      const parsed = JSON.parse(stdout.trim());
      return {
        platform: 'linux',
        arch: process.arch,
        installed: Boolean(parsed.installed),
        activeInUser: Boolean(parsed.activeInUser),
        binReady,
        details: {
          userInstalled: Boolean(parsed.userInstalled),
          systemInstalled: Boolean(parsed.systemInstalled),
          ibusRunning: Boolean(parsed.ibusRunning),
          engineRegistered: Boolean(parsed.engineRegistered),
        },
      };
    }

    if (process.platform === 'darwin') {
      const scriptPath = path.join(imeRoot, 'macos', 'status.sh');
      const bundleSrc = path.join(imeRoot, 'macos', 'build', 'Amharic.app');
      const swiftSrc = path.join(imeRoot, 'macos', 'AmharicInputMethod', 'Package.swift');
      const binReady = fs.existsSync(bundleSrc) || fs.existsSync(swiftSrc);

      if (!fs.existsSync(scriptPath)) {
        return { ...getEmptyStatus('macOS status.sh script not found.'), binReady };
      }

      const { stdout } = await execFileAsync('bash', [scriptPath], { timeout: 10000 });
      const parsed = JSON.parse(stdout.trim());
      return {
        platform: 'darwin',
        arch: process.arch,
        installed: Boolean(parsed.installed),
        activeInUser: Boolean(parsed.activeInUser),
        binReady,
        details: {
          bundlePath: parsed.bundlePath ?? null,
          processRunning: Boolean(parsed.processRunning),
        },
      };
    }

    return getEmptyStatus(`Unsupported platform: ${process.platform}`);
  } catch (err) {
    return getEmptyStatus(err instanceof Error ? err.message : String(err));
  }
}

export async function installOrRepairIme(): Promise<ImeActionResult> {
  const imeRoot = resolveDesktopImeRoot();

  try {
    if (process.platform === 'win32') {
      const binDir = path.join(imeRoot, 'windows', 'bin');
      const dll64 = path.join(binDir, 'x64', 'AmharicTSF64.dll');
      const installScript = path.join(imeRoot, 'windows', 'scripts', 'install-ime.ps1');

      if (!fs.existsSync(dll64)) {
        const status = await getImeStatus();
        return {
          success: false,
          message: `Compiled TSF DLL not found at ${dll64}. Please build the Windows TSF binary first.`,
          status,
        };
      }

      // Invoke install-ime.ps1 with real Windows UAC elevation prompt
      const elevatedCmd =
        `$p = Start-Process powershell.exe -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','${installScript.replace(/'/g, "''")}','-BinDir','${binDir.replace(/'/g, "''")}' -Verb RunAs -Wait -PassThru; exit $p.ExitCode`;

      await execFileAsync(
        'powershell.exe',
        ['-NoProfile', '-NonInteractive', '-Command', elevatedCmd],
        { timeout: 60000 },
      );

      const status = await getImeStatus();
      return {
        success: status.installed,
        message: status.installed
          ? 'Elfye Windows TSF Keyboard installed and registered successfully.'
          : 'Installation finished, but TSF registration could not be verified. Check Administrator permissions.',
        status,
      };
    }

    if (process.platform === 'linux') {
      const dir = path.join(imeRoot, 'linux', 'ibus-amharic');
      const script = path.join(dir, 'install.sh');
      await execFileAsync('bash', [script], { cwd: dir, timeout: 60000 });
      const status = await getImeStatus();
      return {
        success: status.installed,
        message: status.installed
          ? 'Elfye Linux IBus engine installed successfully.'
          : 'Linux install script completed, but engine was not detected.',
        status,
      };
    }

    if (process.platform === 'darwin') {
      const dir = path.join(imeRoot, 'macos');
      const script = path.join(dir, 'build.sh');
      await execFileAsync('bash', [script, '--install'], { cwd: dir, timeout: 120000 });
      const status = await getImeStatus();
      return {
        success: status.installed,
        message: status.installed
          ? 'Elfye macOS Input Method installed to ~/Library/Input Methods.'
          : 'macOS build/install completed, but bundle was not detected.',
        status,
      };
    }

    const status = await getImeStatus();
    return { success: false, message: `Unsupported OS: ${process.platform}`, status };
  } catch (err) {
    const status = await getImeStatus();
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: msg.includes('canceled') || msg.includes('The operation was canceled by the user')
        ? 'Administrator permission prompt (UAC) was cancelled by the user.'
        : `Installation failed: ${msg}`,
      status,
    };
  }
}

export async function uninstallIme(): Promise<ImeActionResult> {
  const imeRoot = resolveDesktopImeRoot();

  try {
    if (process.platform === 'win32') {
      const uninstallScript = path.join(imeRoot, 'windows', 'scripts', 'uninstall-ime.ps1');
      const elevatedCmd =
        `$p = Start-Process powershell.exe -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','${uninstallScript.replace(/'/g, "''")}' -Verb RunAs -Wait -PassThru; exit $p.ExitCode`;

      await execFileAsync(
        'powershell.exe',
        ['-NoProfile', '-NonInteractive', '-Command', elevatedCmd],
        { timeout: 60000 },
      );

      const status = await getImeStatus();
      return {
        success: !status.installed,
        message: !status.installed
          ? 'Elfye Windows TSF Keyboard unregistered and removed.'
          : 'Uninstallation completed, but registry entries remain.',
        status,
      };
    }

    if (process.platform === 'linux') {
      const dir = path.join(imeRoot, 'linux', 'ibus-amharic');
      const script = path.join(dir, 'uninstall.sh');
      await execFileAsync('bash', [script], { cwd: dir, timeout: 30000 });
      const status = await getImeStatus();
      return {
        success: !status.installed,
        message: 'Elfye Linux IBus engine removed.',
        status,
      };
    }

    if (process.platform === 'darwin') {
      const dir = path.join(imeRoot, 'macos');
      const script = path.join(dir, 'uninstall.sh');
      await execFileAsync('bash', [script], { cwd: dir, timeout: 30000 });
      const status = await getImeStatus();
      return {
        success: !status.installed,
        message: 'Elfye macOS Input Method removed.',
        status,
      };
    }

    const status = await getImeStatus();
    return { success: false, message: `Unsupported OS: ${process.platform}`, status };
  } catch (err) {
    const status = await getImeStatus();
    return {
      success: false,
      message: `Uninstallation failed: ${err instanceof Error ? err.message : String(err)}`,
      status,
    };
  }
}

export async function openOsKeyboardSettings(): Promise<boolean> {
  try {
    if (process.platform === 'win32') {
      await shell.openExternal('ms-settings:regionlanguage');
      return true;
    }
    if (process.platform === 'darwin') {
      await shell.openExternal('x-apple.systempreferences:com.apple.Keyboard-Settings.extension');
      return true;
    }
    if (process.platform === 'linux') {
      await execFileAsync('gnome-control-center', ['keyboard'], { timeout: 5000 });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
