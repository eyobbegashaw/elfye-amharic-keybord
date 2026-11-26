import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Locale, translations } from './translations.js';
import { Header } from './components/Header.js';
import { TypingArea } from './components/TypingArea.js';
import { PracticeSection } from './components/PracticeSection.js';
import { ReferenceChart } from './components/ReferenceChart.js';
import { InstallGuide } from './components/InstallGuide.js';
import { PackagesGuide } from './components/PackagesGuide.js';

export const App: React.FC = () => {
  const [locale, setLocale] = useState<Locale>('am');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [text, setText] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const t = translations[locale];

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

  // Insert character from reference chart into textarea
  const handleSelectChar = useCallback((char: string) => {
    const el = textareaRef.current;
    if (el) {
      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? el.value.length;
      const val = el.value;
      const next = val.slice(0, start) + char + val.slice(end);
      setText(next);

      // Restore caret right after inserted char
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + char.length, start + char.length);
      }, 0);
    } else {
      setText((prev) => prev + char);
    }
  }, []);

  return (
    <>
      <Header
        t={t}
        locale={locale}
        onToggleLocale={toggleLocale}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="container">
        <section className="hero-banner">
          <h1 className="hero-title">{t.title}</h1>
          <p className="hero-subtitle">{t.subtitle}</p>
        </section>

        <main>
          <div id="editor" className="section-anchor">
            <TypingArea
              ref={textareaRef}
              t={t}
              text={text}
              onChangeText={setText}
              enabled={enabled}
              onToggleEnabled={toggleEnabled}
              onShowToast={showToast}
            />
          </div>

          <div id="practice" className="section-anchor">
            <PracticeSection t={t} />
          </div>

          <div id="chart" className="section-anchor">
            <ReferenceChart t={t} onSelectChar={handleSelectChar} />
          </div>

          <div id="download" className="section-anchor">
            <InstallGuide t={t} />
          </div>

          <div id="packages" className="section-anchor">
            <PackagesGuide t={t} />
          </div>
        </main>

        {toastMessage && (
          <div className="toast" role="status" aria-live="polite">
            {toastMessage}
          </div>
        )}
      </div>
    </>
  );
};
