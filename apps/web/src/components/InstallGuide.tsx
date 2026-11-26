import React from 'react';
import { Download, Smartphone, Laptop } from 'lucide-react';
import { Translations } from '../translations.js';

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
          <div className="platform-status">{t.downloadPlaceholder}</div>
        </div>

        <div className="platform-box">
          <div>
            <h3 className="platform-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Smartphone size={18} aria-hidden="true" />
              <span>{t.iosTitle}</span>
            </h3>
            <p className="platform-desc">{t.iosDesc}</p>
          </div>
          <div className="platform-status">{t.downloadPlaceholder}</div>
        </div>

        <div className="platform-box">
          <div>
            <h3 className="platform-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Laptop size={18} aria-hidden="true" />
              <span>{t.desktopTitle}</span>
            </h3>
            <p className="platform-desc">{t.desktopDesc}</p>
          </div>
          <div className="platform-status">{t.downloadPlaceholder}</div>
        </div>
      </div>
    </section>
  );
};
