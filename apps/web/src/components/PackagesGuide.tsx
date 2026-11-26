import React, { useState } from 'react';
import { Package, Terminal, Code2, Bug, Copy, Check, Play, CheckCircle2, AlertTriangle } from 'lucide-react';
import { transliterate, LiveTypingEngine } from '@elfye/core';
import { Translations } from '../translations.js';

interface PackagesGuideProps {
  t: Translations;
}

interface DiagnosticCheck {
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
}

const INSTALL_SNIPPET = `pnpm add @elfye/core @elfye/react
# or with npm
npm install @elfye/core @elfye/react`;

const USAGE_SNIPPET = `import { transliterate } from '@elfye/core';
import { AmharicTextarea } from '@elfye/react';

// 1. Pure string transliteration
console.log(transliterate('selam , endiet nesh')); // ሰላም ፣ እንዴት ነሽ

// 2. React live typing component
export function MyEditor() {
  return <AmharicTextarea placeholder="Type in Amharic..." rows={4} />;
}`;

const DEBUG_CLI_SNIPPET = `# Test core engine + 1,758 corpus words
pnpm --filter @elfye/core test

# Test React hooks & beforeinput components
pnpm --filter @elfye/react test

# Run browser Playwright E2E tests
pnpm --filter web run test:e2e`;

export const PackagesGuide: React.FC<PackagesGuideProps> = ({ t }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [checks, setChecks] = useState<DiagnosticCheck[] | null>(null);

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Ignore clipboard errors in restricted browsers
    }
  };

  const runSelfTest = () => {
    const results: DiagnosticCheck[] = [];

    // 1. Pure transliterate check
    const pureOut = transliterate('selam , endiet nesh');
    results.push({
      name: "transliterate('selam , endiet nesh')",
      expected: 'ሰላም ፣ እንዴት ነሽ',
      actual: pureOut,
      passed: pureOut === 'ሰላም ፣ እንዴት ነሽ',
    });

    // 2. LiveTypingEngine composing & commit check
    const engine = new LiveTypingEngine();
    const r1 = engine.input('s');
    const r2 = engine.input('e');
    const r3 = engine.input('l');
    const livePass = r1.composing === 'ስ' && r2.composing === 'ሰ' && r3.committed === 'ሰ' && r3.composing === 'ል';
    results.push({
      name: 'LiveTypingEngine ("s" -> "e" -> "l")',
      expected: 'composing: ስ -> ሰ, committed: ሰ, composing: ል',
      actual: `composing: ${r1.composing} -> ${r2.composing}, committed: ${r3.committed}, composing: ${r3.composing}`,
      passed: livePass,
    });

    // 3. Progressive backspace check
    const bsEngine = new LiveTypingEngine();
    bsEngine.input('s');
    bsEngine.input('e');
    const b1 = bsEngine.backspace();
    const b2 = bsEngine.backspace();
    results.push({
      name: 'Progressive Backspace (ሰ -> ስ -> "")',
      expected: 'ስ -> ""',
      actual: `${b1.composing} -> "${b2.composing}"`,
      passed: b1.composing === 'ስ' && b2.composing === '',
    });

    setChecks(results);
  };

  const allPassed = checks !== null && checks.every((c) => c.passed);

  return (
    <section className="install-card" aria-label={t.packagesTitle} style={{ marginTop: '1.5rem' }}>
      <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Package size={22} aria-hidden="true" />
        <span>{t.packagesTitle}</span>
      </h2>
      <p className="section-desc">{t.packagesSubtitle}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* 1. Install */}
        <div className="platform-box" style={{ alignItems: 'stretch' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 className="platform-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
              <Terminal size={17} aria-hidden="true" />
              <span>{t.packagesInstallTitle}</span>
            </h3>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              onClick={() => handleCopy('install', INSTALL_SNIPPET)}
            >
              {copiedKey === 'install' ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedKey === 'install' ? t.copiedToast : t.copyBtn}</span>
            </button>
          </div>
          <pre
            style={{
              background: 'var(--bg-primary)',
              padding: '0.75rem',
              borderRadius: '8px',
              overflowX: 'auto',
              fontSize: '0.85rem',
              margin: 0,
            }}
          >
            <code>{INSTALL_SNIPPET}</code>
          </pre>
        </div>

        {/* 2. Usage */}
        <div className="platform-box" style={{ alignItems: 'stretch' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 className="platform-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
              <Code2 size={17} aria-hidden="true" />
              <span>{t.packagesUsageTitle}</span>
            </h3>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              onClick={() => handleCopy('usage', USAGE_SNIPPET)}
            >
              {copiedKey === 'usage' ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedKey === 'usage' ? t.copiedToast : t.copyBtn}</span>
            </button>
          </div>
          <pre
            style={{
              background: 'var(--bg-primary)',
              padding: '0.75rem',
              borderRadius: '8px',
              overflowX: 'auto',
              fontSize: '0.85rem',
              margin: 0,
            }}
          >
            <code>{USAGE_SNIPPET}</code>
          </pre>
        </div>

        {/* 3. Debug & Live Self-Test */}
        <div className="platform-box" style={{ alignItems: 'stretch' }}>
          <h3 className="platform-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Bug size={17} aria-hidden="true" />
            <span>{t.packagesDebugTitle}</span>
          </h3>
          <p className="platform-desc" style={{ marginBottom: '0.75rem' }}>
            {t.packagesDebugDesc}
          </p>

          <div style={{ marginBottom: '0.85rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={runSelfTest}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Play size={16} aria-hidden="true" />
              <span>{t.runSelfTestBtn}</span>
            </button>
          </div>

          {checks && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: allPassed ? 'var(--success)' : '#ef4444',
                }}
              >
                {allPassed ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                <span>{allPassed ? t.selfTestPassed : t.selfTestFailed}</span>
              </div>
              {checks.map((c, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-primary)',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    borderLeft: `3px solid ${c.passed ? 'var(--success)' : '#ef4444'}`,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>Output: {c.actual}</div>
                </div>
              ))}
            </div>
          )}

          <pre
            style={{
              background: 'var(--bg-primary)',
              padding: '0.75rem',
              borderRadius: '8px',
              overflowX: 'auto',
              fontSize: '0.85rem',
              margin: 0,
            }}
          >
            <code>{DEBUG_CLI_SNIPPET}</code>
          </pre>
        </div>
      </div>
    </section>
  );
};
