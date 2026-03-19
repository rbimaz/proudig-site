import React, { useEffect, useRef } from 'react';

export const HeroIndustrial = () => {
  const glowRef = useRef(null);

  useEffect(() => {
    // Generate glow dots
    const container = glowRef.current;
    if (!container) return;
    const colors = [
      'rgba(79,70,229,0.6)',
      'rgba(56,189,248,0.5)',
      'rgba(244,114,182,0.4)',
      'rgba(251,191,36,0.4)'
    ];
    for (let i = 0; i < 30; i++) {
      const dot = document.createElement('div');
      dot.className = 'hero-ind-dot';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.top = Math.random() * 100 + '%';
      dot.style.animationDelay = Math.random() * 3 + 's';
      dot.style.background = colors[Math.floor(Math.random() * colors.length)];
      container.appendChild(dot);
    }
    return () => {
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, []);

  return (
    <div className="hero-ind-visual">
      {/* Grid overlay */}
      <div className="hero-ind-grid" />
      {/* Glow lines + dots */}
      <div className="hero-ind-glow" ref={glowRef}>
        <div className="hero-ind-line hero-ind-line-1" />
        <div className="hero-ind-line hero-ind-line-2" />
        <div className="hero-ind-line hero-ind-line-3" />
        <div className="hero-ind-line hero-ind-line-4" />
        <div className="hero-ind-line hero-ind-line-5" />
        <div className="hero-ind-line hero-ind-line-6" />
        <div className="hero-ind-line hero-ind-line-7" />
        <div className="hero-ind-line hero-ind-line-8" />
      </div>
    </div>
  );
};
