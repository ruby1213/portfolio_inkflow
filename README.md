# Yuru Huang — Portfolio (React)

A suminagashi (墨流し)-inspired interactive ink portfolio, built with React + Vite.
Ported from a single-file HTML/WebGL prototype into a componentized React app.

## Stack

- React 18 + Vite
- A real-time WebGL fluid simulation (stable-fluids: advection, divergence,
  pressure Jacobi solve, vorticity confinement) drives the ink effect —
  encapsulated in the `useFluidSim` hook (`src/useFluidSim.js`) and wrapped by
  `<FluidCanvas />`.
- i18n (zh / en / de) and dark mode via React Context (`src/contexts.jsx`).

## Getting started

```bash
npm install
npm run dev       # start dev server
npm run build      # production build into dist/
npm run preview    # preview the production build
```

## Project structure

```
src/
  App.jsx                 assembles the page
  contexts.jsx             ThemeProvider (dark mode) + LangProvider (i18n)
  i18n.js                  translation dictionary (zh/en/de)
  useFluidSim.js            WebGL fluid simulation hook
  styles.css                global styles (CSS custom properties for theming)
  components/
    PaperCanvas.jsx         procedural washi-paper background (canvas 2D)
    FluidCanvas.jsx          WebGL ink canvas, exposes an imperative controller
    InkCapsule.jsx            bottom control capsule (colors, cycle, auto, wash)
    TopBar.jsx                 language switcher + dark-mode toggle
    NavDots.jsx                 scroll-spy navigation dots
    Reveal.jsx                   scroll-reveal wrapper (IntersectionObserver)
    Hero.jsx / About.jsx / Projects.jsx / Contact.jsx   page sections
```

## Notes

- `useFluidSim` sets up its own WebGL context, render loop and pointer
  listeners inside a `useEffect` with an empty dependency array, and tears
  everything down on unmount. Theme-dependent ink colors are read through a
  mutable ref (`darkRef`) so toggling dark mode doesn't reinitialize the GL
  context.
- `StrictMode` is intentionally left out of `main.jsx` — its dev-only double
  effect invocation would spin up the WebGL simulation twice in a row.
# portfolio_inkflow
