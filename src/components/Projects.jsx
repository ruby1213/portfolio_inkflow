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
    <section id="projects" className="min-h-screen w-full flex flex-col items-center justify-center px-[6vw] pt-[8vh] pb-[12vh] relative">
      <div className="max-w-[920px] w-full mx-auto">
        <Reveal as="span" className="text-[11px] tracking-[.4em] uppercase text-accent mb-[14px] block">{t('projEyebrow')}</Reveal>
        <Reveal as="h2" className="font-mincho font-semibold text-[clamp(28px,5vw,46px)] m-0 mb-10 text-ink tracking-[.02em]">{t('projTitle')}</Reveal>

        <div className="grid grid-cols-2 gap-[22px] max-[720px]:grid-cols-1">
          {PROJECTS.map(p => (
            <Reveal
              key={p.num}
              className="bg-card-bg/60 border border-card-border/50 rounded-[20px] p-7 backdrop-blur-[4px] transition-[transform,box-shadow,border-color] duration-[450ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)] relative overflow-hidden hover:-translate-y-[5px] hover:shadow-[0_18px_40px_color-mix(in_srgb,var(--shadow)_16%,transparent)] hover:border-accent/40 after:content-[''] after:absolute after:inset-0 after:rounded-[20px] after:pointer-events-none after:[background:radial-gradient(120px_90px_at_var(--mx,50%)_var(--my,50%),color-mix(in_srgb,var(--accent)_10%,transparent),transparent_70%)] after:opacity-0 after:transition-opacity after:duration-[400ms] hover:after:opacity-100"
              onMouseMove={onCardMove}
            >
              <span className="font-garamond italic text-[13px] text-accent tracking-[.1em]">{p.num}</span>
              <h3 className="font-mincho text-[19px] mt-2.5 mb-2.5 text-ink font-semibold">{t(p.titleKey)}</h3>
              <p className="text-[13.5px] leading-[1.85] text-fg-dim m-0">{t(p.descKey)}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tags.map(tag => (
                  <span key={tag} className="text-[10.5px] px-2.5 py-1 rounded-xl bg-accent/[.09] text-fg-dim">{tag}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14">
          <Reveal as="div" className="text-[12px] tracking-[.25em] uppercase text-fg-dim mb-6">{t('tlTitle')}</Reveal>
          {TIMELINE.map((item, i) => (
            <Reveal
              as="div"
              className="grid grid-cols-[150px_1px_1fr] gap-x-[26px] pb-[30px] relative last:pb-0 max-[640px]:grid-cols-[26px_1px_1fr]"
              key={i}
            >
              <div className="text-[12px] text-fg-dim pt-0.5 text-right max-[640px]:hidden">
                {item.date}<br />
                <span style={{ opacity: 0.6 }}>{t(item.locKey)}</span>
              </div>
              <div className="relative bg-card-border/60 before:content-[''] before:absolute before:top-1 before:-left-[3.5px] before:w-2 before:h-2 before:rounded-full before:bg-accent" />
              <div>
                <h4 className="m-0 mb-1 text-[15px] text-ink font-semibold">{item.companyKey ? t(item.companyKey) : item.company}</h4>
                <span className="text-[12.5px] text-accent mb-2 block">{t(item.roleKey)}</span>
                <p className="text-[13px] text-fg-dim leading-[1.8] m-0">{t(item.expKey)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3.5 max-[640px]:grid-cols-1">
          {EDUCATION.map((e, i) => (
            <Reveal
              as="div"
              className="flex justify-between gap-3.5 px-[18px] py-3.5 border border-card-border/50 rounded-[14px] bg-card-bg/40 text-[12.5px]"
              key={i}
            >
              <span className="text-accent font-semibold whitespace-nowrap">{e.year}</span>
              <span className="text-fg-dim text-right">
                <b className="text-fg block font-semibold mb-0.5">{e.schoolKey ? t(e.schoolKey) : e.school}</b>
                <span>{t(e.descKey)}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
