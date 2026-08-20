import React from 'react';
import { useLang } from '../contexts.jsx';
import Reveal from './Reveal.jsx';

export default function Contact() {
  const { t } = useLang();
  return (
    <section id="contact">
      <div className="section-inner contact-inner">
        <Reveal as="span" className="eyebrow">{t('contactEyebrow')}</Reveal>
        <Reveal as="h2" className="sec-title">{t('contactTitle')}</Reveal>
        <Reveal as="p" className="contact-lead">{t('contactLead')}</Reveal>

        <Reveal className="contact-links">
          <a href="mailto:ruby_huang@gmx.ch">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
            ruby_huang@gmx.ch
          </a>
          <a href="tel:+41772774227">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.8 2Z" /></svg>
            +41 77 277 42 27
          </a>
          <a href="https://www.linkedin.com/in/yuru-huang-tw" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /><path d="M10 9v12M10 13a4 4 0 0 1 8 0v8" /></svg>
            LinkedIn
          </a>
          <a href="#contact" style={{ pointerEvents: 'none' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21s-7-6.2-9.3-10A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 9.3 6C19 14.8 12 21 12 21Z" /></svg>
            <span>{t('location')}</span>
          </a>
        </Reveal>

        <Reveal as="p" className="contact-note">{t('contactNote')}</Reveal>
        <Reveal className="footer-line">© 2026 YURU HUANG — <span>{t('footerNote')}</span></Reveal>
      </div>
    </section>
  );
}
