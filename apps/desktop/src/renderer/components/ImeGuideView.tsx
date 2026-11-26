import React, { useState } from 'react';
import {
  Settings2,
  RefreshCw,
  Monitor,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Download,
  Wrench,
  Trash2,
  Globe,
  Terminal,
  Loader2,
} from 'lucide-react';
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
    !detectedPlatform ||
    (activeTab === 'windows' && detectedPlatform === 'win32') ||
    (activeTab === 'macos' && detectedPlatform === 'darwin') ||
    (activeTab === 'linux' && detectedPlatform === 'linux');

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings2 size={20} aria-hidden="true" />
            <span>{t.imeTitle}</span>
          </h2>
          <p className="section-desc">{t.imeSubtitle}</p>
        </div>
        {isElectron && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={onRefresh}
            disabled={busy}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={15} aria-hidden="true" />
            <span>{t.refreshBtn}</span>
          </button>
        )}
      </div>

      {detectedPlatform && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span className="badge badge-amharic" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Monitor size={14} aria-hidden="true" />
            <span>
              {t.currentPlatformBadge}:{' '}
              {detectedPlatform === 'win32'
                ? 'Windows'
                : detectedPlatform === 'darwin'
                ? 'macOS'
                : 'Linux'}
            </span>
          </span>
          <span className={`badge ${status?.installed ? 'badge-amharic' : 'badge-english'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            {status?.installed ? <CheckCircle2 size={14} aria-hidden="true" /> : <Circle size={14} aria-hidden="true" />}
            <span>{status?.installed ? t.statusInstalled : t.statusNotInstalled}</span>
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
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {actionFeedback.type === 'success' ? <CheckCircle2 size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
          <span>{actionFeedback.text}</span>
        </div>
      )}

      {isCurrentOsTab && (
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
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {busyAction === 'install' ? (
              <>
                <Loader2 size={16} aria-hidden="true" />
                <span>{t.installingText}</span>
              </>
            ) : status?.installed ? (
              <>
                <Wrench size={16} aria-hidden="true" />
                <span>{t.repairBtn}</span>
              </>
            ) : (
              <>
                <Download size={16} aria-hidden="true" />
                <span>{t.installBtn}</span>
              </>
            )}
          </button>

          {status?.installed && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={onUninstall}
              disabled={busy}
              style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {busyAction === 'uninstall' ? (
                <>
                  <Loader2 size={16} aria-hidden="true" />
                  <span>{t.uninstallingText}</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} aria-hidden="true" />
                  <span>{t.uninstallBtn}</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            className="btn btn-outline"
            onClick={onOpenOsSettings}
            disabled={busy}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Globe size={16} aria-hidden="true" />
            <span>{t.openOsSettingsBtn}</span>
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          type="button"
          className={`btn ${activeTab === 'windows' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('windows')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Monitor size={15} aria-hidden="true" />
          <span>{t.windowsTab}</span>
        </button>
        <button
          type="button"
          className={`btn ${activeTab === 'macos' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('macos')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Monitor size={15} aria-hidden="true" />
          <span>{t.macosTab}</span>
        </button>
        <button
          type="button"
          className={`btn ${activeTab === 'linux' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('linux')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Terminal size={15} aria-hidden="true" />
          <span>{t.linuxTab}</span>
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
