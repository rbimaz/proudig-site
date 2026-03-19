import React from 'react';

export const HeroRings = () => {
  // Concentric rings with dot grid, inspired by UDig homepage
  const rings = [];
  const cx = 300;
  const cy = 250;
  const radii = [60, 110, 160, 210, 260];

  // Draw concentric circle outlines
  radii.forEach((r, i) => {
    rings.push(
      <circle
        key={`ring-${i}`}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.5"
      />
    );
  });

  // Central filled orange circle
  rings.push(
    <circle key="center" cx={cx} cy={cy} r={28} fill="#F7941D" opacity="0.9" />
  );

  // Dot grid scattered around rings
  const dots = [];
  const dotPositions = [
    // Inner ring dots
    { angle: 30, radius: 60, size: 4, color: '#F7941D', opacity: 0.8 },
    { angle: 150, radius: 60, size: 3, color: '#F7941D', opacity: 0.6 },
    { angle: 270, radius: 60, size: 3.5, color: '#F7941D', opacity: 0.7 },
    // Second ring
    { angle: 0, radius: 110, size: 5, color: '#F7941D', opacity: 0.7 },
    { angle: 72, radius: 110, size: 4, color: 'rgba(255,255,255,0.25)', opacity: 1 },
    { angle: 144, radius: 110, size: 3.5, color: '#F7941D', opacity: 0.5 },
    { angle: 216, radius: 110, size: 4.5, color: 'rgba(255,255,255,0.2)', opacity: 1 },
    { angle: 288, radius: 110, size: 3, color: '#F7941D', opacity: 0.6 },
    // Third ring
    { angle: 20, radius: 160, size: 5, color: 'rgba(255,255,255,0.2)', opacity: 1 },
    { angle: 80, radius: 160, size: 4, color: '#F7941D', opacity: 0.6 },
    { angle: 140, radius: 160, size: 3, color: 'rgba(255,255,255,0.15)', opacity: 1 },
    { angle: 200, radius: 160, size: 5.5, color: '#F7941D', opacity: 0.5 },
    { angle: 260, radius: 160, size: 3.5, color: 'rgba(255,255,255,0.2)', opacity: 1 },
    { angle: 320, radius: 160, size: 4, color: '#F7941D', opacity: 0.7 },
    // Fourth ring
    { angle: 45, radius: 210, size: 4, color: '#F7941D', opacity: 0.5 },
    { angle: 105, radius: 210, size: 3.5, color: 'rgba(255,255,255,0.15)', opacity: 1 },
    { angle: 165, radius: 210, size: 5, color: '#F7941D', opacity: 0.4 },
    { angle: 225, radius: 210, size: 3, color: 'rgba(255,255,255,0.2)', opacity: 1 },
    { angle: 285, radius: 210, size: 4.5, color: '#F7941D', opacity: 0.6 },
    { angle: 345, radius: 210, size: 3.5, color: '#F7941D', opacity: 0.5 },
    // Outer ring
    { angle: 15, radius: 260, size: 3, color: 'rgba(255,255,255,0.12)', opacity: 1 },
    { angle: 60, radius: 260, size: 4, color: '#F7941D', opacity: 0.4 },
    { angle: 120, radius: 260, size: 3.5, color: 'rgba(255,255,255,0.15)', opacity: 1 },
    { angle: 180, radius: 260, size: 5, color: '#F7941D', opacity: 0.35 },
    { angle: 240, radius: 260, size: 3, color: 'rgba(255,255,255,0.12)', opacity: 1 },
    { angle: 300, radius: 260, size: 4.5, color: '#F7941D', opacity: 0.5 },
  ];

  dotPositions.forEach((dot, i) => {
    const rad = (dot.angle * Math.PI) / 180;
    const x = cx + Math.cos(rad) * dot.radius;
    const y = cy + Math.sin(rad) * dot.radius;
    dots.push(
      <circle
        key={`dot-${i}`}
        cx={x}
        cy={y}
        r={dot.size}
        fill={dot.color}
        opacity={dot.opacity}
      />
    );
  });

  // Subtle grid of small dots in the background
  const bgDots = [];
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 12; col++) {
      const x = 60 + col * 48;
      const y = 20 + row * 44;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      // Skip dots that overlap with rings
      if (dist < 270 && dist > 30) continue;
      bgDots.push(
        <circle
          key={`bg-${row}-${col}`}
          cx={x}
          cy={y}
          r={1.5}
          fill="rgba(255,255,255,0.06)"
        />
      );
    }
  }

  return (
    <svg
      className="hero-rings-svg"
      viewBox="0 0 600 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {bgDots}
      {rings}
      {dots}
    </svg>
  );
};
