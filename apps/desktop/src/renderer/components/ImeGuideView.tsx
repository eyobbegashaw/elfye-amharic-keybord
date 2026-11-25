import React, { useState } from 'react';
import { DesktopTranslations } from '../translations.js';
import type { ImeStatus } from '../../preload/preload.js';

interface ImeGuideViewProps {
  t: DesktopTranslations;
  status: ImeStatus | null;
  busy: boolean;
  busyAction: 'install' | 'uninstall' | null;
  actionFeedback: { type: 'success' | 'error'; text: string } | null;
  onInstallOrRepair: () => void;
  onUninstall: () => void;
  onRefresh: () => void;
  onOpenOsSettings: () => void;
}

type PlatformTab = 'linux' | 'macos' | 'windows';

export const ImeGuideView: React.FC<ImeGuideViewProps> = ({
  t,
  status,
  busy,
  busyAction,
  actionFeedback,
  onInstallOrRepair,
  onUninstall,
  onRefresh,
  onOpenOsSettings,
}) => {
  const detectedPlatform = window.electronAPI?.platform;
  const isElectron = Boolean(window.electronAPI?.isElectron);
  const initialTab: PlatformTab =
    detectedPlatform === 'darwin'
      ? 'macos'
      : detectedPlatform === 'linux'
      ? 'linux'
      : 'windows';

  const [activeTab, setActiveTab] = useState<PlatformTab>(initialTab);
  const isCurrentOsTab =
    (activeTab === 'windows' && detectedPlatform === 'win32') ||
    (activeTab === 'macos' && detectedPlatform === 'darwin') ||
    (activeTab === 'linux' && detectedPlatform === 'linux');

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 className="section-title">⚙️ {t.imeTitle}</h2>
          <p className="section-desc">{t.imeSubtitle}</p>
        </div>
        {isElectron && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={onRefresh}
            disabled={busy}
          >
            🔄 {t.refreshBtn}
          </button>
        )}
      </div>

      {detectedPlatform && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span className="badge badge-amharic">
            🖥️ {t.currentPlatformBadge}:{' '}
            {detectedPlatform === 'win32'
              ? 'Windows'
              : detectedPlatform === 'darwin'
              ? 'macOS'
              : 'Linux'}
          </span>
          <span className={`badge ${status?.installed ? 'badge-amharic' : 'badge-english'}`}>
            {status?.installed ? `🟢 ${t.statusInstalled}` : `⚪ ${t.statusNotInstalled}`}
          </span>
        </div>
      )}

      {actionFeedback && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)',
            marginBottom: '1rem',
            background: actionFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${actionFeedback.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)'}`,
            fontSize: '0.9rem',
          }}
        >
          {actionFeedback.type === 'success' ? '✓ ' : '⚠️ '}
          {actionFeedback.text}
        </div>
      )}

      {isElectron && isCurrentOsTab && (
        <div
          style={{
            display: 'flex',
            gap: '0.65rem',
            flexWrap: 'wrap',
            marginBottom: '1.25rem',
            padding: '1rem',
            borderRadius: 'var(--radius)',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
          }}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={onInstallOrRepair}
            disabled={busy}
          >
            {busyAction === 'install'
              ? `⏳ ${t.installingText}`
              : status?.installed
              ? `🔧 ${t.repairBtn}`
              : `⬇️ ${t.installBtn}`}
          </button>

          {status?.installed && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={onUninstall}
              disabled={busy}
              style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}
            >
              {busyAction === 'uninstall' ? `⏳ ${t.uninstallingText}` : `🗑️ ${t.uninstallBtn}`}
            </button>
          )}

          <button
            type="button"
            className="btn btn-outline"
            onClick={onOpenOsSettings}
            disabled={busy}
          >
            🌐 {t.openOsSettingsBtn}
          </button>
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
        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.6rem', color: 'var(--text-muted)' }}>
          {t.manualGuideTitle}
        </div>
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
