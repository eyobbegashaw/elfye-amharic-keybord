import React, { useState } from 'react';
import { Globe, Sun, Moon, Keyboard, Target, BookOpen, Download, Package, Menu, X } from 'lucide-react';
import { Locale, Translations } from '../translations.js';

export type WebPage = 'editor' | 'practice' | 'chart' | 'download' | 'packages';

interface HeaderProps {
  t: Translations;
  locale: Locale;
  onToggleLocale: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  activePage: WebPage;
  onSelectPage: (page: WebPage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  t,
  locale,
  onToggleLocale,
  theme,
  onToggleTheme,
  activePage,
  onSelectPage,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: Array<{ id: WebPage; label: string; Icon: typeof Keyboard }> = [
    { id: 'editor', label: t.navEditor, Icon: Keyboard },
    { id: 'practice', label: t.navPractice, Icon: Target },
    { id: 'chart', label: t.navChart, Icon: BookOpen },
    { id: 'download', label: t.navDownload, Icon: Download },
    { id: 'packages', label: t.navPackages, Icon: Package },
  ];

  const handleNavClick = (id: WebPage) => {
    onSelectPage(id);
    setMobileOpen(false);
  };

  return (
    <header className="navbar-shell" role="banner">
      <div className="navbar-inner">
        <button
          type="button"
          className="brand-wrapper"
          onClick={() => handleNavClick('editor')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, textAlign: 'left' }}
        >
          <div className="brand-icon" aria-hidden="true">
            እ
          </div>
          <div>
            <div className="brand-name-row">
              <span className="brand-name">እልፍዬ</span>
              <span className="brand-tag">Elfye</span>
            </div>
          </div>
        </button>

        <nav className="navbar-links" aria-label="Main navigation">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              data-page={id}
              className={`navbar-link ${activePage === id ? 'active' : ''}`}
              onClick={() => handleNavClick(id)}
              aria-current={activePage === id ? 'page' : undefined}
            >
              <Icon size={15} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="header-controls">
          <button
            type="button"
            className="btn-pill"
            onClick={onToggleLocale}
            aria-label={t.langToggle}
          >
            <Globe size={15} aria-hidden="true" />
            <span>{locale === 'am' ? 'English' : 'አማርኛ'}</span>
          </button>

          <button
            type="button"
            className="btn-pill"
            onClick={onToggleTheme}
            aria-label={t.themeToggle}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={15} aria-hidden="true" />
                <span className="hide-sm">{t.lightMode}</span>
              </>
            ) : (
              <>
                <Moon size={15} aria-hidden="true" />
                <span className="hide-sm">{t.darkMode}</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="btn-pill mobile-menu-btn"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="navbar-mobile-drawer" aria-label="Mobile navigation">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              data-page={id}
              className={`navbar-mobile-link ${activePage === id ? 'active' : ''}`}
              onClick={() => handleNavClick(id)}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};
