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

  return (
    <div className="topbar">
      <a href="#hero" className="brand">結 YURU HUANG</a>
      <div className="top-controls">
        <div className="lang-menu" ref={menuRef}>
          <button className="icon-btn" aria-label="Language" onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" /></svg>
          </button>
          <div className={`lang-dropdown${open ? ' open' : ''}`}>
            {['zh', 'en', 'de'].map(l => (
              <button
                key={l}
                className={lang === l ? 'active' : ''}
                onClick={(e) => { e.stopPropagation(); setLang(l); setOpen(false); }}
              >
                {l === 'zh' ? '中文' : l === 'en' ? 'English' : 'Deutsch'}
              </button>
            ))}
          </div>
        </div>
        <button className="icon-btn" aria-label="Toggle dark mode" onClick={toggleDark}>
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
