import { forwardRef, useState } from 'react';
import { AmharicTextarea } from '@elfye/react';
import { Translations } from '../translations.js';

interface TypingAreaProps {
  t: Translations;
  text: string;
  onChangeText: (text: string) => void;
  enabled: boolean;
  onToggleEnabled: () => void;
  onShowToast: (msg: string) => void;
}

export const TypingArea = forwardRef<HTMLTextAreaElement, TypingAreaProps>(function TypingArea(
  { t, text, onChangeText, enabled, onToggleEnabled, onShowToast },
  forwardedRef,
) {
  const [copying, setCopying] = useState(false);

  const wordsCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charsCount = text.length;

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopying(true);
      onShowToast(t.copiedToast);
      setTimeout(() => setCopying(false), 2000);
    } catch {
      // Fallback
      onShowToast(t.copiedToast);
    }
  };

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <section className="editor-card" aria-label={t.title}>
      <div className="editor-header">
        <button
          type="button"
          className={`badge-status ${enabled ? 'active' : 'inactive'}`}
          onClick={onToggleEnabled}
          title={t.toggleShortcutHint}
        >
          <span className="status-indicator" />
          {enabled ? t.amharicEnabled : t.englishEnabled}
          <span style={{ fontSize: '0.75rem', opacity: 0.7 }}> (Ctrl+Space)</span>
        </button>

        <span className="editor-stats">
          <span>{charsCount} {t.charCount}</span>
          <span>{wordsCount} {t.wordCount}</span>
        </span>
      </div>

      <AmharicTextarea
        ref={forwardedRef}
        enabled={enabled}
        className="editor-textarea"
        placeholder={t.textareaPlaceholder}
        value={text}
        onChange={(e) => onChangeText(e.target.value)}
        rows={6}
        aria-label={t.textareaPlaceholder}
      />

      <div className="editor-footer">
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {t.schemeBadge}
        </span>

        <div className="editor-actions">
          <button
            type="button"
            className="btn btn-secondary"
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
            📋 {copying ? t.copiedToast : t.copyBtn}
          </button>
        </div>
      </div>
    </section>
  );
});
