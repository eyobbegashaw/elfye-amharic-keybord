import React from 'react';
import { Download, Smartphone, Laptop, ExternalLink } from 'lucide-react';
import { Translations } from '../translations.js';

const GITHUB_REPO_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GITHUB_REPO_URL ||
  'https://github.com/eyobbegashaw/elfye-amharic-keybord';

export const GITHUB_RELEASES_LATEST_URL = `${GITHUB_REPO_URL}/releases/latest`;
export const GITHUB_RELEASES_ALL_URL = `${GITHUB_REPO_URL}/releases`;

interface InstallGuideProps {
  t: Translations;
}

export const InstallGuide: React.FC<InstallGuideProps> = ({ t }) => {
  return (
    <section className="install-card" aria-label={t.installTitle}>
      <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Download size={22} aria-hidden="true" />
        <span>{t.installTitle}</span>
      </h2>
      <p className="section-desc">{t.installSubtitle}</p>

      <div className="platforms-grid">
        <div className="platform-box">
          <div>
            <h3 className="platform-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Smartphone size={18} aria-hidden="true" />
              <span>{t.androidTitle}</span>
            </h3>
            <p className="platform-desc">{t.androidDesc}</p>
          </div>
          <a
            href={GITHUB_RELEASES_LATEST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
              marginTop: '0.75rem',
            }}
          >
            <Download size={16} aria-hidden="true" />
            <span>{t.downloadAndroidBtn}</span>
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>

        <div className="platform-box">
          <div>
            <h3 className="platform-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Smartphone size={18} aria-hidden="true" />
              <span>{t.iosTitle}</span>
            </h3>
            <p className="platform-desc">{t.iosDesc}</p>
          </div>
          <a
            href={GITHUB_RELEASES_LATEST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
              marginTop: '0.75rem',
            }}
          >
            <Download size={16} aria-hidden="true" />
            <span>{t.downloadIosBtn}</span>
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>

        <div className="platform-box">
          <div>
            <h3 className="platform-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Laptop size={18} aria-hidden="true" />
              <span>{t.desktopTitle}</span>
            </h3>
            <p className="platform-desc">{t.desktopDesc}</p>
          </div>
          <a
            href={GITHUB_RELEASES_LATEST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
              marginTop: '0.75rem',
            }}
          >
            <Download size={16} aria-hidden="true" />
            <span>{t.downloadDesktopBtn}</span>
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
        <a
          href={GITHUB_RELEASES_ALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: 'var(--primary-text)',
            fontSize: '0.9rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <span>{t.viewAllReleasesBtn}</span>
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
};
