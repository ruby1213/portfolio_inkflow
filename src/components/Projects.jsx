import React, { useCallback } from "react";
import { useLang } from "../contexts.jsx";
import Reveal from "./Reveal.jsx";
import ProjectLinkIcon from "./ProjectLinkIcon.jsx";
import { useScrollReveal } from "../hooks/useScrollReveal.js";

const PROJECTS = [
  {
    num: "01",
    titleKey: "p1t",
    descKey: "p1d",
    link: "https://www.skillbuddy.io/",
    app_store: "https://apps.apple.com/ch/app/skillbuddy-io/id6473525692",
    play_store:
      "https://play.google.com/store/apps/details?id=io.skillbuddy.academy",
    tags: ["React", "Next.js", "TypeScript", "Stripe"],
  },
  {
    num: "02",
    titleKey: "p2t",
    descKey: "p2d",
    app_store: "https://apps.apple.com/ch/app/legacy-academy/id6447242752",
    play_store:
      "https://play.google.com/store/apps/details?id=io.legacy.academy",
    tags: ["Flutter", "Dart", "Rive", "iOS/Android"],
  },
  {
    num: "03",
    titleKey: "p3t",
    descKey: "p3d",
    link: "https://painbreaker.ch/",
    app_store: "https://apps.apple.com/ch/app/painbreaker/id6757533963",
    play_store:
      "https://play.google.com/store/apps/details?id=ch.painbreaker.painbreaker",
    tags: ["Flutter", "Dart", "Rive", "iOS/Android"],
  },
  // {
  //   num: "04",
  //   titleKey: "p4t",
  //   descKey: "p4d",
  //   tags: ["Web3", "UX Engineering", "Security"],
  // },
];

const TIMELINE = [
  {
    date: "04.2024 — 04.2026",
    locKey: "loc1",
    company: "SayNode Operations AG",
    roleKey: "role1",
    expKey: "exp1",
  },
  {
    date: "08.2023 — 03.2024",
    locKey: "loc2",
    company: "K. Lee Trading GmbH",
    roleKey: "role2",
    expKey: "exp2",
  },
  {
    date: "02.2022 — 08.2023",
    locKey: "loc3",
    companyKey: "relo",
    roleKey: "role3",
    expKey: "exp3",
  },
  {
    date: "08.2020 — 01.2022",
    locKey: "loc4",
    company: "CHENDERMEI Ltd.",
    roleKey: "role4",
    expKey: "exp4",
  },
  {
    date: "12.2018 — 05.2020",
    locKey: "loc5",
    companyKey: "wh",
    roleKey: "role5",
    expKey: "exp5",
  },
  {
    date: "09.2016 — 11.2018",
    locKey: "loc6",
    company: "HIMAR Ltd.",
    roleKey: "role6",
    expKey: "exp6",
  },
];

const EDUCATION = [
  { year: "2026", school: "Coursera", descKey: "edu1" },
  { year: "2025", school: "Motion Magic", descKey: "edu2" },
  { year: "2023", school: "Constructor Nexademy", descKey: "edu3" },
  { year: "2012–2016", schoolKey: "edu4h", descKey: "edu4" },
];

