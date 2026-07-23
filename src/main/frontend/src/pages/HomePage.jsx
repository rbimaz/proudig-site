import React from 'react';
import { Hero } from '../components/Hero';
import { Expertise } from '../components/Expertise';
import { About } from '../components/About';
import { Quality } from '../components/Quality';
import { Process } from '../components/Process';
import { News } from '../components/News';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { useContent } from '../contexts/ContentContext';

export const HomePage = ({ theme }) => {
  const { blocks } = useContent();
  // In der neuen Landing erscheinen News im Hero -> Homepage-News-Sektion nur in der alten Landing
  const newLanding = blocks.HERO?.newLanding !== false;

  return (
    <>
      <Hero theme={theme} />
      <Expertise />
      <About />
      <Quality />
      <Process />
      {!newLanding && <News />}
      <Contact />
      <Footer />
    </>
  );
};
