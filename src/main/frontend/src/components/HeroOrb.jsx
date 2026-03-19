import React from 'react';
import { Brain, Smartphone, Globe, Cpu } from './Icons';

export const HeroOrb = ({ theme }) => {
  const chipClass =
    theme === 'blue' ? 'hero-chip-blue' :
    theme === 'dark' ? 'hero-chip-dark' : 'hero-chip-light';

  const coreClass =
    theme === 'blue' ? 'hero-orb-core-blue' :
    theme === 'dark' ? 'hero-orb-core-dark' : 'hero-orb-core-light';

  return (
    <div className="hero-orb-wrap">
      <div className="hero-orb-ring"></div>
      <div className="hero-orb-glow"></div>
      <div className={`hero-orb-core ${coreClass}`}>
        <Cpu width={40} height={40} />
      </div>
      <div className="hero-chips-track">
        <div className={`hero-chip ${chipClass}`} style={{ top: 0, left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className="hero-chip-icon"><Brain width={18} height={18} /></div>
          <div className="hero-chip-text">
            <span className="hero-chip-title">KI-Systeme</span>
            <span className="hero-chip-sub">Machine Learning</span>
          </div>
        </div>
        <div className={`hero-chip ${chipClass}`} style={{ bottom: '12%', right: 0, transform: 'translate(50%, 0)' }}>
          <div className="hero-chip-icon"><Smartphone width={18} height={18} /></div>
          <div className="hero-chip-text">
            <span className="hero-chip-title">Mobile Apps</span>
            <span className="hero-chip-sub">iOS &amp; Android</span>
          </div>
        </div>
        <div className={`hero-chip ${chipClass}`} style={{ bottom: '12%', left: 0, transform: 'translate(-50%, 0)' }}>
          <div className="hero-chip-icon"><Globe width={18} height={18} /></div>
          <div className="hero-chip-text">
            <span className="hero-chip-title">Web-Plattformen</span>
            <span className="hero-chip-sub">React &amp; Spring Boot</span>
          </div>
        </div>
      </div>
    </div>
  );
};
