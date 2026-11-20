import React, { useState } from 'react';
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
      <h2 className="section-title">🎯 {t.practiceTitle}</h2>
      <p className="section-desc">{t.practiceSubtitle}</p>

      <div className="practice-box">
        <div className="practice-prompt">
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {t.practicePromptLabel}
          </span>
          <code className="prompt-latin">{currentItem.latin}</code>
          <span className="prompt-arrow">➔</span>
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
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.85rem' }}
            >
              {t.practiceNext} ➔
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
