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
    <div className="nav-dots">
      {TARGETS.map(id => (
        <button
          key={id}
          className={active === id ? 'active' : ''}
          aria-label={id}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
        />
      ))}
    </div>
  );
}
