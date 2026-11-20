import React, { useState } from 'react';
import { AmharicTextarea } from '@elfye/react';
import { DesktopTranslations } from '../translations.js';

interface PracticeViewProps {
  t: DesktopTranslations;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ t }) => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const wordsCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charsCount = text.length;

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="card">
      <h2 className="section-title">📝 {t.practiceTitle}</h2>
      <p className="section-desc">{t.practiceSubtitle}</p>

      <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`badge ${enabled ? 'badge-amharic' : 'badge-english'}`}>
            {enabled ? `🟢 ${t.statusAmharic}` : `⚪ ${t.statusEnglish}`}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            💡 {t.toggleHint}
          </span>
        </div>
        <button
          type="button"
          className="btn btn-outline"
          style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
          onClick={() => setEnabled((prev) => !prev)}
        >
          {enabled ? 'Switch to English' : 'Switch to አማርኛ'}
        </button>
      </div>

      <AmharicTextarea
        className="practice-textarea"
        placeholder={t.placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        enabled={enabled}
        rows={8}
      />

      <div className="action-bar">
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
          <span>{t.wordsCount}: <strong>{wordsCount}</strong></span>
          <span>{t.charsCount}: <strong>{charsCount}</strong></span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {copied && (
            <span style={{ color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: 600 }}>
              ✓ {t.copiedToast}
            </span>
          )}
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleClear}
            disabled={!text}
          >
            🗑️ {t.clearBtn}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCopy}
            disabled={!text}
          >
            📋 {t.copyBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
