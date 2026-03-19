import React from 'react';

export const HeroAI = () => {
  // Neural network visualization with flow-style animations
  // Nodes appear with staggered scale-in, edges draw in, pulses travel along paths

  const nodes = [
    // Input layer (left)
    { id: 0, x: 40,  y: 80,  r: 14, opacity: 0.5,  delay: 0.3 },
    { id: 1, x: 35,  y: 150, r: 12, opacity: 0.4,  delay: 0.5 },
    { id: 2, x: 45,  y: 220, r: 14, opacity: 0.5,  delay: 0.4 },
    { id: 3, x: 38,  y: 290, r: 12, opacity: 0.45, delay: 0.6 },
    { id: 4, x: 42,  y: 360, r: 14, opacity: 0.5,  delay: 0.35 },

    // Hidden layer 1
    { id: 5, x: 130, y: 110, r: 16, opacity: 0.6,  delay: 0.9 },
    { id: 6, x: 125, y: 200, r: 18, opacity: 0.7,  delay: 1.0 },
    { id: 7, x: 135, y: 290, r: 16, opacity: 0.6,  delay: 1.1 },
    { id: 8, x: 128, y: 370, r: 14, opacity: 0.55, delay: 1.2 },

    // Hidden layer 2
    { id: 9,  x: 230, y: 80,  r: 14, opacity: 0.55, delay: 1.5 },
    { id: 10, x: 220, y: 170, r: 20, opacity: 0.8,  delay: 1.6 },
    { id: 11, x: 235, y: 260, r: 22, opacity: 0.85, delay: 1.7 },
    { id: 12, x: 225, y: 350, r: 18, opacity: 0.7,  delay: 1.8 },

    // Core layer (brain center)
    { id: 13, x: 330, y: 130, r: 18, opacity: 0.75, delay: 2.1 },
    { id: 14, x: 340, y: 230, r: 28, opacity: 1,    delay: 2.3 },  // Central node
    { id: 15, x: 325, y: 330, r: 20, opacity: 0.8,  delay: 2.2 },

    // Hidden layer 3
    { id: 16, x: 430, y: 100, r: 16, opacity: 0.6,  delay: 2.7 },
    { id: 17, x: 440, y: 190, r: 20, opacity: 0.75, delay: 2.8 },
    { id: 18, x: 435, y: 280, r: 18, opacity: 0.7,  delay: 2.9 },
    { id: 19, x: 425, y: 370, r: 14, opacity: 0.55, delay: 3.0 },

    // Output layer (right)
    { id: 20, x: 520, y: 150, r: 14, opacity: 0.5,  delay: 3.3 },
    { id: 21, x: 525, y: 240, r: 16, opacity: 0.6,  delay: 3.4 },
    { id: 22, x: 518, y: 330, r: 14, opacity: 0.5,  delay: 3.5 },
  ];

  // Connections between layers
  const edges = [
    // Input → Hidden 1
    { from: 0, to: 5, delay: 0.7 },
    { from: 0, to: 6, delay: 0.75 },
    { from: 1, to: 5, delay: 0.8 },
    { from: 1, to: 6, delay: 0.85 },
    { from: 2, to: 6, delay: 0.7 },
    { from: 2, to: 7, delay: 0.8 },
    { from: 3, to: 7, delay: 0.9 },
    { from: 3, to: 8, delay: 0.95 },
    { from: 4, to: 7, delay: 0.85 },
    { from: 4, to: 8, delay: 0.9 },
    // Hidden 1 → Hidden 2
    { from: 5, to: 9, delay: 1.3 },
    { from: 5, to: 10, delay: 1.35 },
    { from: 6, to: 10, delay: 1.4 },
    { from: 6, to: 11, delay: 1.45 },
    { from: 7, to: 11, delay: 1.5 },
    { from: 7, to: 12, delay: 1.55 },
    { from: 8, to: 11, delay: 1.5 },
    { from: 8, to: 12, delay: 1.6 },
    // Hidden 2 → Core
    { from: 9, to: 13, delay: 1.9 },
    { from: 10, to: 13, delay: 1.95 },
    { from: 10, to: 14, delay: 2.0 },
    { from: 11, to: 14, delay: 2.05 },
    { from: 11, to: 15, delay: 2.1 },
    { from: 12, to: 14, delay: 2.0 },
    { from: 12, to: 15, delay: 2.15 },
    // Core → Hidden 3
    { from: 13, to: 16, delay: 2.5 },
    { from: 13, to: 17, delay: 2.55 },
    { from: 14, to: 17, delay: 2.6 },
    { from: 14, to: 18, delay: 2.65 },
    { from: 14, to: 16, delay: 2.55 },
    { from: 14, to: 19, delay: 2.7 },
    { from: 15, to: 18, delay: 2.6 },
    { from: 15, to: 19, delay: 2.7 },
    // Hidden 3 → Output
    { from: 16, to: 20, delay: 3.1 },
    { from: 16, to: 21, delay: 3.15 },
    { from: 17, to: 20, delay: 3.2 },
    { from: 17, to: 21, delay: 3.25 },
    { from: 18, to: 21, delay: 3.2 },
    { from: 18, to: 22, delay: 3.3 },
    { from: 19, to: 22, delay: 3.3 },
  ];

  // Key edges for animated pulse particles
  const pulseEdges = [
    { from: 1, to: 6, delay: 1.8 },
    { from: 6, to: 11, delay: 2.4 },
    { from: 10, to: 14, delay: 3.0 },
    { from: 11, to: 14, delay: 3.2 },
    { from: 14, to: 17, delay: 3.6 },
    { from: 14, to: 18, delay: 3.8 },
    { from: 17, to: 21, delay: 4.2 },
    { from: 5, to: 10, delay: 2.2 },
    { from: 13, to: 16, delay: 3.5 },
    { from: 18, to: 22, delay: 4.4 },
  ];

  const centralNode = nodes[14];

  return (
    <svg
      className="hero-ai-svg"
      viewBox="0 0 560 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="aiCenterGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,180,255,0.18)" />
          <stop offset="100%" stopColor="rgba(0,180,255,0)" />
        </radialGradient>
        <radialGradient id="aiNodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(100,200,255,0.35)" />
          <stop offset="100%" stopColor="rgba(100,200,255,0)" />
        </radialGradient>
      </defs>

      {/* Background glow around center — appears with central node */}
      <circle
        cx={centralNode.x} cy={centralNode.y} r={130}
        fill="url(#aiCenterGlow)"
        className="flow-node"
        style={{ animationDelay: `${centralNode.delay}s` }}
      />

      {/* Orbit rings around central node */}
      {[55, 90, 130].map((radius, i) => (
        <ellipse
          key={`orbit-${i}`}
          cx={centralNode.x} cy={centralNode.y}
          rx={radius} ry={radius}
          fill="none"
          stroke={`rgba(100,200,255,${0.08 - i * 0.02})`}
          strokeWidth="1"
          className="flow-node"
          style={{ animationDelay: `${centralNode.delay + 0.1 * i}s` }}
        />
      ))}

      {/* Edges — animated line draw */}
      {edges.map((edge, i) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const opacityVal = Math.min(from.opacity, to.opacity) * 0.4;
        return (
          <line
            key={`e-${i}`}
            x1={from.x} y1={from.y}
            x2={to.x} y2={to.y}
            stroke={`rgba(100,200,255,${opacityVal})`}
            strokeWidth="1.2"
            strokeDasharray={len}
            strokeDashoffset={len}
            className="flow-edge"
            style={{ animationDelay: `${edge.delay}s` }}
          />
        );
      })}

      {/* Animated pulse dots traveling along key edges */}
      {pulseEdges.map((pe, i) => {
        const from = nodes[pe.from];
        const to = nodes[pe.to];
        return (
          <circle
            key={`pulse-${i}`}
            r="3.5"
            fill="rgba(120,220,255,0.7)"
            className="flow-pulse"
            style={{ animationDelay: `${pe.delay}s` }}
          >
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              begin={`${pe.delay}s`}
              path={`M${from.x},${from.y} L${to.x},${to.y}`}
            />
          </circle>
        );
      })}

      {/* Nodes — animated scale-in */}
      {nodes.map((node) => (
        <g
          key={`n-${node.id}`}
          className="flow-node"
          style={{ animationDelay: `${node.delay}s` }}
        >
          {/* Glow for larger nodes */}
          {node.r >= 18 && (
            <circle cx={node.x} cy={node.y} r={node.r * 2.2} fill="url(#aiNodeGlow)" />
          )}

          {/* Node circle */}
          <circle
            cx={node.x} cy={node.y}
            r={node.r / 2}
            fill={`rgba(150,220,255,${node.opacity * 0.3})`}
            stroke={`rgba(100,200,255,${node.opacity * 0.6})`}
            strokeWidth="1.5"
          />

          {/* Inner bright dot */}
          <circle
            cx={node.x} cy={node.y}
            r={node.r * 0.22}
            fill={`rgba(200,240,255,${node.opacity})`}
          />
        </g>
      ))}

      {/* Central node special highlight */}
      <g
        className="flow-node"
        style={{ animationDelay: `${centralNode.delay}s` }}
      >
        <circle cx={centralNode.x} cy={centralNode.y} r={20} fill="rgba(0,150,255,0.12)" />
        <circle
          cx={centralNode.x} cy={centralNode.y}
          r={centralNode.r / 2}
          fill="rgba(100,200,255,0.35)"
          stroke="rgba(100,220,255,0.8)"
          strokeWidth="2"
        />
        <circle cx={centralNode.x} cy={centralNode.y} r={5} fill="rgba(220,245,255,0.95)" />
      </g>
    </svg>
  );
};
