import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from './Icons';
import { useScrolled } from '../hooks/useScrolled';

export const Navbar = ({ theme }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrolled();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const goToImpressum = () => {
    navigate('/impressum');
    setMobileOpen(false);
  };

  const goToBlog = () => {
    navigate('/blog');
    setMobileOpen(false);
  };

  const goToSeminare = () => {
    navigate('/seminare');
    setMobileOpen(false);
  };

  const hasDarkHero = theme === 'dark' || theme === 'blue' || theme === 'aoe2dash' || theme === 'udig2';
  const isHome = location.pathname === '/';
  const atTop = hasDarkHero && !scrolled && isHome;

  return (
    <>
      <nav className={`nav ${atTop ? 'nav-at-top' : ''} ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="container nav-inner">
          <a className="logo" href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <span className="logo-text">Prou<span>Dig</span></span>
            <span className="logo-dot">.</span>
          </a>
          <ul className="nav-links">
            <li><button className="nav-link" onClick={() => scrollTo('leistungen')}>Leistungen</button></li>
            <li><button className="nav-link" onClick={() => scrollTo('ueber')}>Über Proudig</button></li>
            <li><button className="nav-link" onClick={goToBlog}>Blog</button></li>
            <li><button className="nav-link" onClick={goToSeminare}>Seminare</button></li>
            <li><button className="nav-link" onClick={goToImpressum}>Impressum</button></li>
            <li><button className="nav-link" onClick={() => scrollTo('prozess')}>Prozess</button></li>
          </ul>
          <button className="nav-cta" onClick={() => scrollTo('kontakt')}>Beratungsgespräch</button>
          <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X width={28} height={28} /> : <Menu width={28} height={28} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-menu open">
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>
            <X width={32} height={32} />
          </button>
          <button className="mobile-link" onClick={() => scrollTo('leistungen')}>Leistungen</button>
          <button className="mobile-link" onClick={() => scrollTo('ueber')}>Über Proudig</button>
          <button className="mobile-link" onClick={goToBlog}>Blog</button>
          <button className="mobile-link" onClick={goToSeminare}>Seminare</button>
          <button className="mobile-link" onClick={goToImpressum}>Impressum</button>
          <button className="mobile-link" onClick={() => scrollTo('prozess')}>Prozess</button>
          <button className="mobile-link" onClick={() => scrollTo('kontakt')}>Kontakt</button>
        </div>
      )}
    </>
  );
};
