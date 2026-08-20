import React from "react";
import { useLang } from "../contexts.jsx";
import Reveal from "./Reveal.jsx";
import { useScrollReveal } from "../hooks/useScrollReveal.js";

const STRENGTHS = [1, 2, 3, 4, 5, 6];
const SKILLS = [
  "TypeScript",
  "JavaScript",
  "Dart",
  "Python",
  "React",
  "Next.js",
  "Flutter",
  "Django",
  "HTML5 / CSS",
];

export default function About() {
  const { t } = useLang();
  const [sectionRef, inView] = useScrollReveal();
  return (
    <section
      id="about"
      ref={sectionRef}
      className={`min-h-screen w-full flex flex-col items-center justify-center px-[6vw] pt-[8vh] pb-[12vh] relative transition-[opacity,transform] duration-1100 ease-out ${
        inView ? "opacity-100 scale-100" : "opacity-0 scale-[.97]"
      }`}
    >
      <div className="max-w-230 w-full mx-auto">
        <Reveal
          as="span"
          className="text-[11px] tracking-[.4em] uppercase text-accent mb-3.5 block"
        >
          {t("aboutEyebrow")}
        </Reveal>
        <Reveal
          as="h2"
          className="font-mincho font-semibold text-[clamp(28px,5vw,46px)] m-0 mb-10 text-ink tracking-[.02em]"
        >
          {t("aboutTitle")}
        </Reveal>
        <div className="grid grid-cols-[1.3fr_1fr] gap-14 items-start max-[820px]:grid-cols-1">
          <Reveal>
            <p className="text-[clamp(15px,2vw,18px)] leading-loose text-fg font-normal">
              {t("aboutLead")}
            </p>
            <ul className="list-none m-0 mt-8.5 p-0 grid grid-cols-2 gap-y-3.5 gap-x-5">
              {STRENGTHS.map((n) => (
                <li
                  key={n}
                  className="text-[13.5px] leading-[1.7] text-fg-dim pl-4 relative"
                >
                  <b className="text-accent font-semibold">{t(`s${n}t`)}</b>{" "}
                  {t(`s${n}d`)}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <div className="bg-card-bg/55 border border-card-border/50 rounded-[18px] px-6.5 py-6.5 backdrop-blur-xs">
              <h4 className="m-0 mb-3.5 text-[12px] tracking-[.2em] uppercase text-fg-dim">
                {t("skillsTitle")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((s) => (
                  <span
                    key={s}
                    className="text-[12px] px-3.25 py-1.5 rounded-full border border-accent/35 text-fg bg-accent/6"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-card-bg/55 border border-card-border/50 rounded-[18px] px-6.5 py-6.5 backdrop-blur-xs mt-5">
              <h4 className="m-0 mb-3.5 text-[12px] tracking-[.2em] uppercase text-fg-dim">
                {t("langTitle")}
              </h4>
              <div className="[&>div]:flex [&>div]:justify-between [&>div]:text-[13px] [&>div]:py-1.75 [&>div]:border-b [&>div]:border-dashed [&>div]:border-card-border/60 [&>div]:text-fg-dim [&>div:last-child]:border-b-0">
                <div>
                  <span>{t("lang1")}</span>
                  <span className="text-fg font-medium">{t("lang1v")}</span>
                </div>
                <div>
                  <span>{t("lang2")}</span>
                  <span className="text-fg font-medium">{t("lang2v")}</span>
                </div>
                <div>
                  <span>{t("lang3")}</span>
                  <span className="text-fg font-medium">{t("lang3v")}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
