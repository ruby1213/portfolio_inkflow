import React, { useCallback } from 'react';
import { useLang } from '../contexts.jsx';
import Reveal from './Reveal.jsx';

const PROJECTS = [
  { num: '01', titleKey: 'p1t', descKey: 'p1d', tags: ['React', 'Next.js', 'TypeScript', 'Stripe'] },
  { num: '02', titleKey: 'p2t', descKey: 'p2d', tags: ['Flutter', 'Dart', 'Rive', 'iOS/Android'] },
  { num: '03', titleKey: 'p3t', descKey: 'p3d', tags: ['Design System', 'Component Library'] },
  { num: '04', titleKey: 'p4t', descKey: 'p4d', tags: ['Web3', 'UX Engineering', 'Security'] },
];

const TIMELINE = [
  { date: '04.2024 — 04.2026', locKey: 'loc1', company: 'SayNode Operations AG', roleKey: 'role1', expKey: 'exp1' },
  { date: '08.2023 — 03.2024', locKey: 'loc2', company: 'K. Lee Trading GmbH', roleKey: 'role2', expKey: 'exp2' },
  { date: '02.2022 — 08.2023', locKey: 'loc3', companyKey: 'relo', roleKey: 'role3', expKey: 'exp3' },
  { date: '08.2020 — 01.2022', locKey: 'loc4', company: 'CHENDERMEI Ltd.', roleKey: 'role4', expKey: 'exp4' },
  { date: '12.2018 — 05.2020', locKey: 'loc5', companyKey: 'wh', roleKey: 'role5', expKey: 'exp5' },
  { date: '09.2016 — 11.2018', locKey: 'loc6', company: 'HIMAR Ltd.', roleKey: 'role6', expKey: 'exp6' },
];

const EDUCATION = [
  { year: '2026', school: 'Coursera', descKey: 'edu1' },
  { year: '2025', school: 'Motion Magic', descKey: 'edu2' },
  { year: '2023', school: 'Constructor Nexademy', descKey: 'edu3' },
  { year: '2012–2016', schoolKey: 'edu4h', descKey: 'edu4' },
];

export default function Projects() {
  const { t } = useLang();

  const onCardMove = useCallback((e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, []);

  return (
    <section id="projects">
      <div className="section-inner">
        <Reveal as="span" className="eyebrow">{t('projEyebrow')}</Reveal>
        <Reveal as="h2" className="sec-title">{t('projTitle')}</Reveal>

        <div className="proj-grid">
          {PROJECTS.map(p => (
            <Reveal key={p.num} className="proj-card" onMouseMove={onCardMove}>
              <span className="proj-num">{p.num}</span>
              <h3>{t(p.titleKey)}</h3>
              <p>{t(p.descKey)}</p>
              <div className="proj-tags">
                {p.tags.map(tag => <span key={tag}>{tag}</span>)}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="timeline">
          <Reveal as="div" className="tl-title">{t('tlTitle')}</Reveal>
          {TIMELINE.map((item, i) => (
            <Reveal as="div" className="tl-item" key={i}>
              <div className="tl-date">
                {item.date}<br />
                <span style={{ opacity: 0.6 }}>{t(item.locKey)}</span>
              </div>
              <div className="tl-line" />
              <div className="tl-content">
                <h4>{item.companyKey ? t(item.companyKey) : item.company}</h4>
                <span className="role">{t(item.roleKey)}</span>
                <p>{t(item.expKey)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="edu-list">
          {EDUCATION.map((e, i) => (
            <Reveal as="div" className="edu-item" key={i}>
              <span className="y">{e.year}</span>
              <span className="s">
                <b>{e.schoolKey ? t(e.schoolKey) : e.school}</b>
                <span>{t(e.descKey)}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
