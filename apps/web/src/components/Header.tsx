import React, { useState } from 'react';
import { Globe, Sun, Moon, Keyboard, Target, BookOpen, Download, Package, Menu, X } from 'lucide-react';
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '#editor', label: t.navEditor, Icon: Keyboard },
    { href: '#practice', label: t.navPractice, Icon: Target },
    { href: '#chart', label: t.navChart, Icon: BookOpen },
    { href: '#download', label: t.navDownload, Icon: Download },
    { href: '#packages', label: t.navPackages, Icon: Package },
  ];

  return (
    <header className="navbar-shell" role="banner">
      <div className="navbar-inner">
        <a href="#editor" className="brand-wrapper" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="brand-icon" aria-hidden="true">
            እ
          </div>
          <div>
            <div className="brand-name-row">
              <span className="brand-name">እልፍዬ</span>
              <span className="brand-tag">Elfye</span>
            </div>
          </div>
        </a>

        <nav className="navbar-links" aria-label="Main navigation">
          {navItems.map(({ href, label, Icon }) => (
            <a key={href} href={href} className="navbar-link">
              <Icon size={15} aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="header-controls">
          <button
            className="btn-pill"
            onClick={onToggleLocale}
            aria-label={t.langToggle}
          >
            <Globe size={15} aria-hidden="true" />
            <span>{locale === 'am' ? 'English' : 'አማርኛ'}</span>
          </button>

          <button
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
          {navItems.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              className="navbar-mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};
