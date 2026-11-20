import React from 'react';
import { DesktopTranslations } from '../translations.js';

export type TabId = 'practice' | 'chart' | 'ime' | 'settings';

interface NavbarProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  t: DesktopTranslations;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, t }) => {
  return (
    <header className="desktop-navbar">
      <div className="brand">
        <span>⌨️</span>
        <span>{t.appTitle}</span>
      </div>
      <nav className="nav-tabs" aria-label="Navigation">
        <button
          type="button"
          className={`nav-btn ${currentTab === 'practice' ? 'active' : ''}`}
          onClick={() => onSelectTab('practice')}
        >
          📝 {t.practiceTab}
        </button>
        <button
          type="button"
          className={`nav-btn ${currentTab === 'chart' ? 'active' : ''}`}
          onClick={() => onSelectTab('chart')}
        >
          📖 {t.chartTab}
        </button>
        <button
          type="button"
          className={`nav-btn ${currentTab === 'ime' ? 'active' : ''}`}
          onClick={() => onSelectTab('ime')}
        >
          ⚙️ {t.imeGuideTab}
        </button>
        <button
          type="button"
          className={`nav-btn ${currentTab === 'settings' ? 'active' : ''}`}
          onClick={() => onSelectTab('settings')}
        >
          🔧 {t.settingsTab}
        </button>
      </nav>
    </header>
  );
};
