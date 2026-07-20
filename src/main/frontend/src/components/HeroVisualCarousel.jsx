import React, { useState, useEffect } from 'react';
import { HeroProcessFlow } from './HeroProcessFlow';

/**
 * Hero-Visual der Landing-Page (Theme udig2).
 *
 * Umschaltung über die Konstante SHOW_CAROUSEL (oder das Prop `carousel`):
 *   false → Einzelmodus: nur das Prozessdiagramm (bisheriges Verhalten)
 *   true  → Carousel: Prozessdiagramm + "Digital Impact"-Kugel als Slides
 */
const SHOW_CAROUSEL = false;

const SLIDE_INTERVAL = 5000;

const slides = [
  { key: 'flow', render: () => <HeroProcessFlow /> },
  {
    key: 'image',
    render: () => (
      <img
        className="hero-visual-img"
        src="/hero-sphere.jpg"
        alt="Abstrakte 3D-Kugel als Sinnbild für digitale Wirkung"
      />
    )
  }
];

const HeroCarousel = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero-visual-carousel">
      <div className="hero-visual-stage">
        {slides.map((slide, i) => (
          <div key={slide.key} className={`hero-visual-panel ${i === active ? 'active' : ''}`}>
            {slide.render()}
          </div>
        ))}
      </div>
      <div className="hero-visual-dots">
        {slides.map((slide, i) => (
          <button
            key={slide.key}
            type="button"
            className={`hero-visual-dot ${i === active ? 'active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1} anzeigen`}
          />
        ))}
      </div>
    </div>
  );
};

export const HeroVisualCarousel = ({ carousel = SHOW_CAROUSEL }) => {
  if (!carousel) {
    return <HeroProcessFlow />;
  }
  return <HeroCarousel />;
};
