import React from 'react';

export const HeroWave = () => {
  // Generate dot grid for the wave/particle effect
  const dots = [];
  const cols = 40;
  const rows = 20;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = 200 + c * 28;
      const y = 80 + r * 24;
      // Wave displacement
      const wave = Math.sin((c * 0.25) + (r * 0.15)) * 30;
      const dy = y + wave;
      // Color gradient: blue → teal → green → yellow based on position
      const t = (c / cols);
      const opacity = 0.15 + (Math.sin((c * 0.2) + (r * 0.1)) * 0.5 + 0.5) * 0.7;
      const radius = 1.5 + (Math.sin((c * 0.3) + (r * 0.2)) * 0.5 + 0.5) * 2.5;

      let color;
      if (t < 0.3) {
        color = `rgba(0, 150, 255, ${opacity})`;
      } else if (t < 0.5) {
        color = `rgba(0, 200, 220, ${opacity})`;
      } else if (t < 0.7) {
        color = `rgba(20, 210, 180, ${opacity})`;
      } else if (t < 0.85) {
        color = `rgba(100, 220, 80, ${opacity})`;
      } else {
        color = `rgba(200, 230, 40, ${opacity})`;
      }

      dots.push(
        <circle key={`${r}-${c}`} cx={x} cy={dy} r={radius} fill={color} />
      );
    }
  }

  // Add flowing connection lines
  const lines = [];
  for (let r = 0; r < rows - 1; r += 2) {
    const points = [];
    for (let c = 0; c < cols; c++) {
      const x = 200 + c * 28;
      const y = 80 + r * 24;
      const wave = Math.sin((c * 0.25) + (r * 0.15)) * 30;
      points.push(`${x},${y + wave}`);
    }
    const t = r / rows;
    let strokeColor;
    if (t < 0.3) strokeColor = 'rgba(0, 150, 255, 0.08)';
    else if (t < 0.6) strokeColor = 'rgba(0, 200, 200, 0.06)';
    else strokeColor = 'rgba(100, 220, 80, 0.05)';

    lines.push(
      <polyline
        key={`line-${r}`}
        points={points.join(' ')}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
      />
    );
  }

  return (
    <svg
      className="hero-wave-svg"
      viewBox="0 0 1400 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMaxYMid slice"
    >
      {lines}
      {dots}
    </svg>
  );
};
