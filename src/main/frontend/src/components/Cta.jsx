import React from 'react';
import { useFadeUp } from '../hooks/useFadeUp';

export const Cta = ({ theme }) => {
  const { ref, isVisible } = useFadeUp();

  return (
    <section className={`cta cta-${theme}`} ref={ref}>
      <div className={`section-container ${isVisible ? 'visible' : ''}`}>
        <div className="cta-content">
          <h2>Bereit für den nächsten Schritt?</h2>
          <p>Vereinbaren Sie ein kostenloses, unverbindliches Erstgespräch.</p>
          <button className="btn btn-cta">
            Kostenloses Erstgespräch buchen
          </button>
        </div>
      </div>
    </section>
  );
};
