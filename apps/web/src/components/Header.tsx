import React from 'react';
import { Globe, Sun, Moon } from 'lucide-react';
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
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Globe size={16} aria-hidden="true" />
          <span>{locale === 'am' ? 'English' : 'አማርኛ'}</span>
        </button>

        <button
          className="btn-pill"
          onClick={onToggleTheme}
          aria-label={t.themeToggle}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={16} aria-hidden="true" />
              <span>{t.lightMode}</span>
            </>
          ) : (
            <>
              <Moon size={16} aria-hidden="true" />
              <span>{t.darkMode}</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
