import { app } from 'electron';
import fs from 'fs';
import path from 'path';

export interface DesktopSettings {
  locale: 'am' | 'en';
  theme: 'light' | 'dark' | 'system';
  launchAtStartup: boolean;
  allowWaForLabial: boolean;
  convertPunctuation: boolean;
  convertDigits: boolean;
  hotkey: string;
}

export const DEFAULT_SETTINGS: DesktopSettings = {
  locale: 'am',
  theme: 'system',
  launchAtStartup: false,
  allowWaForLabial: true,
  convertPunctuation: true,
  convertDigits: false,
  hotkey: 'Ctrl+Space',
};

function getSettingsPath(): string {
  return path.join(app.getPath('userData'), 'elfye-settings.json');
}

export function loadSettings(): DesktopSettings {
  try {
    const filePath = getSettingsPath();
    if (!fs.existsSync(filePath)) {
      return { ...DEFAULT_SETTINGS };
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<DesktopSettings>;
    return {
      locale: parsed.locale === 'en' ? 'en' : 'am',
      theme: parsed.theme === 'light' || parsed.theme === 'dark' ? parsed.theme : 'system',
      launchAtStartup: Boolean(parsed.launchAtStartup),
      allowWaForLabial: parsed.allowWaForLabial !== false,
      convertPunctuation: parsed.convertPunctuation !== false,
      convertDigits: Boolean(parsed.convertDigits),
      hotkey: typeof parsed.hotkey === 'string' && parsed.hotkey ? parsed.hotkey : 'Ctrl+Space',
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(partial: Partial<DesktopSettings>): DesktopSettings {
  const current = loadSettings();
  const next: DesktopSettings = {
    ...current,
    ...partial,
  };

  try {
    const filePath = getSettingsPath();
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(next, null, 2), 'utf8');
  } catch {
    // Ignore write failure in restricted test environments
  }

  if (typeof partial.launchAtStartup === 'boolean' && app.isPackaged) {
    try {
      app.setLoginItemSettings({ openAtLogin: next.launchAtStartup });
    } catch {
      // Ignore if OS denies login item modification
    }
  }

  return next;
}
