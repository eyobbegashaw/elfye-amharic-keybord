import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Palette,
  Sun,
  Moon,
  Monitor,
  Globe,
  PenLine,
  Rocket,
  Keyboard,
  RefreshCw,
  Search,
  Info,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
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
      <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <SlidersHorizontal size={20} aria-hidden="true" />
        <span>{t.settingsTitle}</span>
      </h2>

      {/* Theme selection */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          <Palette size={17} aria-hidden="true" />
          <span>{t.themeLabel}</span>
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['light', 'dark', 'system'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`btn ${settings.theme === mode ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => onUpdateSettings({ theme: mode })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {mode === 'light' ? (
                <>
                  <Sun size={15} aria-hidden="true" />
                  <span>{t.themeLight}</span>
                </>
              ) : mode === 'dark' ? (
                <>
                  <Moon size={15} aria-hidden="true" />
                  <span>{t.themeDark}</span>
                </>
              ) : (
                <>
                  <Monitor size={15} aria-hidden="true" />
                  <span>{t.themeSystem}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Language selection */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          <Globe size={17} aria-hidden="true" />
          <span>{t.langLabel}</span>
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
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, marginBottom: '0.65rem' }}>
          <PenLine size={17} aria-hidden="true" />
          <span>{t.inputPrefsLabel}</span>
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
          <Rocket size={17} aria-hidden="true" />
          <span>{t.startupLabel}</span>
        </label>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          {t.startupDesc}
        </p>
      </div>

      {/* Hotkey display */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, marginBottom: '0.25rem' }}>
          <Keyboard size={17} aria-hidden="true" />
          <span>{t.hotkeyLabel}</span>
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
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          <RefreshCw size={17} aria-hidden="true" />
          <span>{t.updatesLabel}</span>
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
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {checkingUpdate ? (
                <>
                  <Loader2 size={15} aria-hidden="true" />
                  <span>{t.checkingUpdates}</span>
                </>
              ) : (
                <>
                  <Search size={15} aria-hidden="true" />
                  <span>{t.checkUpdatesBtn}</span>
                </>
              )}
            </button>
          )}
        </div>
        {updateResult && (
          <div style={{ marginTop: '0.6rem', fontSize: '0.85rem', color: updateResult.error ? 'var(--accent-red)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {updateResult.error ? (
              <>
                <AlertTriangle size={15} aria-hidden="true" />
                <span>{updateResult.error}</span>
              </>
            ) : updateResult.updateAvailable ? (
              <>
                <CheckCircle2 size={15} aria-hidden="true" />
                <span>{t.updateAvailableText} (v{updateResult.latestVersion})</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={15} aria-hidden="true" />
                <span>{t.upToDateText}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* About */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, marginBottom: '0.25rem' }}>
          <Info size={17} aria-hidden="true" />
          <span>{t.aboutLabel}</span>
        </label>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {t.aboutDesc}
        </p>
      </div>
    </div>
  );
};
