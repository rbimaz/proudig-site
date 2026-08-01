import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>ProuDig.</h3>
            <p>Prozesse und Digitalisierung</p>
          </div>

          <div className="footer-links">
            <ul>

              <li>
                <Link to="/news">News</Link>
              </li>

              <li>
                <Link to="/blog">Blog</Link>
              </li>

              <li>
                <a href="/datenschutz">Datenschutz</a>
              </li>

              <li>
                <Link to="/impressum">Impressum</Link>
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
