import React from 'react';

export const HeroWorkflow = () => {
  // n8n-style workflow grid: 3 rows of connected nodes in a snake pattern
  // Static rendering, no animations, no labels

  const accent = '#4F46E5';
  const slate = '#334155';
  const nodeSize = 58;
  const gap = 30;
  const startX = 30;
  const startY = 20;

  // Grid positions (col, row) → pixel coords
  const pos = (col, row) => ({
    x: startX + col * (nodeSize + gap),
    y: startY + row * (nodeSize + gap + 8),
  });

  const nodes = [
    // Row 0: left to right
    { id: 'start',    ...pos(0, 0), icon: 'play',      bg: '#FEF2F2', iconColor: '#EF4444' },
    { id: 'webhook',  ...pos(1, 0), icon: 'webhook',    bg: '#FFFFFF', iconColor: '#F97316' },
    { id: 'if',       ...pos(2, 0), icon: 'list',       bg: '#EFF6FF', iconColor: '#60A5FA' },

    // Row 1: right to left (snake)
    { id: 'sheet',    ...pos(2, 1), icon: 'grid',       bg: '#F0FDF4', iconColor: '#22C55E' },
    { id: 'function', ...pos(1, 1), icon: 'gear',       bg: '#FFF7ED', iconColor: '#F97316' },
    { id: 'email',    ...pos(0, 1), icon: 'mail',       bg: '#F5F3FF', iconColor: '#8B5CF6' },

    // Row 2: left to right
    { id: 'http',     ...pos(0, 2), icon: 'link',       bg: '#EFF6FF', iconColor: '#3B82F6' },
    { id: 'data2',    ...pos(1, 2), icon: 'chartLg',    bg: '#FFFBEB', iconColor: '#F59E0B' },
    { id: 'update',   ...pos(2, 2), icon: 'cart',       bg: '#FFFBEB', iconColor: '#D97706' },
  ];

  // Edges: from → to with arrow direction
  const edges = [
    { from: 'start', to: 'webhook' },
    { from: 'webhook', to: 'if' },
    { from: 'if', to: 'sheet' },
    { from: 'sheet', to: 'function', reverse: true },
    { from: 'function', to: 'email', reverse: true },
    { from: 'email', to: 'http' },
    { from: 'function', to: 'data2' },
    { from: 'sheet', to: 'update' },
    { from: 'http', to: 'data2' },
    { from: 'update', to: 'data2', reverse: true },
  ];

  const getNode = (id) => nodes.find(n => n.id === id);
  const cx = (n) => n.x + nodeSize / 2;
  const cy = (n) => n.y + nodeSize / 2;

  // Build edge path with orthogonal routing
  const getEdgePath = (edge) => {
    const from = getNode(edge.from);
    const to = getNode(edge.to);
    const fx = cx(from), fy = cy(from);
    const tx = cx(to), ty = cy(to);

    // Vertical edge
    if (Math.abs(fx - tx) < 5) {
      return `M${fx} ${fy + nodeSize / 2 + 2} L${tx} ${ty - nodeSize / 2 - 2}`;
    }

    // Horizontal edge (same row)
    if (Math.abs(fy - ty) < 5) {
      if (edge.reverse) {
        return `M${fx - nodeSize / 2 - 2} ${fy} L${tx + nodeSize / 2 + 2} ${ty}`;
      }
      return `M${fx + nodeSize / 2 + 2} ${fy} L${tx - nodeSize / 2 - 2} ${ty}`;
    }

    // Cross-row: vertical then horizontal
    const midY = fy + (ty - fy) / 2;
    if (edge.reverse) {
      return `M${fx - nodeSize / 2 - 2} ${fy} L${tx + nodeSize / 2 + 10} ${fy} Q${tx + nodeSize / 2 + 2} ${fy} ${tx + nodeSize / 2 + 2} ${fy + 8} L${tx + nodeSize / 2 + 2} ${ty - 8} Q${tx + nodeSize / 2 + 2} ${ty} ${tx + nodeSize / 2 - 6} ${ty} L${tx + nodeSize / 2 + 2} ${ty}`;
    }
    return `M${fx} ${fy + nodeSize / 2 + 2} L${fx} ${midY} Q${fx} ${midY + 10} ${fx + 10} ${midY + 10} L${tx - 10} ${ty} Q${tx} ${ty} ${tx} ${ty - nodeSize / 2 - 2}`;
  };

  // Render icon inside a node
  const renderIcon = (icon, x, y, color) => {
    const mx = x + nodeSize / 2;
    const my = y + nodeSize / 2;

    switch (icon) {
      case 'play':
        return <path d={`M${mx - 7} ${my - 10} L${mx + 10} ${my} L${mx - 7} ${my + 10} Z`} fill={color} />;
      case 'webhook':
        return (
          <g>
            <circle cx={mx} cy={my - 4} r="6" stroke={color} strokeWidth="2.5" fill="none" />
            <path d={`M${mx + 4} ${my} Q${mx + 10} ${my + 6} ${mx + 4} ${my + 12}`} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d={`M${mx - 4} ${my} Q${mx - 10} ${my + 6} ${mx - 4} ${my + 12}`} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        );
      case 'list':
        return (
          <g>
            <rect x={mx - 11} y={my - 11} width="22" height="22" rx="3" stroke={color} strokeWidth="2" fill={color} opacity="0.15" />
            <line x1={mx - 5} y1={my - 4} x2={mx + 7} y2={my - 4} stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1={mx - 5} y1={my + 1} x2={mx + 7} y2={my + 1} stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1={mx - 5} y1={my + 6} x2={mx + 4} y2={my + 6} stroke={color} strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      case 'grid':
        return (
          <g>
            <rect x={mx - 11} y={my - 11} width="22" height="22" rx="3" stroke={color} strokeWidth="2" fill="none" />
            <line x1={mx} y1={my - 11} x2={mx} y2={my + 11} stroke={color} strokeWidth="1.5" />
            <line x1={mx - 11} y1={my} x2={mx + 11} y2={my} stroke={color} strokeWidth="1.5" />
          </g>
        );
      case 'gear':
        return (
          <g>
            <circle cx={mx} cy={my} r="6" stroke={color} strokeWidth="2.5" fill="none" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line key={angle}
                  x1={mx + Math.cos(rad) * 8} y1={my + Math.sin(rad) * 8}
                  x2={mx + Math.cos(rad) * 12} y2={my + Math.sin(rad) * 12}
                  stroke={color} strokeWidth="2.5" strokeLinecap="round" />
              );
            })}
          </g>
        );
      case 'mail':
        return (
          <g>
            <rect x={mx - 12} y={my - 8} width="24" height="16" rx="2" stroke={color} strokeWidth="2" fill={color} opacity="0.12" />
            <path d={`M${mx - 12} ${my - 8} L${mx} ${my + 2} L${mx + 12} ${my - 8}`} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" />
          </g>
        );
      case 'link':
        return (
          <g>
            <path d={`M${mx - 4} ${my + 4} L${mx - 8} ${my + 8} A6 6 0 0 1 ${mx - 8 - 6 * 0.7} ${my + 8 - 6 * 0.7}`} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d={`M${mx + 4} ${my - 4} L${mx + 8} ${my - 8} A6 6 0 0 1 ${mx + 8 + 6 * 0.7} ${my - 8 + 6 * 0.7}`} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <line x1={mx - 4} y1={my + 4} x2={mx + 4} y2={my - 4} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case 'chartLg':
        return (
          <g>
            <rect x={mx - 9} y={my + 1} width="5" height="9" rx="1" fill={color} opacity="0.5" />
            <rect x={mx - 2} y={my - 6} width="5" height="16" rx="1" fill={color} opacity="0.7" />
            <rect x={mx + 5} y={my - 10} width="5" height="20" rx="1" fill={color} />
          </g>
        );
      case 'cart':
        return (
          <g>
            <path d={`M${mx - 10} ${my - 8} L${mx - 6} ${my - 8} L${mx - 2} ${my + 4} L${mx + 10} ${my + 4}`} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x={mx - 4} y={my - 4} width="14" height="10" rx="2" stroke={color} strokeWidth="2" fill={color} opacity="0.15" />
            <circle cx={mx} cy={my + 10} r="2" fill={color} />
            <circle cx={mx + 8} cy={my + 10} r="2" fill={color} />
          </g>
        );
      default:
        return null;
    }
  };

  const svgW = startX * 2 + 3 * (nodeSize + gap) - gap;
  const svgH = startY * 2 + 3 * (nodeSize + gap + 8) - gap;

  return (
    <svg
      className="hero-workflow-svg"
      viewBox={`0 0 ${svgW} ${svgH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="wfArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill={slate} />
        </marker>
      </defs>

      {/* Edges — static */}
      {edges.map((edge, i) => (
        <path
          key={`edge-${i}`}
          d={getEdgePath(edge)}
          stroke={slate}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          markerEnd="url(#wfArrow)"
        />
      ))}

      {/* Node cards — static */}
      {nodes.map((node) => (
        <g key={node.id}>
          {/* Card shadow */}
          <rect
            x={node.x + 2} y={node.y + 2}
            width={nodeSize} height={nodeSize}
            rx="12"
            fill="rgba(0,0,0,0.04)"
          />
          {/* Card background */}
          <rect
            x={node.x} y={node.y}
            width={nodeSize} height={nodeSize}
            rx="12"
            fill={node.bg}
            stroke="#D1D5DB"
            strokeWidth="1.5"
          />
          {/* Icon */}
          {renderIcon(node.icon, node.x, node.y, node.iconColor)}
        </g>
      ))}
    </svg>
  );
};
