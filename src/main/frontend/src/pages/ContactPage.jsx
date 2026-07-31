import React, { useEffect } from 'react';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

// Eigenständige Kontaktseite unter /kontakt. Nutzt die globale Navbar aus
// App.jsx und rendert das bestehende Contact-Formular als vollwertige Seite.
export const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Contact />
      <Footer />
    </>
  );
};
