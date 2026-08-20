import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useFluidSim } from '../useFluidSim.js';
import { useTheme } from '../contexts.jsx';

const FluidCanvas = forwardRef(function FluidCanvas(_props, ref) {
  const canvasRef = useRef(null);
  const { dark } = useTheme();
  const darkRef = useRef(dark);

  useEffect(() => { darkRef.current = dark; }, [dark]);

  const controllerRef = useFluidSim(canvasRef, darkRef);

  useImperativeHandle(ref, () => ({
    setColor: (idx) => controllerRef.current.setColor(idx),
    setCycle: (on) => controllerRef.current.setCycle(on),
    setAuto: (on) => controllerRef.current.setAuto(on),
    washAway: () => controllerRef.current.washAway(),
  }), [controllerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full z-[1] touch-none"
      style={dark ? { mixBlendMode: 'screen', opacity: 0.9 } : { mixBlendMode: 'multiply' }}
    />
  );
});

export default FluidCanvas;
