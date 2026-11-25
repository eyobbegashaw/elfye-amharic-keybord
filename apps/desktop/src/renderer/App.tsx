import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, TabId } from './components/Navbar.js';
import { DashboardView } from './components/DashboardView.js';
import { PracticeView } from './components/PracticeView.js';
import { ChartView } from './components/ChartView.js';
import { ImeGuideView } from './components/ImeGuideView.js';
import { SettingsView } from './components/SettingsView.js';
import { translations } from './translations.js';
import type { DesktopSettings, ImeStatus } from '../preload/preload.js';

const DEFAULT_CLIENT_SETTINGS: DesktopSettings = {
  locale: 'am',
  theme: 'system',
  launchAtStartup: false,
  allowWaForLabial: true,
  convertPunctuation: true,
  convertDigits: false,
  hotkey: 'Ctrl+Space',
};

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');
  const [settings, setSettings] = useState<DesktopSettings>(DEFAULT_CLIENT_SETTINGS);
  const [imeStatus, setImeStatus] = useState<ImeStatus | null>(null);
  const [busyAction, setBusyAction] = useState<'install' | 'uninstall' | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const refreshStatus = useCallback(async () => {
    if (!window.electronAPI?.getImeStatus) return;
    const status = await window.electronAPI.getImeStatus();
    setImeStatus(status);
  }, []);

  useEffect(() => {
    if (window.electronAPI?.getSettings) {
      window.electronAPI.getSettings().then(setSettings).catch(() => {});
    }
    refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [settings.theme]);

  const handleUpdateSettings = async (partial: Partial<DesktopSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
    if (window.electronAPI?.updateSettings) {
      const saved = await window.electronAPI.updateSettings(partial);
      setSettings(saved);
    }
  };

  const handleInstallOrRepair = async () => {
    if (!window.electronAPI?.installIme) return;
    setBusyAction('install');
    setActionFeedback(null);
    try {
      const res = await window.electronAPI.installIme();
      setImeStatus(res.status);
      setActionFeedback({
        type: res.success ? 'success' : 'error',
        text: res.message,
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleUninstall = async () => {
    if (!window.electronAPI?.uninstallIme) return;
    setBusyAction('uninstall');
    setActionFeedback(null);
    try {
      const res = await window.electronAPI.uninstallIme();
      setImeStatus(res.status);
      setActionFeedback({
        type: res.success ? 'success' : 'error',
        text: res.message,
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleOpenOsSettings = async () => {
    await window.electronAPI?.openOsKeyboardSettings();
  };

  const t = translations[settings.locale];

  return (
    <div className="desktop-app">
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} t={t} />

      <main className="content-pane">
        {currentTab === 'dashboard' && (
          <DashboardView
            t={t}
            status={imeStatus}
            busy={busyAction !== null}
            actionFeedback={actionFeedback}
            onRefresh={refreshStatus}
            onQuickInstall={handleInstallOrRepair}
            onOpenOsSettings={handleOpenOsSettings}
            onNavigate={setCurrentTab}
          />
        )}
        {currentTab === 'ime' && (
          <ImeGuideView
            t={t}
            status={imeStatus}
            busy={busyAction !== null}
            busyAction={busyAction}
            actionFeedback={actionFeedback}
            onInstallOrRepair={handleInstallOrRepair}
            onUninstall={handleUninstall}
            onRefresh={refreshStatus}
            onOpenOsSettings={handleOpenOsSettings}
          />
        )}
        {currentTab === 'practice' && (
          <PracticeView
            t={t}
            transliterationOptions={{
              allowWaForLabial: settings.allowWaForLabial,
              convertPunctuation: settings.convertPunctuation,
              convertDigits: settings.convertDigits,
            }}
          />
        )}
        {currentTab === 'chart' && <ChartView t={t} />}
        {currentTab === 'settings' && (
          <SettingsView
            t={t}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>
    </div>
  );
};
