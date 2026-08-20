import React, { useEffect, useRef, useState } from 'react';

export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { setInView(true); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const base = 'transition-[opacity,transform] duration-[900ms] ease';
  const state = inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]';

  return (
    <Tag ref={ref} className={`${base} ${state}${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </Tag>
  );
}
