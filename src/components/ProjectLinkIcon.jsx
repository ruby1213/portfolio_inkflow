import React from "react";

export default function ProjectLinkIcon({
  href,
  ariaLabel,
  className = "",
  children,
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/9 text-fg-dim hover:bg-accent/20 hover:text-accent transition-colors delay-100 hover:-translate-y-1.25 ${className}`}
    >
      {children}
    </a>
  );
}
