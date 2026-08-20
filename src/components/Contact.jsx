import React from "react";
import { useLang } from "../contexts.jsx";
import Reveal from "./Reveal.jsx";
import { useScrollReveal } from "../hooks/useScrollReveal.js";

export default function Contact() {
  const { t } = useLang();
  const [sectionRef, inView] = useScrollReveal();
  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`min-h-screen w-full flex flex-col items-center justify-center px-[6vw] pt-[8vh] pb-[12vh] relative transition-[opacity,transform] duration-1100 ease-out ${
        inView ? "opacity-100 scale-100" : "opacity-0 scale-[.97]"
      }`}
    >
      <div className="max-w-230ull mx-auto text-center">
        <Reveal
          as="span"
          className="text-[11px] tracking-[.4em] uppercase text-accent mb-3.5 block"
        >
          {t("contactEyebrow")}
        </Reveal>
        <Reveal
          as="h2"
          className="font-mincho font-semibold text-[clamp(28px,5vw,46px)] m-0 mb-10 text-ink tracking-[.02em]"
        >
          {t("contactTitle")}
        </Reveal>
        <Reveal
          as="p"
          className="text-fg-dim text-[14px] max-w-120auto leading-[1.9]"
        >
          {t("contactLead")}
        </Reveal>

        <Reveal className="flex flex-wrap gap-3.5 justify-center mt-9.5_a]:flex [&_a]:items-center [&_a]:gap-2.5 [&_a]:px-5.5 [&_a]:py-3.5 [&_a]:rounded-full [&_a]:border [&_a]:border-card-border/60 [&_a]:bg-card-bg/55 [&_a]:text-fg [&_a]:no-underline [&_a]:text-[13.5px] [&_a]:transition-[border-color,background-color,transform] [&_a]:duration-350 [&_a]:backdrop-blur-xs [&_a:hover]:border-accent/60 [&_a:hover]:bg-accent/10 [&_a:hover]:-translate-y-0.75 [&_svg]:w-4 [&_svg]:h-4">
          <a href="mailto:ruby_huang@gmx.ch">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            ruby_huang@gmx.ch
          </a>
          <a href="tel:+41772774227">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.8 2Z" />
            </svg>
            +41 77 277 42 27
          </a>
          <a
            href="https://www.linkedin.com/in/yuru-huang-tw"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
              <path d="M10 9v12M10 13a4 4 0 0 1 8 0v8" />
            </svg>
            LinkedIn
          </a>
          <a href="#contact" style={{ pointerEvents: "none" }}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M12 21s-7-6.2-9.3-10A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 9.3 6C19 14.8 12 21 12 21Z" />
            </svg>
            <span>{t("location")}</span>
          </a>
        </Reveal>

        <Reveal
          as="p"
          className="mt-11 text-[13px] text-fg-dim max-w-115 mx-auto leading-[1.9]"
        >
          {t("contactNote")}
        </Reveal>
        <Reveal className="mt-17.5 text-[11px] tracking-[.15em] text-fg-dim opacity-70">
          © 2026 YURU HUANG — <span>{t("footerNote")}</span>
        </Reveal>
      </div>
    </section>
  );
}
