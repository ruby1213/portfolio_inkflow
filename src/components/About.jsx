import React from 'react';
import { useLang } from '../contexts.jsx';
import Reveal from './Reveal.jsx';

const STRENGTHS = [1, 2, 3, 4, 5, 6];
const SKILLS = ['TypeScript', 'JavaScript', 'Dart', 'Python', 'React', 'Next.js', 'Flutter', 'Django', 'HTML5 / CSS'];

export default function About() {
  const { t } = useLang();
  return (
    <section id="about">
      <div className="section-inner">
        <Reveal as="span" className="eyebrow">{t('aboutEyebrow')}</Reveal>
        <Reveal as="h2" className="sec-title">{t('aboutTitle')}</Reveal>
        <div className="about-grid">
          <Reveal>
            <p className="about-lead">{t('aboutLead')}</p>
            <ul className="strengths">
              {STRENGTHS.map(n => (
                <li key={n}>
                  <b>{t(`s${n}t`)}</b> {t(`s${n}d`)}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <div className="side-block">
              <h4>{t('skillsTitle')}</h4>
              <div className="skill-tags">
                {SKILLS.map(s => <span key={s}>{s}</span>)}
              </div>
            </div>
            <div className="side-block">
              <h4>{t('langTitle')}</h4>
              <div className="lang-rows">
                <div><span>{t('lang1')}</span><span className="lv">{t('lang1v')}</span></div>
                <div><span>{t('lang2')}</span><span className="lv">{t('lang2v')}</span></div>
                <div><span>{t('lang3')}</span><span className="lv">{t('lang3v')}</span></div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
