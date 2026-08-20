import React, { useEffect, useRef, useState } from 'react';
import { useLang, useTheme } from '../contexts.jsx';

export default function TopBar() {
  const { lang, setLang } = useLang();
  const { dark, toggleDark } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const iconBtn = 'w-[38px] h-[38px] rounded-full bg-capsule-bg/70 backdrop-blur-[6px] border border-capsule-border/60 flex items-center justify-center cursor-pointer text-fg transition-[background-color,transform] duration-300 hover:bg-accent/15 hover:-translate-y-px [&_svg]:w-[17px] [&_svg]:h-[17px]';

  return (
    <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-[5vw] py-[22px] pointer-events-none [&>*]:pointer-events-auto">
      <a href="#hero" className="font-mincho font-semibold tracking-[.08em] text-[15px] text-fg no-underline opacity-85">結 YURU HUANG</a>
      <div className="flex gap-2.5 items-center">
        <div className="relative" ref={menuRef}>
          <button className={iconBtn} aria-label="Language" onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" /></svg>
          </button>
          <div
            className={`absolute top-[46px] right-0 min-w-[120px] bg-capsule-bg/95 backdrop-blur-[10px] border border-capsule-border/60 rounded-[14px] p-1.5 flex-col gap-0.5 shadow-[0_10px_30px_hsla(var(--shadow)/.2)] ${open ? 'flex' : 'hidden'}`}
          >
            {['zh', 'en', 'de'].map(l => (
              <button
                key={l}
                className={`bg-transparent border-none text-left px-3 py-2 rounded-[9px] [font-family:inherit] text-[13px] text-fg cursor-pointer transition-colors duration-200 hover:bg-accent/15 ${lang === l ? 'bg-accent/15' : ''}`}
                onClick={(e) => { e.stopPropagation(); setLang(l); setOpen(false); }}
              >
                {l === 'zh' ? '中文' : l === 'en' ? 'English' : 'Deutsch'}
              </button>
            ))}
          </div>
        </div>
        <button className={iconBtn} aria-label="Toggle dark mode" onClick={toggleDark}>
          {dark ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="4.2" /><path d="M12 2v2.4M12 19.6V22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2 12h2.4M19.6 12H22M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5Z" /></svg>
          )}
        </button>
      </div>
    </div>
  );
}
