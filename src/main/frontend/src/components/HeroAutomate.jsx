import React from 'react';

export const HeroAutomate = () => {
  // Workflow automation illustration inspired by n8n-style connected nodes
  // Rounded cards with icons connected by thick pipes, animated stagger-in

  const accent = '#4F46E5';     // indigo (matches coder/automate theme)
  const green = '#22C55E';      // AI node
  const blue = '#3B82F6';       // document node
  const skyBlue = '#38BDF8';    // cloud node
  const coral = '#F87171';      // chat nodes
  const slate = '#334155';      // folder, pipes
  const bgCircle = '#F1F5F9';

  // Node definitions: each is a rounded-rect card with an icon
  const nodes = [
    { id: 'workflow', x: 60,  y: 150, w: 90, h: 90, color: '#fff',   borderColor: slate,  delay: 0.3 },
    { id: 'ai',       x: 230, y: 120, w: 100, h: 100, color: '#ECFDF5', borderColor: green, delay: 1.2 },
    { id: 'cloud',    x: 400, y: 60,  w: 70, h: 60,  color: '#F0F9FF', borderColor: skyBlue, delay: 2.0 },
    { id: 'folder',   x: 410, y: 160, w: 80, h: 70,  color: '#F8FAFC', borderColor: slate,  delay: 2.2 },
    { id: 'doc',      x: 80,  y: 310, w: 80, h: 80,  color: '#EFF6FF', borderColor: blue,   delay: 1.8 },
    { id: 'chat1',    x: 250, y: 320, w: 70, h: 55,  color: '#FEF2F2', borderColor: coral,  delay: 2.4 },
    { id: 'chat2',    x: 380, y: 310, w: 70, h: 55,  color: '#FEF2F2', borderColor: coral,  delay: 2.8 },
  ];

  // Pipe connections (from node center → to node center, drawn as thick rounded paths)
  const pipes = [
    { from: 'workflow', to: 'ai',     delay: 0.8 },
    { from: 'ai',       to: 'cloud',  delay: 1.6 },
    { from: 'ai',       to: 'folder', delay: 1.8 },
    { from: 'ai',       to: 'doc',    delay: 2.0 },
    { from: 'ai',       to: 'chat1',  delay: 2.2 },
    { from: 'chat1',    to: 'chat2',  delay: 2.6 },
  ];

  const getCenter = (id) => {
    const n = nodes.find(n => n.id === id);
    return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
  };

  // Build orthogonal pipe paths (with rounded corners)
  const getPipePath = (fromId, toId) => {
    const a = getCenter(fromId);
    const b = getCenter(toId);
    const midX = (a.x + b.x) / 2;
    const r = 12; // corner radius

    // Determine pipe routing
    if (fromId === 'workflow' && toId === 'ai') {
      // Horizontal right with arrow
      return `M${a.x + 45} ${a.y} L${b.x - 50} ${b.y}`;
    }
    if (fromId === 'ai' && toId === 'cloud') {
      const ex = b.x + 35;
      const ey = b.y + 30;
      return `M${a.x + 50} ${a.y - 20} L${ex - r} ${a.y - 20} Q${ex} ${a.y - 20} ${ex} ${a.y - 20 + r} L${ex} ${ey}`;
    }
    if (fromId === 'ai' && toId === 'folder') {
      return `M${a.x + 50} ${a.y + 10} L${b.x} ${b.y}`;
    }
    if (fromId === 'ai' && toId === 'doc') {
      const my = a.y + 50;
      return `M${a.x - 20} ${a.y + 50} L${a.x - 20} ${my + r} Q${a.x - 20} ${my + 30} ${a.x - 30} ${my + 40} L${b.x + 60} ${b.y}`;
    }
    if (fromId === 'ai' && toId === 'chat1') {
      return `M${a.x} ${a.y + 50} L${a.x} ${b.y - 10} Q${a.x} ${b.y} ${a.x + r} ${b.y} L${b.x} ${b.y}`;
    }
    if (fromId === 'chat1' && toId === 'chat2') {
      const cy = b.y + 28;
      return `M${a.x + 35} ${cy} L${b.x} ${cy}`;
    }
    // Fallback: straight line
    return `M${a.x} ${a.y} L${b.x} ${b.y}`;
  };

  // Render icon for each node
  const renderIcon = (id, x, y, w, h) => {
    const cx = x + w / 2;
    const cy = y + h / 2;

    switch (id) {
      case 'workflow':
        // n8n-style: arrows connecting small squares
        return (
          <g>
            <rect x={cx - 18} y={cy - 18} width="12" height="12" rx="2" stroke={slate} strokeWidth="2" fill="none" />
            <rect x={cx + 4} y={cy - 10} width="12" height="12" rx="2" stroke={slate} strokeWidth="2" fill="none" />
            <rect x={cx - 10} y={cy + 6} width="12" height="12" rx="2" stroke={slate} strokeWidth="2" fill="none" />
            <path d={`M${cx - 4} ${cy - 10} L${cx + 4} ${cy - 4}`} stroke={slate} strokeWidth="1.8" fill="none" markerEnd="url(#arrowSlate)" />
            <path d={`M${cx - 4} ${cy - 4} L${cx - 2} ${cy + 8}`} stroke={slate} strokeWidth="1.8" fill="none" />
            <text x={cx - 14} y={cy + 30} fill={slate} fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">n8n</text>
          </g>
        );
      case 'ai':
        // AI text with circuit traces
        return (
          <g>
            <text x={cx} y={cy + 6} fill={slate} fontSize="28" fontWeight="800" fontFamily="Inter, sans-serif" textAnchor="middle">AI</text>
            {/* Circuit traces */}
            <circle cx={cx - 28} cy={cy - 10} r="3" fill={green} />
            <line x1={cx - 28} y1={cy - 10} x2={cx - 28} y2={cy - 25} stroke={green} strokeWidth="2" />
            <circle cx={cx + 28} cy={cy - 10} r="3" fill={green} />
            <line x1={cx + 28} y1={cy - 10} x2={cx + 28} y2={cy - 25} stroke={green} strokeWidth="2" />
            <circle cx={cx - 20} cy={cy + 22} r="3" fill={green} />
            <line x1={cx - 20} y1={cy + 22} x2={cx - 20} y2={cy + 35} stroke={green} strokeWidth="2" />
            <circle cx={cx + 20} cy={cy + 22} r="3" fill={green} />
            <line x1={cx + 20} y1={cy + 22} x2={cx + 20} y2={cy + 35} stroke={green} strokeWidth="2" />
            <circle cx={cx} cy={cy + 28} r="3" fill={green} />
            <line x1={cx} y1={cy + 28} x2={cx} y2={cy + 40} stroke={green} strokeWidth="2" />
          </g>
        );
      case 'cloud':
        // Cloud icon
        return (
          <g>
            <path d={`M${cx - 18} ${cy + 6} C${cx - 22} ${cy + 6} ${cx - 24} ${cy} ${cx - 24} ${cy - 5} C${cx - 24} ${cy - 12} ${cx - 18} ${cy - 16} ${cx - 10} ${cy - 14} C${cx - 8} ${cy - 20} ${cx - 2} ${cy - 22} ${cx + 4} ${cy - 18} C${cx + 10} ${cy - 22} ${cx + 18} ${cy - 18} ${cx + 20} ${cy - 10} C${cx + 26} ${cy - 8} ${cx + 26} ${cy} ${cx + 22} ${cy + 4} L${cx - 18} ${cy + 6} Z`}
              fill={skyBlue} opacity="0.3" stroke={skyBlue} strokeWidth="2" />
          </g>
        );
      case 'folder':
        // Folder icon
        return (
          <g>
            <path d={`M${cx - 20} ${cy - 12} L${cx - 20} ${cy + 14} L${cx + 22} ${cy + 14} L${cx + 22} ${cy - 6} L${cx + 4} ${cy - 6} L${cx - 2} ${cy - 12} Z`}
              fill={slate} opacity="0.15" stroke={slate} strokeWidth="2" strokeLinejoin="round" />
            {/* Document peeking out */}
            <rect x={cx - 10} y={cy - 2} width="16" height="12" rx="1" fill="#fff" stroke="#94A3B8" strokeWidth="1.2" />
            <line x1={cx - 6} y1={cy + 2} x2={cx + 2} y2={cy + 2} stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1={cx - 6} y1={cy + 5.5} x2={cx} y2={cy + 5.5} stroke="#CBD5E1" strokeWidth="1.5" />
          </g>
        );
      case 'doc':
        // Document with lines
        return (
          <g>
            <rect x={cx - 16} y={cy - 20} width="32" height="40" rx="3" fill="#fff" stroke={blue} strokeWidth="2" />
            <line x1={cx - 9} y1={cy - 10} x2={cx + 9} y2={cy - 10} stroke={blue} strokeWidth="2" strokeLinecap="round" />
            <line x1={cx - 9} y1={cy - 2} x2={cx + 9} y2={cy - 2} stroke={blue} strokeWidth="2" strokeLinecap="round" />
            <line x1={cx - 9} y1={cy + 6} x2={cx + 3} y2={cy + 6} stroke={blue} strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      case 'chat1':
      case 'chat2':
        // Chat bubble
        return (
          <g>
            <path d={`M${cx - 16} ${cy - 10} L${cx + 16} ${cy - 10} Q${cx + 20} ${cy - 10} ${cx + 20} ${cy - 4} L${cx + 20} ${cy + 4} Q${cx + 20} ${cy + 10} ${cx + 16} ${cy + 10} L${cx - 6} ${cy + 10} L${cx - 10} ${cy + 16} L${cx - 10} ${cy + 10} L${cx - 16} ${cy + 10} Q${cx - 20} ${cy + 10} ${cx - 20} ${cy + 4} L${cx - 20} ${cy - 4} Q${cx - 20} ${cy - 10} ${cx - 16} ${cy - 10} Z`}
              fill={coral} opacity="0.15" stroke={coral} strokeWidth="2" />
            <line x1={cx - 10} y1={cy - 3} x2={cx + 10} y2={cy - 3} stroke={coral} strokeWidth="2" strokeLinecap="round" />
            <line x1={cx - 10} y1={cy + 3} x2={cx + 4} y2={cy + 3} stroke={coral} strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      className="hero-automate-svg"
      viewBox="0 0 520 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="arrowSlate" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill={slate} />
        </marker>
      </defs>

      {/* Pipes — animated line draw */}
      {pipes.map((pipe, i) => {
        const pathD = getPipePath(pipe.from, pipe.to);
        // Estimate path length
        const a = getCenter(pipe.from);
        const b = getCenter(pipe.to);
        const len = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2) * 1.3;
        return (
          <g key={`pipe-${i}`}>
            <path
              d={pathD}
              stroke={slate}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              strokeDasharray={len}
              strokeDashoffset={len}
              className="flow-edge"
              style={{ animationDelay: `${pipe.delay}s`, animationDuration: '1s' }}
            />
            {/* Pulse dot along pipe */}
            <circle
              r="4.5"
              fill={accent}
              opacity="0"
              className="flow-pulse"
              style={{ animationDelay: `${pipe.delay + 1}s` }}
            >
              <animateMotion
                dur="2.5s"
                repeatCount="indefinite"
                begin={`${pipe.delay + 1}s`}
                path={pathD}
              />
            </circle>
          </g>
        );
      })}

      {/* Junction dots on pipe connections */}
      {[
        { x: getCenter('workflow').x + 45, y: getCenter('workflow').y, delay: 0.8 },
        { x: getCenter('ai').x - 50, y: getCenter('ai').y, delay: 1.0 },
        { x: getCenter('ai').x + 50, y: getCenter('ai').y + 10, delay: 1.9 },
      ].map((dot, i) => (
        <circle
          key={`junc-${i}`}
          cx={dot.x} cy={dot.y} r="5"
          fill={slate}
          className="flow-node"
          style={{ animationDelay: `${dot.delay}s` }}
        />
      ))}

      {/* Node cards — animated scale-in */}
      {nodes.map((node) => (
        <g
          key={node.id}
          className="flow-node"
          style={{ animationDelay: `${node.delay}s` }}
        >
          {/* Card background */}
          <rect
            x={node.x} y={node.y}
            width={node.w} height={node.h}
            rx="14"
            fill={node.color}
            stroke={node.borderColor}
            strokeWidth="2.5"
          />
          {/* Icon */}
          {renderIcon(node.id, node.x, node.y, node.w, node.h)}
        </g>
      ))}
    </svg>
  );
};
