import React from 'react';

/**
 * Variante A — Vertikaler Prozessfluss
 *
 */
export const HeroProcessFlow = () => (
  <div className="va-flow">
    <svg className="va-lines" viewBox="0 0 280 360">
      <path className="va-line" d="M95 30 C155 45,175 65,195 85" />
      <path className="va-line" d="M175 110 C135 130,75 145,85 170" />
      <path className="va-line" d="M115 195 C155 210,195 225,185 250" />
      <path className="va-line" d="M165 270 C135 290,105 305,115 325" />
    </svg>
    <div className="va-node va-n1">
      <div className="va-step">1</div>
      <div className="va-icon ic-a"><i className="bi bi-search"></i></div>
      <div><div className="va-label">Analyse</div><div className="va-sub">Prozesse verstehen</div></div>
    </div>
    <div className="va-node va-n2">
      <div className="va-step">2</div>
      <div className="va-icon ic-b"><i className="bi bi-chat-dots"></i></div>
      <div><div className="va-label">Strategie</div><div className="va-sub">Konzept entwickeln</div></div>
    </div>
    <div className="va-node va-n3">
      <div className="va-step">3</div>
      <div className="va-icon ic-c"><i className="bi bi-code-slash"></i></div>
      <div><div className="va-label">Entwicklung</div><div className="va-sub">Lösung bauen</div></div>
    </div>
    <div className="va-node va-n4">
      <div className="va-step">4</div>
      <div className="va-icon ic-d"><i className="bi bi-shield-check"></i></div>
      <div><div className="va-label">Qualität</div><div className="va-sub">Testen &amp; sichern</div></div>
    </div>
    <div className="va-node va-n5">
      <div className="va-step">5</div>
      <div className="va-icon ic-e"><i className="bi bi-rocket-takeoff"></i></div>
      <div><div className="va-label">Go-Live</div><div className="va-sub">Wirkung entfalten</div></div>
    </div>
  </div>
);
