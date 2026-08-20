import React from "react";
import { useLang } from "../contexts.jsx";

export default function Hero() {
  const { t } = useLang();
  return (
    <section
      id="hero"
      className="min-h-screen w-full flex flex-col items-center justify-center px-[6vw] pt-[8vh] pb-[12vh] relative text-center"
    >
      <span className="absolute [writing-mode:vertical-rl] right-[8vw] top-[14vh] text-accent opacity-55 text-[15px] tracking-[.3em] font-mincho max-[720px]:hidden">
        {t("seal")}
      </span>
      <div className="max-w-230 w-full mx-auto">
        <span className="block text-[11px] tracking-[.45em] uppercase text-fg-dim mb-6.5 opacity-0 animate-[fadeUp_1.2s_.2s_forwards]">
          {t("heroMark")}
        </span>
        <h1 className="font-mincho font-bold text-[clamp(48px,11vw,128px)] leading-none tracking-[.01em] m-0 text-ink opacity-0 animate-[fadeUp_1.3s_.4s_forwards]">
          YURU
          <span className="font-normal italic font-garamond block text-[0.42em] mt-1.5 tracking-[.3em] text-fg-dim">
            {t("heroSurname")}
          </span>
        </h1>
        <p className="mt-7 text-[clamp(14px,2vw,18px)] text-fg-dim tracking-[.06em] font-normal opacity-0 animate-[fadeUp_1.3s_.7s_forwards]">
          {t("heroSub")}
        </p>
        {/* <p className="mt-[14px] text-[clamp(13px,1.6vw,15px)] text-fg-dim max-w-[520px] leading-[1.9] mx-auto opacity-0 [animation:fadeUp_1.3s_.95s_forwards]">
          {t("heroTagline")}
        </p> */}
        <div className="mt-15 text-[12px] tracking-[.12em] text-fg-dim opacity-0 flex flex-col items-center gap-2 animate-[fadeUp_1.3s_1.3s_forwards,floaty_3.5s_2.6s_ease-in-out_infinite]">
          <div className="w-px h-8.5 bg-[linear-gradient(var(--fg-dim),transparent)]" />
          <span>{t("heroHint")}</span>
        </div>
      </div>
    </section>
  );
}
