import React, { useEffect } from 'react';
import { Impressum } from '../components/Impressum';
import { Footer } from '../components/Footer';

export const ImpressumPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <Impressum />
      </div>
      <Footer />
    </>
  );
};
