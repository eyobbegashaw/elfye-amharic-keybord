import React from 'react';
import { Keyboard, Home, Settings2, PenLine, BookOpen, SlidersHorizontal } from 'lucide-react';
import { DesktopTranslations } from '../translations.js';

export type TabId = 'dashboard' | 'ime' | 'practice' | 'chart' | 'settings';

interface NavbarProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  t: DesktopTranslations;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, t }) => {
  return (
    <header className="desktop-navbar">
      <div className="brand">
        <Keyboard size={20} aria-hidden="true" />
        <span>{t.appTitle}</span>
      </div>
      <nav className="nav-tabs" aria-label="Navigation">
        <button
          type="button"
          className={`nav-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onSelectTab('dashboard')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Home size={16} aria-hidden="true" />
          <span>{t.dashboardTab}</span>
        </button>
        <button
          type="button"
          className={`nav-btn ${currentTab === 'ime' ? 'active' : ''}`}
          onClick={() => onSelectTab('ime')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Settings2 size={16} aria-hidden="true" />
          <span>{t.imeGuideTab}</span>
        </button>
        <button
          type="button"
          className={`nav-btn ${currentTab === 'practice' ? 'active' : ''}`}
          onClick={() => onSelectTab('practice')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <PenLine size={16} aria-hidden="true" />
          <span>{t.practiceTab}</span>
        </button>
        <button
          type="button"
          className={`nav-btn ${currentTab === 'chart' ? 'active' : ''}`}
          onClick={() => onSelectTab('chart')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <BookOpen size={16} aria-hidden="true" />
          <span>{t.chartTab}</span>
        </button>
        <button
          type="button"
          className={`nav-btn ${currentTab === 'settings' ? 'active' : ''}`}
          onClick={() => onSelectTab('settings')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          <span>{t.settingsTab}</span>
        </button>
      </nav>
    </header>
  );
};
