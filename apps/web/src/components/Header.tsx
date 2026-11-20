import React from 'react';
import { Locale, Translations } from '../translations.js';

interface HeaderProps {
  t: Translations;
  locale: Locale;
  onToggleLocale: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  t,
  locale,
  onToggleLocale,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="header" role="banner">
      <div className="brand-wrapper">
        <div className="brand-icon" aria-hidden="true">
          አ
        </div>
        <div>
          <h1 className="brand-title">{t.title}</h1>
          <p className="brand-subtitle">{t.subtitle}</p>
        </div>
      </div>

      <div className="header-controls">
        <button
          className="btn-pill"
          onClick={onToggleLocale}
          aria-label={t.langToggle}
        >
          🌐 {locale === 'am' ? 'English' : 'አማርኛ'}
        </button>

        <button
          className="btn-pill"
          onClick={onToggleTheme}
          aria-label={t.themeToggle}
        >
          {theme === 'dark' ? '☀️ ' + t.lightMode : '🌙 ' + t.darkMode}
        </button>
      </div>
    </header>
  );
};
