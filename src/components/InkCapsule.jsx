import React, { useState } from "react";
import { useLang } from "../contexts.jsx";

const SWATCHES = [
  // { idx: 0, color: "#6E75A4", title: "藤鼠 Fujinezumi" },
  // { idx: 1, color: "#51A8DD", title: "群青 Gunjyo" },
  // { idx: 2, color: "#FEDFE1", title: "櫻 Sakura" },
  // { idx: 3, color: "#FAD689", title: "淺黃 Usaki" },
  // { idx: 3, color: "#66BAB7", title: "水淺蔥 Mizuasagi" },
  { idx: 0, color: "#1a1a1a", title: "墨 Sumi Black" },
  { idx: 1, color: "#1e3a5f", title: "藍 Indigo" },
  { idx: 2, color: "#b03a2e", title: "朱 Vermilion" },
  { idx: 3, color: "#3c5a45", title: "松 Pine Green" },
];

export default function InkCapsule({ fluidRef }) {
  const { t } = useLang();
  const [activeColor, setActiveColor] = useState(0);
  const [cycle, setCycle] = useState(false);
  const [auto, setAuto] = useState(false);

  function pickColor(idx) {
    setActiveColor(idx);
    setCycle(false);
    fluidRef.current?.setColor(idx);
    fluidRef.current?.setCycle(false);
  }
  function toggleCycle() {
    const next = !cycle;
    setCycle(next);
    fluidRef.current?.setCycle(next);
  }
  function toggleAuto() {
    const next = !auto;
    setAuto(next);
    fluidRef.current?.setAuto(next);
  }
  function wash() {
    fluidRef.current?.washAway();
  }

  const divider =
    "w-px h-[22px] bg-capsule-border/60 mx-1 shrink-0 max-[520px]:mx-0.5";
  const cbtn =
    "flex items-center justify-center gap-1.5 h-[38px] max-[520px]:h-[34px] px-3.5 max-[520px]:px-[9px] rounded-full border-none cursor-pointer bg-transparent text-fg [font-family:inherit] text-[12px] tracking-[.03em] transition-colors duration-[250ms] whitespace-nowrap shrink-0 hover:bg-accent/[.12] [&_svg]:w-[15px] [&_svg]:h-[15px] [&_.lbl]:hidden min-[600px]:[&_.lbl]:inline";

  return (
    <div
      className="fixed left-1/2 bottom-[22px] max-[520px]:bottom-[14px] -translate-x-1/2 z-30 flex items-center gap-1.5 max-[520px]:gap-[3px] bg-capsule-bg/72 [backdrop-filter:blur(14px)_saturate(1.3)] border border-capsule-border/55 rounded-full px-2.5 max-[520px]:px-2 py-2 max-[520px]:py-[7px] shadow-[0_12px_34px_color-mix(in_srgb,var(--shadow)_18%,transparent)] max-w-[94vw]"
      role="toolbar"
      aria-label="Ink controls"
    >
      <div className="flex gap-[7px] px-0.5">
        {SWATCHES.map((sw) => (
          <button
            key={sw.idx}
            className={`w-[26px] h-[26px] max-[520px]:w-[23px] max-[520px]:h-[23px] rounded-full border-2 cursor-pointer relative transition-transform duration-[250ms] shrink-0 active:scale-[.92] ${
              activeColor === sw.idx && !cycle
                ? "border-fg scale-[1.14]"
                : "border-transparent"
            }`}
            style={{ background: sw.color }}
            title={sw.title}
            aria-label={sw.title}
            onClick={() => pickColor(sw.idx)}
          />
        ))}
      </div>
      <div className={divider} />
      {/* <button
        className={`${cbtn} ${cycle ? "bg-accent/[.18] text-accent" : ""}`}
        title="顏色輪替"
        onClick={toggleCycle}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" />
        </svg>
        <span className="lbl">{t("cycleLbl")}</span>
      </button> */}
      {/* <button
        className={`${cbtn} ${auto ? "bg-accent/[.18] text-accent" : ""}`}
        title="自動演出"
        onClick={toggleAuto}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
        <span className="lbl">{t("autoLbl")}</span>
      </button> */}
      <div className={divider} />
      <button
        className={`${cbtn} text-fg-dim hover:text-accent`}
        title="洗い流す"
        onClick={wash}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <path d="M7 2c-1 3-3 5-3 8a5 5 0 0 0 10 0c0-1.5-.6-2.6-1.3-3.7M12 22c4 0 7-2 7-6 0-3-2-5-3.5-7" />
        </svg>
        <span className="lbl">洗い流す</span>
      </button>
    </div>
  );
}
