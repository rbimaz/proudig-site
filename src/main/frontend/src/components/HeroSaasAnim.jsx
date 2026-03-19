import React, { useState, useEffect } from 'react';

const images = [
  '/anima-prou1.jpg',
  '/anima-prou2.jpg',
  '/anima-prou3.jpg'
];

export const HeroSaasAnim = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-saas-anim">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`ProuDig Animation ${i + 1}`}
          className={`hero-saas-anim-img ${i === current ? 'active' : ''}`}
        />
      ))}
    </div>
  );
};
