import React, { useState } from 'react';
import { DesktopTranslations } from '../translations.js';

interface ImeGuideViewProps {
  t: DesktopTranslations;
}

type PlatformTab = 'linux' | 'macos' | 'windows';

export const ImeGuideView: React.FC<ImeGuideViewProps> = ({ t }) => {
  const detectedPlatform = window.electronAPI?.platform;
  const initialTab: PlatformTab =
    detectedPlatform === 'darwin'
      ? 'macos'
      : detectedPlatform === 'linux'
      ? 'linux'
      : 'windows';

  const [activeTab, setActiveTab] = useState<PlatformTab>(initialTab);

  return (
    <div className="card">
      <h2 className="section-title">⚙️ {t.imeTitle}</h2>
      <p className="section-desc">{t.imeSubtitle}</p>

      {detectedPlatform && (
        <div style={{ marginBottom: '1rem' }}>
          <span className="badge badge-amharic">
            🖥️ {t.currentPlatformBadge}: {detectedPlatform === 'win32' ? 'Windows' : detectedPlatform === 'darwin' ? 'macOS' : 'Linux'}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          type="button"
          className={`btn ${activeTab === 'windows' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('windows')}
        >
          🪟 {t.windowsTab}
        </button>
        <button
          type="button"
          className={`btn ${activeTab === 'macos' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('macos')}
        >
          🍎 {t.macosTab}
        </button>
        <button
          type="button"
          className={`btn ${activeTab === 'linux' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('linux')}
        >
          🐧 {t.linuxTab}
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius)' }}>
        <ol className="step-list">
          {activeTab === 'windows' &&
            t.windowsSteps.map((step, idx) => (
              <li key={idx} className="step-item">
                {step}
              </li>
            ))}
          {activeTab === 'macos' &&
            t.macosSteps.map((step, idx) => (
              <li key={idx} className="step-item">
                {step}
              </li>
            ))}
          {activeTab === 'linux' &&
            t.linuxSteps.map((step, idx) => (
              <li key={idx} className="step-item">
                {step}
              </li>
            ))}
        </ol>
      </div>
    </div>
  );
};
