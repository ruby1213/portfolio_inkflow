import React from 'react';
import { useLang } from '../contexts.jsx';

export default function Hero() {
  const { t } = useLang();
  return (
    <section id="hero" className="hero">
      <span className="seal">{t('seal')}</span>
      <div className="section-inner">
        <span className="hero-mark">{t('heroMark')}</span>
        <h1 className="hero-title">
          YURU
          <span className="surname">{t('heroSurname')}</span>
        </h1>
        <p className="hero-sub">{t('heroSub')}</p>
        <p className="hero-tagline">{t('heroTagline')}</p>
        <div className="hero-hint">
          <div className="line" />
          <span>{t('heroHint')}</span>
        </div>
      </div>
    </section>
  );
}
