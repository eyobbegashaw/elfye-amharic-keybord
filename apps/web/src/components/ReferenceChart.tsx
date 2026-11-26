import React, { useMemo, useState } from 'react';
import { BookOpen, Lightbulb } from 'lucide-react';
import { generateReferenceChart } from '../chartData.js';
import { Translations } from '../translations.js';

interface ReferenceChartProps {
  t: Translations;
  onSelectChar: (char: string) => void;
}

export const ReferenceChart: React.FC<ReferenceChartProps> = ({ t, onSelectChar }) => {
  const [search, setSearch] = useState('');

  // Dynamically generated from @elfye/core
  const allRows = useMemo(() => generateReferenceChart(), []);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allRows;

    return allRows.filter((row) => {
      // Search in consonant key (e.g. "sh", "ch", "h")
      if (row.key.toLowerCase().includes(q)) return true;
      // Search in any Ethiopic character in the row
      return row.cells.some(
        (cell) =>
          cell.char &&
          (cell.char.includes(q) || cell.keystroke.toLowerCase().includes(q)),
      );
    });
  }, [allRows, search]);

  const headers = [
    t.order1,
    t.order2,
    t.order3,
    t.order4,
    t.order5,
    t.order6,
    t.order7,
    t.order8,
  ];

  return (
    <section className="chart-card" aria-label={t.chartTitle}>
      <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BookOpen size={22} aria-hidden="true" />
        <span>{t.chartTitle}</span>
      </h2>
      <p className="section-desc">{t.chartSubtitle}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <input
          type="search"
          className="chart-search-bar"
          placeholder={t.chartSearchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label={t.chartSearchPlaceholder}
        />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Lightbulb size={15} aria-hidden="true" />
          <span>{t.chartClickHint}</span>
        </span>
      </div>

      <div className="table-wrapper">
        <table className="reference-table">
          <thead>
            <tr>
              <th style={{ width: '108px' }}>ቁጥር</th>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.key}>
                <td className="chart-row-key">
                  {row.key}
                </td>
                {row.cells.map((cell, idx) => (
                  <td key={idx}>
                    {cell.char ? (
                      <button
                        type="button"
                        className="cell-button"
                        onClick={() => onSelectChar(cell.char!)}
                        title={`ይጫኑ፦ ${cell.char} (${cell.keystroke})`}
                      >
                        <span className="cell-char">{cell.char}</span>
                        <span className="cell-key">{cell.keystroke}</span>
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
