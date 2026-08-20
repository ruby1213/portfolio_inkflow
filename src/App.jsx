import React, { useRef } from 'react';
import PaperCanvas from './components/PaperCanvas.jsx';
import FluidCanvas from './components/FluidCanvas.jsx';
import TopBar from './components/TopBar.jsx';
import NavDots from './components/NavDots.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import InkCapsule from './components/InkCapsule.jsx';

export default function App() {
  const fluidRef = useRef(null);

  return (
    <>
      <PaperCanvas />
      <FluidCanvas ref={fluidRef} />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <TopBar />
      <NavDots />

      <div className="wrap">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </div>

      <InkCapsule fluidRef={fluidRef} />
    </>
  );
}