export default function Projects() {
  const { t } = useLang();
  const [sectionRef, inView] = useScrollReveal();

  const onCardMove = useCallback((e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`min-h-screen w-full flex flex-col items-center justify-center px-[6vw] pt-[8vh] pb-[12vh] relative transition-[opacity,transform] duration-1100 ease-out ${
        inView ? "opacity-100 scale-100" : "opacity-0 scale-[.97]"
      }`}
    >
      <div className="max-w-230ull mx-auto">
        <Reveal
          as="span"
          className="text-[11px] tracking-[.4em] uppercase text-accent mb-3.5 block"
        >
          {t("projEyebrow")}
        </Reveal>
        <Reveal
          as="h2"
          className="font-mincho font-semibold text-[clamp(28px,5vw,46px)] m-0 mb-10 text-ink tracking-[.02em]"
        >
          {t("projTitle")}
        </Reveal>

        <div className="grid grid-cols-3 gap-5.5 max-[720px]:grid-cols-1">
          {PROJECTS.map((p) => (
            <Reveal
              key={p.num}
              className="bg-card-bg/60 border border-card-border/50 rounded-[20px] pb-7 px-7 pt-2 backdrop-blur-xsansition-[transform,box-shadow,border-color] duration-450 ease-[cubic-bezier(.2,.8,.2,1)] relative overflow-hidden  hover:shadow-[0_18px_40px_hsla(var(--shadow)/.16)] hover:border-accent/40 after:content-[''] after:absolute after:inset-0 after:rounded-[20px] after:pointer-events-none after:[background:radial-gradient(120px_90px_at_var(--mx,50%)_var(--my,50%),hsla(var(--accent)/.10),transparent_70%)] after:opacity-0 after:transition-opacity after:duration-400 hover:after:opacity-100"
              // onMouseMove={onCardMove}
            >
              <div className="lg:flex justify-between">
                <div className="flex">
                  <span className="font-garamond italic text-[13px] text-accent tracking-widest">
                    {p.num}
                  </span>
                  <h3 className="font-mincho text-[19px] mt-2.5 mb-2.5 text-ink font-semibold">
                    {t(p.titleKey)}
                  </h3>
                </div>
                {(p.link || p.app_store || p.play_store) && (
                  <div className="py-2 flex  gap-2.5 justify-end ">
                    {p.link && (
                      <ProjectLinkIcon href={p.link} ariaLabel="Website">
                        <svg
                          viewBox="0 0 24 24"
                          width="15"
                          height="15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9Z" />
                        </svg>
                      </ProjectLinkIcon>
                    )}
                    {p.app_store && (
                      <ProjectLinkIcon href={p.app_store} ariaLabel="App Store">
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="currentColor"
                        >
                          <path d="M16.365 1.43c0 1.14-.462 2.253-1.212 3.084-.813.9-2.146 1.594-3.243 1.503-.135-1.1.44-2.28 1.174-3.058C13.83 1.996 15.223 1.31 16.365 1.43zM20.573 17.318c-.44 1.017-.65 1.472-1.216 2.373-.79 1.257-1.904 2.822-3.286 2.835-1.226.013-1.542-.8-3.205-.79-1.662.01-2.01.804-3.238.79-1.38-.013-2.436-1.426-3.226-2.683-2.213-3.518-2.446-7.646-1.08-9.845.968-1.556 2.5-2.466 3.94-2.466 1.466 0 2.388.804 3.6.804 1.176 0 1.892-.806 3.585-.806 1.283 0 2.642.7 3.612 1.907-3.174 1.74-2.658 6.276.514 7.881z" />
                        </svg>
                      </ProjectLinkIcon>
                    )}
                    {p.play_store && (
                      <ProjectLinkIcon
                        href={p.play_store}
                        ariaLabel="Google Play"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="currentColor"
                        >
                          <path d="M3.6 2.6c-.4.3-.6.7-.6 1.3v16.2c0 .6.2 1 .6 1.3l9.5-9.4-9.5-9.4zM15.8 12l2.5-2.5-9.4-5.4a1.7 1.7 0 00-.9-.3l7.8 8.2zm0 0l-7.8 8.2c.3 0 .6-.1.9-.3l9.4-5.4-2.5-2.5zm3.4-1.9l-2.4-1.4-2.7 2.9v.8l2.7 2.9 2.4-1.4c.9-.5.9-1.9 0-2.8z" />
                        </svg>
                      </ProjectLinkIcon>
                    )}
                  </div>
                )}
              </div>

              <p className="px-3 text-[13.5px] leading-[1.85] text-fg-dim m-0">
                {t(p.descKey)}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10.5px] px-2.5 py-1 rounded-xl bg-accent/9 text-fg-dim"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14">
          <Reveal
            as="div"
            className="text-[12px] tracking-[.25em] uppercase text-fg-dim mb-6"
          >
            {t("tlTitle")}
          </Reveal>
          {TIMELINE.map((item, i) => (
            <Reveal
              as="div"
              className="grid grid-cols-[150px_1px_1fr] gap-x-6.5 pb-7.5 relative last:pb-0 max-[640px]:grid-cols-[26px_1px_1fr]"
              key={i}
            >
              <div className="text-[12px] text-fg-dim pt-0.5 text-right max-[640px]:hidden">
                {item.date}
                <br />
                <span style={{ opacity: 0.6 }}>{t(item.locKey)}</span>
              </div>
              <div className="relative bg-card-border/60 max-[640px]:col-start-2 before:content-[''] before:absolute before:top-1 before:left-[-3.5px] before:w-2 before:h-2 before:rounded-full before:bg-accent" />
              <div className="max-[640px]:col-start-3">
                <h4 className="m-0 mb-1 text-[15px] text-ink font-semibold">
                  {item.companyKey ? t(item.companyKey) : item.company}
                </h4>
                <span className="text-[12.5px] text-accent mb-2 block">
                  {t(item.roleKey)}
                </span>
                <p className="text-[13px] text-fg-dim leading-[1.8] m-0">
                  {t(item.expKey)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3.5 max-[640px]:grid-cols-1">
          {EDUCATION.map((e, i) => (
            <Reveal
              as="div"
              className="flex justify-between gap-3.5 px-4.5 py-3.5 border border-card-border/50 rounded-[14px] bg-card-bg/40 text-[12.5px]"
              key={i}
            >
              <span className="text-accent font-semibold whitespace-nowrap">
                {e.year}
              </span>
              <span className="text-fg-dim text-right">
                <b className="text-fg block font-semibold mb-0.5">
                  {e.schoolKey ? t(e.schoolKey) : e.school}
                </b>
                <span>{t(e.descKey)}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
