import React from 'react';
import { Translations } from '../translations.js';

interface InstallGuideProps {
  t: Translations;
}

export const InstallGuide: React.FC<InstallGuideProps> = ({ t }) => {
  return (
    <section className="install-card" aria-label={t.installTitle}>
      <h2 className="section-title">📲 {t.installTitle}</h2>
      <p className="section-desc">{t.installSubtitle}</p>

      <div className="platforms-grid">
        <div className="platform-box">
          <div>
            <h3 className="platform-title">🤖 {t.androidTitle}</h3>
            <p className="platform-desc">{t.androidDesc}</p>
          </div>
          <div className="platform-status">{t.downloadPlaceholder}</div>
        </div>

        <div className="platform-box">
          <div>
            <h3 className="platform-title">🍎 {t.iosTitle}</h3>
            <p className="platform-desc">{t.iosDesc}</p>
          </div>
          <div className="platform-status">{t.downloadPlaceholder}</div>
        </div>

        <div className="platform-box">
          <div>
            <h3 className="platform-title">💻 {t.desktopTitle}</h3>
            <p className="platform-desc">{t.desktopDesc}</p>
          </div>
          <div className="platform-status">{t.downloadPlaceholder}</div>
        </div>
      </div>
    </section>
  );
};
