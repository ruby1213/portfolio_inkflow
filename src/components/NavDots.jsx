import React, { useEffect, useState } from 'react';

const TARGETS = ['hero', 'about', 'projects', 'contact'];

export default function NavDots() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    function update() {
      const markerY = window.innerHeight * 0.4;
      let current = TARGETS[0];
      for (const id of TARGETS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= markerY) current = id; else break;
      }
      setActive(current);
    }
    let raf = null;
    const onScroll = () => { if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="fixed right-[26px] top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4 max-[720px]:hidden">
      {TARGETS.map(id => (
        <button
          key={id}
          className={`w-[9px] h-[9px] rounded-full border p-0 cursor-pointer transition-all duration-300 ${
            active === id
              ? 'bg-accent border-accent scale-[1.3]'
              : 'bg-transparent border-[color-mix(in_srgb,var(--fg)_40%,transparent)]'
          }`}
          aria-label={id}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
        />
      ))}
    </div>
  );
}
