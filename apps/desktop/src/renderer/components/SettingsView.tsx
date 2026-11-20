import React from 'react';
import { Locale, DesktopTranslations } from '../translations.js';

interface SettingsViewProps {
  t: DesktopTranslations;
  locale: Locale;
  onLocaleChange: (loc: Locale) => void;
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (th: 'light' | 'dark' | 'system') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  t,
  locale,
  onLocaleChange,
  theme,
  onThemeChange,
}) => {
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
              className={`btn ${theme === mode ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => onThemeChange(mode)}
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
          <button
            type="button"
            className={`btn ${locale === 'am' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onLocaleChange('am')}
          >
            አማርኛ
          </button>
          <button
            type="button"
            className={`btn ${locale === 'en' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onLocaleChange('en')}
          >
            English
          </button>
        </div>
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
