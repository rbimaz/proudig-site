import React from 'react';

/**
 * Variante D — Netzwerk mit zentralem Hub
 * Exakt aus hero-varianten-vergleich.html
 */
export const HeroNetworkHub = () => (
  <div className="vd-network">
    <svg className="vd-svg" viewBox="0 0 300 340">
      {/* Background edges (all to center 150,170) */}
      <line className="vd-edge" x1="70" y1="45" x2="150" y2="170" />
      <line className="vd-edge" x1="230" y1="45" x2="150" y2="170" />
      <line className="vd-edge" x1="60" y1="265" x2="150" y2="170" />
      <line className="vd-edge" x1="240" y1="265" x2="150" y2="170" />
      {/* Active edges (sequential) */}
      <line className="vd-edge-active" x1="70" y1="45" x2="230" y2="45" />
      <line className="vd-edge-active" x1="230" y1="45" x2="150" y2="170" />
      <line className="vd-edge-active" x1="150" y1="170" x2="60" y2="265" />
      <line className="vd-edge-active" x1="60" y1="265" x2="240" y2="265" />
    </svg>
    {/* Hub */}
    <div className="vd-hub" style={{ top: 170, left: 150 }}>
      <i className="bi bi-gear-wide-connected"></i>
    </div>
    <div className="vd-hub-pulse" style={{ top: 170, left: 150 }}></div>
    {/* Nodes */}
    <div className="vd-node vd-n1">
      <div className="vd-pill">
        <div className="vd-ic ic-a"><i className="bi bi-search"></i></div>
        <div><div className="vd-name">Analyse</div><div className="vd-detail">Prozesse erfassen</div></div>
      </div>
    </div>
    <div className="vd-node vd-n2">
      <div className="vd-pill">
        <div className="vd-ic ic-b"><i className="bi bi-chat-dots"></i></div>
        <div><div className="vd-name">Strategie</div><div className="vd-detail">Konzept planen</div></div>
      </div>
    </div>
    <div className="vd-node vd-n4">
      <div className="vd-pill">
        <div className="vd-ic ic-d"><i className="bi bi-shield-check"></i></div>
        <div><div className="vd-name">Qualität</div><div className="vd-detail">Absichern</div></div>
      </div>
    </div>
    <div className="vd-node vd-n5">
      <div className="vd-pill">
        <div className="vd-ic ic-e"><i className="bi bi-rocket-takeoff"></i></div>
        <div><div className="vd-name">Go-Live</div><div className="vd-detail">Wirken</div></div>
      </div>
    </div>
  </div>
);
