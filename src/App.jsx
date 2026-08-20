import React, { useRef } from "react";
import PaperCanvas from "./components/PaperCanvas.jsx";
import FluidCanvas from "./components/FluidCanvas.jsx";
import TopBar from "./components/TopBar.jsx";
import NavDots from "./components/NavDots.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import Contact from "./components/Contact.jsx";
import InkCapsule from "./components/InkCapsule.jsx";

export default function App() {
  const fluidRef = useRef(null);

  return (
    <>
      <PaperCanvas />
      <FluidCanvas ref={fluidRef} />
      <div
        className="grain fixed inset-0 z-2 pointer-events-none opacity-5 mix-blend-overlay"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-2 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_95%,color-mix(in_srgb,var(--shadow)_15%,transparent)_100%)]"
        aria-hidden="true"
      />

      <TopBar />
      <NavDots />

      <div className="relative z-3 pointer-events-none select-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </div>

      <InkCapsule fluidRef={fluidRef} />
    </>
  );
}
