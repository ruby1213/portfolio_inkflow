import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts.jsx';

// Kept in sync with the --paper / --paper-deep / --line custom properties in
// styles.css. Using explicit tokens here (rather than getComputedStyle on
// document.documentElement) avoids a React effect-ordering race: this
// component's effect can otherwise run before ThemeProvider's effect has
// toggled the `dark` class onto <html>, reading stale (light-mode) values.
const TOKENS = {
  light: { paper: '#efe9dc', paperDeep: '#e3dac9', line: '#847362' },
  dark: { paper: '#12151c', paperDeep: '#0c0e13', line: '#9d927b' },
};

function hexAlpha(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

export default function PaperCanvas() {
  const canvasRef = useRef(null);
  const { dark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const tokens = dark ? TOKENS.dark : TOKENS.light;

    function drawPaper() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth, h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const base = tokens.paper;
      const deep = tokens.paperDeep;
      const lineC = tokens.line;

      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, hexAlpha(base, 1));
      grad.addColorStop(1, hexAlpha(deep, 1));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const fiberCount = Math.floor((w * h) / 9000);
      for (let i = 0; i < fiberCount; i++) {
        const x = Math.random() * w, y = Math.random() * h;
        const len = 6 + Math.random() * 26;
        const ang = Math.random() * Math.PI;
        const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
        ctx.strokeStyle = hexAlpha(lineC, 0.035 + Math.random() * 0.045);
        ctx.lineWidth = 0.4 + Math.random() * 0.8;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
      }

      const blotch = Math.floor((w * h) / 60000);
      for (let i = 0; i < blotch; i++) {
        const x = Math.random() * w, y = Math.random() * h;
        const r = 30 + Math.random() * 90;
        const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
        rg.addColorStop(0, hexAlpha(lineC, 0.025));
        rg.addColorStop(1, hexAlpha(lineC, 0));
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }

      const grainCanvas = document.createElement('canvas');
      grainCanvas.width = 180; grainCanvas.height = 180;
      const gctx = grainCanvas.getContext('2d');
      const idata = gctx.createImageData(180, 180);
      for (let i = 0; i < idata.data.length; i += 4) {
        const v = 255 * (0.4 + Math.random() * 0.2);
        idata.data[i] = v; idata.data[i + 1] = v; idata.data[i + 2] = v; idata.data[i + 3] = Math.random() * 14;
      }
      gctx.putImageData(idata, 0, 0);
      const pattern = ctx.createPattern(grainCanvas, 'repeat');
      ctx.fillStyle = pattern;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    drawPaper();
    const debounced = debounce(drawPaper, 200);
    window.addEventListener('resize', debounced);
    return () => window.removeEventListener('resize', debounced);
  }, [dark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full z-0 pointer-events-none [transition:var(--transition-theme)]"
    />
  );
}
