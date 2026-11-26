import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Locale, translations } from './translations.js';
import { Header, WebPage } from './components/Header.js';
import { TypingArea } from './components/TypingArea.js';
import { PracticeSection } from './components/PracticeSection.js';
import { ReferenceChart } from './components/ReferenceChart.js';
import { InstallGuide } from './components/InstallGuide.js';
import { PackagesGuide } from './components/PackagesGuide.js';

const VALID_PAGES: WebPage[] = ['editor', 'practice', 'chart', 'download', 'packages'];

function getInitialPage(): WebPage {
  const hash = window.location.hash.replace('#', '') as WebPage;
  return VALID_PAGES.includes(hash) ? hash : 'editor';
}

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<WebPage>(getInitialPage);
  const [locale, setLocale] = useState<Locale>('am');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [text, setText] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const t = translations[locale];

  // Sync activePage with browser hash
  const handleSelectPage = useCallback((page: WebPage) => {
    setActivePage(page);
    if (window.location.hash !== `#${page}`) {
      window.history.replaceState(null, '', `#${page}`);
    }
  }, []);

  // Initialize theme from preference or localStorage
  useEffect(() => {
    const saved = localStorage.getItem('amharic-keyboard-theme');
    if (saved === 'dark' || (!saved && window.matchMedia?.('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (next === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      localStorage.setItem('amharic-keyboard-theme', next);
      return next;
    });
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === 'am' ? 'en' : 'am'));
  }, []);

  const toggleEnabled = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2500);
  }, []);

  // Insert character from reference chart into editor and return to editor page
  const handleSelectChar = useCallback(
    (char: string) => {
      setText((prev) => prev + char);
      handleSelectPage('editor');
      showToast(`'${char}' ${t.copiedToast}`);
      setTimeout(() => {
        const el = textareaRef.current;
        if (el) {
          el.focus();
          const len = el.value.length;
          el.setSelectionRange(len, len);
        }
      }, 30);
    },
    [handleSelectPage, showToast, t.copiedToast],
  );

  return (
    <div className="web-shell">
      <Header
        t={t}
        locale={locale}
        onToggleLocale={toggleLocale}
        theme={theme}
        onToggleTheme={toggleTheme}
        activePage={activePage}
        onSelectPage={handleSelectPage}
      />

      <div className="container">
        <main className="page-panel" key={activePage}>
          {activePage === 'editor' && (
            <>
              <section className="hero-banner">
                <h1 className="hero-title">{t.title}</h1>
                <p className="hero-subtitle">{t.subtitle}</p>
              </section>
              <TypingArea
                ref={textareaRef}
                t={t}
                text={text}
                onChangeText={setText}
                enabled={enabled}
                onToggleEnabled={toggleEnabled}
                onShowToast={showToast}
              />
            </>
          )}

          {activePage === 'practice' && <PracticeSection t={t} />}

          {activePage === 'chart' && (
            <ReferenceChart t={t} onSelectChar={handleSelectChar} />
          )}

          {activePage === 'download' && <InstallGuide t={t} />}

          {activePage === 'packages' && <PackagesGuide t={t} />}
        </main>

        {toastMessage && (
          <div className="toast" role="status" aria-live="polite">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};
