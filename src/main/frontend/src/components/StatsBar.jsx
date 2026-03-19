import React from 'react';
import { useCounter } from '../hooks/useCounter';
import { useFadeUp } from '../hooks/useFadeUp';

export const StatsBar = () => {
  const { ref: ref1, count: count1 } = useCounter(50);
  const { ref: ref2, count: count2 } = useCounter(3);
  const { ref, isVisible } = useFadeUp();

  return (
    <section className="stats-bar" ref={ref}>
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-number" ref={ref1}>
            {count1}+
          </div>
          <div className="stat-label">Erfolgreiche Projekte</div>
        </div>

        <div className="stat-divider"></div>

        <div className="stat-item">
          <div className="stat-number">DSGVO</div>
          <div className="stat-label">Datenschutz by Design</div>
        </div>

        <div className="stat-divider"></div>

        <div className="stat-item">
          <div className="stat-number" ref={ref2}>
            {count2}
          </div>
          <div className="stat-label">Professorale Gesellschafter</div>
        </div>

        <div className="stat-divider"></div>

        <div className="stat-item">
          <div className="stat-number">100%</div>
          <div className="stat-label">Forschungstransfer</div>
        </div>
      </div>
    </section>
  );
};
