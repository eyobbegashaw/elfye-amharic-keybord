import React, { useState } from 'react';
import { ReferenceChart } from '@elfye/react';
import { DesktopTranslations } from '../translations.js';

interface ChartViewProps {
  t: DesktopTranslations;
}

export const ChartView: React.FC<ChartViewProps> = ({ t }) => {
  const [copiedChar, setCopiedChar] = useState<string | null>(null);

  const handleSelectChar = async (char: string) => {
    try {
      await navigator.clipboard.writeText(char);
      setCopiedChar(char);
      setTimeout(() => setCopiedChar(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div>
      {copiedChar && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--primary)',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 100,
          }}
        >
          ✓ '{copiedChar}' ተቀድቷል!
        </div>
      )}
      <ReferenceChart
        onSelectChar={handleSelectChar}
        labels={{
          title: t.chartTab,
          clickHint: 'ፊደሉን ጠቅ በማድረግ ወደ Clipboard ይቅዱ',
        }}
      />
    </div>
  );
};
