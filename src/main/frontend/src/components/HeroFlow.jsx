import React from 'react';

export const HeroFlow = () => {
  // Workflow nodes inspired by make.com — connected circles with icons
  // Each node appears with a staggered animation delay

  const nodes = [
    { id: 0, x: 80,  y: 220, color: '#0EA5E9', icon: 'arrow',   delay: 0.4,  size: 52 },
    { id: 1, x: 220, y: 220, color: '#8B5CF6', icon: 'gear',    delay: 1.2,  size: 52 },
    { id: 2, x: 360, y: 220, color: '#06B6D4', icon: 'nodes',   delay: 2.0,  size: 56 },
    { id: 3, x: 430, y: 100, color: '#F59E0B', icon: 'bolt',    delay: 2.8,  size: 44 },
    { id: 4, x: 430, y: 340, color: '#EC4899', icon: 'chart',   delay: 3.0,  size: 44 },
  ];

  const edges = [
    { from: 0, to: 1, delay: 0.8 },
    { from: 1, to: 2, delay: 1.6 },
    { from: 2, to: 3, delay: 2.4 },
    { from: 2, to: 4, delay: 2.6 },
  ];

  const renderIcon = (icon, size) => {
    const s = size * 0.38;
    const half = s / 2;
    switch (icon) {
      case 'arrow':
        return (
          <g>
            <path d={`M${-half} 0 L${half * 0.4} 0 M${half * 0.1} ${-half * 0.5} L${half * 0.5} 0 L${half * 0.1} ${half * 0.5}`}
              stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      case 'gear':
        return (
          <g>
            <circle cx="0" cy="0" r={half * 0.45} stroke="#fff" strokeWidth="2" fill="none" />
            {[0, 60, 120, 180, 240, 300].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line key={angle}
                  x1={Math.cos(rad) * half * 0.55} y1={Math.sin(rad) * half * 0.55}
                  x2={Math.cos(rad) * half * 0.85} y2={Math.sin(rad) * half * 0.85}
                  stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              );
            })}
          </g>
        );
      case 'nodes':
        return (
          <g>
            <circle cx="0" cy={-half * 0.5} r={half * 0.25} stroke="#fff" strokeWidth="1.8" fill="none" />
            <circle cx={-half * 0.5} cy={half * 0.4} r={half * 0.25} stroke="#fff" strokeWidth="1.8" fill="none" />
            <circle cx={half * 0.5} cy={half * 0.4} r={half * 0.25} stroke="#fff" strokeWidth="1.8" fill="none" />
            <line x1="0" y1={-half * 0.25} x2={-half * 0.35} y2={half * 0.2} stroke="#fff" strokeWidth="1.5" />
            <line x1="0" y1={-half * 0.25} x2={half * 0.35} y2={half * 0.2} stroke="#fff" strokeWidth="1.5" />
          </g>
        );
      case 'bolt':
        return (
          <g>
            <path d={`M${-half * 0.15} ${-half * 0.6} L${-half * 0.35} ${half * 0.1} L${half * 0.05} ${half * 0.1} L${half * 0.15} ${half * 0.6} L${half * 0.35} ${-half * 0.1} L${-half * 0.05} ${-half * 0.1} Z`}
              fill="#fff" />
          </g>
        );
      case 'chart':
        return (
          <g>
            <line x1={-half * 0.5} y1={-half * 0.2} x2={-half * 0.5} y2={half * 0.5} stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <line x1={-half * 0.1} y1={-half * 0.5} x2={-half * 0.1} y2={half * 0.5} stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <line x1={half * 0.3} y1={half * 0.05} x2={half * 0.3} y2={half * 0.5} stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      className="hero-flow-svg"
      viewBox="0 0 500 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {nodes.map((node) => (
          <radialGradient key={`glow-${node.id}`} id={`flowGlow${node.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={node.color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={node.color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* Edges — animated line draw */}
      {edges.map((edge, i) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        return (
          <line
            key={`edge-${i}`}
            x1={from.x} y1={from.y}
            x2={to.x} y2={to.y}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            strokeDasharray={len}
            strokeDashoffset={len}
            className="flow-edge"
            style={{ animationDelay: `${edge.delay}s` }}
          />
        );
      })}

      {/* Animated pulse dots traveling along edges */}
      {edges.map((edge, i) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        return (
          <circle
            key={`pulse-${i}`}
            r="4"
            fill="rgba(255,255,255,0.6)"
            className="flow-pulse"
            style={{ animationDelay: `${edge.delay + 0.8}s` }}
          >
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              begin={`${edge.delay + 0.8}s`}
              path={`M${from.x},${from.y} L${to.x},${to.y}`}
            />
          </circle>
        );
      })}

      {/* Nodes — animated scale-in */}
      {nodes.map((node) => (
        <g key={`node-${node.id}`}
           className="flow-node"
           style={{ animationDelay: `${node.delay}s` }}
        >
          {/* Outer glow */}
          <circle cx={node.x} cy={node.y} r={node.size * 1.2} fill={`url(#flowGlow${node.id})`} />

          {/* Circle background */}
          <circle cx={node.x} cy={node.y} r={node.size / 2}
            fill={node.color} opacity="0.9"
          />

          {/* Icon */}
          <g transform={`translate(${node.x}, ${node.y})`}>
            {renderIcon(node.icon, node.size)}
          </g>
        </g>
      ))}
    </svg>
  );
};
