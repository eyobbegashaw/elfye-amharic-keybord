import React, { useState, useEffect } from 'react';
import { Navbar, TabId } from './components/Navbar.js';
import { PracticeView } from './components/PracticeView.js';
import { ChartView } from './components/ChartView.js';
import { ImeGuideView } from './components/ImeGuideView.js';
import { SettingsView } from './components/SettingsView.js';
import { Locale, translations } from './translations.js';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabId>('practice');
  const [locale, setLocale] = useState<Locale>('am');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [theme]);

  const t = translations[locale];

  return (
    <div className="desktop-app">
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} t={t} />

      <main className="content-pane">
        {currentTab === 'practice' && <PracticeView t={t} />}
        {currentTab === 'chart' && <ChartView t={t} />}
        {currentTab === 'ime' && <ImeGuideView t={t} />}
        {currentTab === 'settings' && (
          <SettingsView
            t={t}
            locale={locale}
            onLocaleChange={setLocale}
            theme={theme}
            onThemeChange={setTheme}
          />
        )}
      </main>
    </div>
  );
};
