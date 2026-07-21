import React from 'react';
import { Hero } from '../components/Hero';
import { Expertise } from '../components/Expertise';
import { About } from '../components/About';
import { Quality } from '../components/Quality';
import { Process } from '../components/Process';
import { News } from '../components/News';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export const HomePage = ({ theme }) => {
  return (
    <>
      <Hero theme={theme} />
      <Expertise />
      <About />
      <Quality />
      <Process />
      <News />
      <Contact />
      <Footer />
    </>
  );
};
