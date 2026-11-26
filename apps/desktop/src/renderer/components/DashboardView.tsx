import React from 'react';
import {
  Home,
  RefreshCw,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Download,
  Wrench,
  Globe,
  PenLine,
  BookOpen,
  Laptop,
  Loader2,
} from 'lucide-react';
import { DesktopTranslations } from '../translations.js';
import type { ImeStatus } from '../../preload/preload.js';
import { TabId } from './Navbar.js';

interface DashboardViewProps {
  t: DesktopTranslations;
  status: ImeStatus | null;
  busy: boolean;
  actionFeedback: { type: 'success' | 'error'; text: string } | null;
  onRefresh: () => void;
  onQuickInstall: () => void;
  onOpenOsSettings: () => void;
  onNavigate: (tab: TabId) => void;
}

function formatPlatform(platform?: string, arch?: string): string {
  const osName =
    platform === 'win32'
      ? 'Windows'
      : platform === 'darwin'
      ? 'macOS'
      : platform === 'linux'
      ? 'Linux'
      : 'Browser Preview';
  return arch ? `${osName} (${arch})` : osName;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  t,
  status,
  busy,
  actionFeedback,
  onRefresh,
  onQuickInstall,
  onOpenOsSettings,
  onNavigate,
}) => {
  const isElectron = Boolean(window.electronAPI?.isElectron);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Home size={20} aria-hidden="true" />
              <span>{t.dashboardTitle}</span>
            </h2>
            <p className="section-desc">{t.dashboardSubtitle}</p>
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '0.9rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ background: 'var(--bg-primary)', padding: '0.9rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{t.osLabel}</div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>
              {formatPlatform(status?.platform ?? window.electronAPI?.platform, status?.arch ?? window.electronAPI?.arch)}
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '0.9rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{t.imeStatusLabel}</div>
            <span className={`badge ${status?.installed ? 'badge-amharic' : 'badge-english'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              {status?.installed ? <CheckCircle2 size={14} aria-hidden="true" /> : <Circle size={14} aria-hidden="true" />}
              <span>{status?.installed ? t.statusInstalled : t.statusNotInstalled}</span>
            </span>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '0.9rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{t.userProfileLabel}</div>
            <span className={`badge ${status?.activeInUser ? 'badge-amharic' : 'badge-english'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              {status?.activeInUser ? <CheckCircle2 size={14} aria-hidden="true" /> : <Circle size={14} aria-hidden="true" />}
              <span>{status?.activeInUser ? t.statusActive : t.statusInactive}</span>
            </span>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '0.9rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{t.binaryStatusLabel}</div>
            <span className={`badge ${status?.binReady ? 'badge-amharic' : 'badge-english'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              {status?.binReady ? <CheckCircle2 size={14} aria-hidden="true" /> : <AlertTriangle size={14} aria-hidden="true" />}
              <span>{status?.binReady ? t.statusReady : t.statusMissingBin}</span>
            </span>
          </div>
        </div>

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

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onQuickInstall}
            disabled={busy}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {busy ? (
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
                <span>{t.quickInstallBtn}</span>
              </>
            )}
          </button>
          {isElectron && (
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
          )}
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => onNavigate('practice')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <PenLine size={16} aria-hidden="true" />
            <span>{t.practiceTab}</span>
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => onNavigate('chart')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <BookOpen size={16} aria-hidden="true" />
            <span>{t.chartTab}</span>
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Laptop size={18} aria-hidden="true" />
          <span>{t.supportedAppsTitle}</span>
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {t.supportedAppsDesc}
        </p>
      </div>
    </div>
  );
};
