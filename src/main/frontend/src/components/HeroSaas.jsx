import React from 'react';

export const HeroSaas = () => {
  return (
    <div className="hero-saas-visual">
      {/* Dashboard mockup */}
      <div className="saas-dashboard">
        <div className="saas-dash-bar">
          <span className="saas-dot saas-dot-red" />
          <span className="saas-dot saas-dot-yellow" />
          <span className="saas-dot saas-dot-green" />
        </div>
        <div className="saas-dash-body">
          {/* Accent card */}
          <div className="saas-card-accent">
            <div className="saas-card-label">Projekt-Status</div>
            <div className="saas-card-value">847 Aktiv</div>
            <div className="saas-card-sub">
              <span>12 In Bearbeitung</span>
              <span>3 Kritisch</span>
            </div>
          </div>
          {/* Mini cards */}
          <div className="saas-mini-row">
            <div className="saas-mini">
              <svg className="saas-mini-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="saas-mini-val">24</div>
              <div className="saas-mini-label">Offene Aufträge</div>
            </div>
            <div className="saas-mini">
              <svg className="saas-mini-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div className="saas-mini-val">8</div>
              <div className="saas-mini-label">Reviews heute</div>
            </div>
          </div>
          {/* Log entries */}
          <ul className="saas-log">
            <li><span className="saas-log-dot saas-log-green" /> Deployment v3.2 abgeschlossen</li>
            <li><span className="saas-log-dot saas-log-orange" /> KI-Modell Training gestartet</li>
            <li><span className="saas-log-dot saas-log-blue" /> API-Integration geprüft</li>
          </ul>
        </div>
      </div>
      {/* Phone overlay */}
      <div className="saas-phone">
        <div className="saas-phone-screen">
          <div className="saas-phone-btn saas-phone-btn-accent">Dashboard</div>
          <div className="saas-phone-btn saas-phone-btn-dark">Projekte</div>
          <div className="saas-phone-btn saas-phone-btn-dark">Analytics</div>
          <div className="saas-phone-btn saas-phone-btn-green">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
            Alles OK
          </div>
        </div>
      </div>
    </div>
  );
};
