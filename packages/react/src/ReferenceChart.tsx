import React, { useMemo, useState } from 'react';
import { generateReferenceChart, ChartRow } from './chartData.js';

export interface ReferenceChartLabels {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  clickHint?: string;
  orderHeaders?: [string, string, string, string, string, string, string, string];
}

export interface ReferenceChartProps {
  onSelectChar?: (char: string) => void;
  labels?: ReferenceChartLabels;
  className?: string;
}

const DEFAULT_LABELS: Required<ReferenceChartLabels> = {
  title: 'የአጻጻፍ ደንቦች ሰንጠረዥ (Addiyon Scheme)',
  subtitle: '7ቱ የግዕዝ ድምፆች እና 8ኛው የተደራረበ ድምጽ (ዋ/ua)',
  searchPlaceholder: 'ፊደል ወይም የእንግሊዝኛ ቁልፍ ይፈልጉ (ለምሳሌ: sh, ch, ሀ, ሰ)...',
  clickHint: 'ፊደሉን ጠቅ በማድረግ ይቅዱ ወይም ይጻፉ',
  orderHeaders: [
    '1ኛ (ግዕዝ - e)',
    '2ኛ (ካዕብ - u)',
    '3ኛ (ሣልስ - i)',
    '4ኛ (ራብዕ - a)',
    '5ኛ (ኃምስ - ie)',
    '6ኛ (ሳድስ - ∅)',
    '7ኛ (ሳብዕ - o)',
    '8ኛ (ዲቃላ - ua)',
  ],
};

export const ReferenceChart: React.FC<ReferenceChartProps> = ({
  onSelectChar,
  labels = {},
  className = '',
}) => {
  const [search, setSearch] = useState('');

  const l = { ...DEFAULT_LABELS, ...labels };
  const allRows = useMemo(() => generateReferenceChart(), []);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allRows;

    return allRows.filter((row: ChartRow) => {
      if (row.key.toLowerCase().includes(q)) return true;
      return row.cells.some(
        (cell) =>
          cell.char &&
          (cell.char.includes(q) || cell.keystroke.toLowerCase().includes(q)),
      );
    });
  }, [allRows, search]);

  return (
    <section className={`chart-card ${className}`} aria-label={l.title}>
      <h2 className="section-title">📖 {l.title}</h2>
      <p className="section-desc">{l.subtitle}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <input
          type="search"
          className="chart-search-bar"
          placeholder={l.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label={l.searchPlaceholder}
        />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', marginBottom: '1rem' }}>
          💡 {l.clickHint}
        </span>
      </div>

      <div className="table-wrapper" style={{ overflowX: 'auto' }}>
        <table className="reference-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ቁልፍ</th>
              {l.orderHeaders.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row: ChartRow) => (
              <tr key={row.key}>
                <td style={{ fontWeight: 700, color: 'var(--primary-text, inherit)' }}>
                  {row.key}
                </td>
                {row.cells.map((cell, idx) => (
                  <td key={idx} style={{ textAlign: 'center', padding: '4px' }}>
                    {cell.char ? (
                      <button
                        type="button"
                        className="cell-button"
                        onClick={() => onSelectChar?.(cell.char!)}
                        title={`ይጫኑ፦ ${cell.char} (${cell.keystroke})`}
                      >
                        <span className="cell-char" style={{ fontSize: '1.25rem', display: 'block' }}>
                          {cell.char}
                        </span>
                        <span className="cell-key" style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                          {cell.keystroke}
                        </span>
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-muted, #94a3b8)' }}>—</span>
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
