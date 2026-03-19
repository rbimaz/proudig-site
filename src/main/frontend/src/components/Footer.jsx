import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>ProuDig.</h3>
            <p>Digitale Transformation von Professoren für Unternehmen.</p>
          </div>

          <div className="footer-links">
            <ul>
              <li>
                <Link to="/impressum">Impressum</Link>
              </li>
              <li>
                <a href="#datenschutz">Datenschutz</a>
              </li>
              <li>
                <a href="#agb">AGB</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>&copy; 2026 ProuDig GmbH. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};
