import React, { useState } from 'react';
import { Target, ArrowRight } from 'lucide-react';
import { AmharicInput } from '@elfye/react';
import { Translations } from '../translations.js';

interface PracticeItem {
  latin: string;
  expected: string;
}

const PRACTICE_ITEMS: PracticeItem[] = [
  { latin: 'selam , endiet nesh', expected: 'ሰላም ፣ እንዴት ነሽ' },
  { latin: 'tena yist\'illign', expected: 'ጤና ይስጥልኝ' },
  { latin: 'indemin neh', expected: 'እንደምን ነህ' },
  { latin: 'dehna aderachihu', expected: 'ደህና አደራችሁ' },
  { latin: 'amesegenalehu', expected: 'አመሰግናለሁ' },
];

interface PracticeSectionProps {
  t: Translations;
}

export const PracticeSection: React.FC<PracticeSectionProps> = ({ t }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');

  const currentItem = PRACTICE_ITEMS[currentIndex];
  const isMatch = userInput.trim() === currentItem.expected.trim();

  const handleNext = () => {
    setUserInput('');
    setCurrentIndex((prev) => (prev + 1) % PRACTICE_ITEMS.length);
  };

  return (
    <section className="practice-card" aria-label={t.practiceTitle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <span className="section-icon-badge" aria-hidden="true">
            <Target size={18} />
          </span>
          <span>{t.practiceTitle}</span>
        </h2>
        <span className="step-counter-pill">
          {currentIndex + 1} / {PRACTICE_ITEMS.length}
        </span>
      </div>
      <p className="section-desc">{t.practiceSubtitle}</p>

      <div className="practice-box">
        <div className="practice-prompt">
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {t.practicePromptLabel}
          </span>
          <code className="prompt-latin">{currentItem.latin}</code>
          <ArrowRight size={16} className="prompt-arrow" aria-hidden="true" />
          <span className="prompt-expected">{currentItem.expected}</span>
        </div>

        <AmharicInput
          className="practice-input"
          placeholder={t.practiceInputPlaceholder}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          aria-label={t.practiceInputPlaceholder}
        />

        {isMatch && (
          <div className="practice-feedback" role="alert" aria-live="polite">
            <span>{t.practiceSuccess}</span>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleNext}
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <span>{t.practiceNext}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
