import React, { useState } from 'react';
import { Locale, DesktopTranslations } from '../translations.js';
import type { DesktopSettings, UpdateCheckResult } from '../../preload/preload.js';

interface SettingsViewProps {
  t: DesktopTranslations;
  settings: DesktopSettings;
  onUpdateSettings: (partial: Partial<DesktopSettings>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  t,
  settings,
  onUpdateSettings,
}) => {
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateResult, setUpdateResult] = useState<UpdateCheckResult | null>(null);

  const handleCheckUpdates = async () => {
    if (!window.electronAPI?.checkForUpdates) return;
    setCheckingUpdate(true);
    try {
      const res = await window.electronAPI.checkForUpdates();
      setUpdateResult(res);
    } finally {
      setCheckingUpdate(false);
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">🔧 {t.settingsTitle}</h2>

      {/* Theme selection */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
          🎨 {t.themeLabel}
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['light', 'dark', 'system'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`btn ${settings.theme === mode ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => onUpdateSettings({ theme: mode })}
            >
              {mode === 'light' ? `☀️ ${t.themeLight}` : mode === 'dark' ? `🌙 ${t.themeDark}` : `💻 ${t.themeSystem}`}
            </button>
          ))}
        </div>
      </div>

      {/* Language selection */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
          🌐 {t.langLabel}
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['am', 'en'] as Locale[]).map((loc) => (
            <button
              key={loc}
              type="button"
              className={`btn ${settings.locale === loc ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => onUpdateSettings({ locale: loc })}
            >
              {loc === 'am' ? 'አማርኛ' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Input Preferences */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.65rem' }}>
          ✍️ {t.inputPrefsLabel}
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.92rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.allowWaForLabial}
              onChange={(e) => onUpdateSettings({ allowWaForLabial: e.target.checked })}
            />
            <span>{t.allowWaLabel}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.convertPunctuation}
              onChange={(e) => onUpdateSettings({ convertPunctuation: e.target.checked })}
            />
            <span>{t.convertPunctLabel}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.convertDigits}
              onChange={(e) => onUpdateSettings({ convertDigits: e.target.checked })}
            />
            <span>{t.convertDigitsLabel}</span>
          </label>
        </div>
      </div>

      {/* Startup */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={settings.launchAtStartup}
            onChange={(e) => onUpdateSettings({ launchAtStartup: e.target.checked })}
          />
          <span>🚀 {t.startupLabel}</span>
        </label>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          {t.startupDesc}
        </p>
      </div>

      {/* Hotkey display */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
          ⌨️ {t.hotkeyLabel}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
          <kbd style={{ padding: '0.3rem 0.6rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '4px', fontWeight: 700 }}>
            Ctrl
          </kbd>
          <span>+</span>
          <kbd style={{ padding: '0.3rem 0.6rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '4px', fontWeight: 700 }}>
            Space
          </kbd>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {t.hotkeyDesc}
        </p>
      </div>

      {/* Update Manager */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
          🔄 {t.updatesLabel}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="badge badge-english">
            {t.currentVersionLabel}: v{updateResult?.currentVersion ?? '1.0.0'}
          </span>
          {window.electronAPI?.checkForUpdates && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleCheckUpdates}
              disabled={checkingUpdate}
            >
              {checkingUpdate ? `⏳ ${t.checkingUpdates}` : `🔍 ${t.checkUpdatesBtn}`}
            </button>
          )}
        </div>
        {updateResult && (
          <div style={{ marginTop: '0.6rem', fontSize: '0.85rem', color: updateResult.error ? 'var(--accent-red)' : 'var(--text-muted)' }}>
            {updateResult.error
              ? `⚠️ ${updateResult.error}`
              : updateResult.updateAvailable
              ? `🎉 ${t.updateAvailableText} (v${updateResult.latestVersion})`
              : `✅ ${t.upToDateText}`}
          </div>
        )}
      </div>

      {/* About */}
      <div>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
          ℹ️ {t.aboutLabel}
        </label>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {t.aboutDesc}
        </p>
      </div>
    </div>
  );
};
