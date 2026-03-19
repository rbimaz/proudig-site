import React from 'react';

export const HeroCode = () => {
  // Line-art tech illustration inspired by CoderPro:
  // Code editor window + connected nodes + cloud icons
  const accent = '#4F46E5';     // indigo
  const accentLight = '#818CF8';
  const stroke = '#CBD5E1';     // light gray for outlines
  const strokeDark = '#94A3B8';

  return (
    <svg
      className="hero-code-svg"
      viewBox="0 0 520 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="280" cy="220" r="190" fill="#F1F5F9" />

      {/* Cloud icons */}
      <g opacity="0.5">
        {/* Cloud top-left */}
        <path d="M100 110 C100 95 115 85 130 90 C135 75 155 72 165 85 C180 80 195 92 190 108 L105 108 C95 108 100 110 100 110Z"
          stroke={strokeDark} strokeWidth="1.8" fill="none" />
        {/* Cloud top-right */}
        <path d="M400 70 C400 58 412 50 422 54 C426 42 442 40 450 50 C460 46 472 55 468 68 L404 68 C396 68 400 70 400 70Z"
          stroke={strokeDark} strokeWidth="1.8" fill="none" />
      </g>

      {/* Code editor window */}
      <g>
        {/* Window frame */}
        <rect x="170" y="120" width="230" height="160" rx="8" fill="#1E293B" stroke={accent} strokeWidth="1.5" />
        {/* Title bar */}
        <rect x="170" y="120" width="230" height="28" rx="8" fill="#334155" />
        <rect x="170" y="140" width="230" height="8" fill="#334155" />
        {/* Traffic lights */}
        <circle cx="188" cy="134" r="5" fill="#EF4444" />
        <circle cx="204" cy="134" r="5" fill="#F59E0B" />
        <circle cx="220" cy="134" r="5" fill="#22C55E" />

        {/* Line numbers */}
        <text x="182" y="166" fill="#64748B" fontSize="9" fontFamily="monospace">1</text>
        <text x="182" y="180" fill="#64748B" fontSize="9" fontFamily="monospace">2</text>
        <text x="182" y="194" fill="#64748B" fontSize="9" fontFamily="monospace">3</text>
        <text x="182" y="208" fill="#64748B" fontSize="9" fontFamily="monospace">4</text>
        <text x="182" y="222" fill="#64748B" fontSize="9" fontFamily="monospace">5</text>
        <text x="182" y="236" fill="#64748B" fontSize="9" fontFamily="monospace">6</text>
        <text x="182" y="250" fill="#64748B" fontSize="9" fontFamily="monospace">7</text>
        <text x="182" y="264" fill="#64748B" fontSize="9" fontFamily="monospace">8</text>

        {/* Code lines */}
        <rect x="198" y="159" width="60" height="6" rx="2" fill="#818CF8" opacity="0.8" />
        <rect x="264" y="159" width="40" height="6" rx="2" fill="#34D399" opacity="0.6" />
        <rect x="206" y="173" width="80" height="6" rx="2" fill="#F472B6" opacity="0.6" />
        <rect x="292" y="173" width="30" height="6" rx="2" fill="#FCD34D" opacity="0.5" />
        <rect x="206" y="187" width="55" height="6" rx="2" fill="#60A5FA" opacity="0.7" />
        <rect x="267" y="187" width="70" height="6" rx="2" fill="#34D399" opacity="0.5" />
        <rect x="214" y="201" width="90" height="6" rx="2" fill="#818CF8" opacity="0.6" />
        <rect x="214" y="215" width="45" height="6" rx="2" fill="#FCD34D" opacity="0.6" />
        <rect x="265" y="215" width="60" height="6" rx="2" fill="#F472B6" opacity="0.5" />
        <rect x="206" y="229" width="70" height="6" rx="2" fill="#60A5FA" opacity="0.6" />
        <rect x="198" y="243" width="50" height="6" rx="2" fill="#818CF8" opacity="0.7" />
        <rect x="254" y="243" width="35" height="6" rx="2" fill="#34D399" opacity="0.5" />
        <rect x="198" y="257" width="40" height="6" rx="2" fill="#F472B6" opacity="0.5" />

        {/* Cursor blink */}
        <rect x="244" y="255" width="2" height="12" fill={accentLight} opacity="0.9" />
      </g>

      {/* Connected nodes around the editor */}
      {/* Node: AI brain (top-right) */}
      <g>
        <circle cx="440" cy="160" r="28" fill="white" stroke={accent} strokeWidth="2" />
        <path d="M428 160 C428 148 435 142 440 142 C445 142 452 148 452 160 C452 168 448 172 445 173 L445 178 M435 178 L435 173 C432 172 428 168 428 160Z"
          stroke={accent} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="433" cy="155" r="1.5" fill={accent} />
        <circle cx="447" cy="155" r="1.5" fill={accent} />
      </g>

      {/* Node: Database (bottom-left) */}
      <g>
        <circle cx="120" cy="300" r="28" fill="white" stroke={accent} strokeWidth="2" />
        <ellipse cx="120" cy="290" rx="14" ry="6" stroke={accent} strokeWidth="1.8" fill="none" />
        <path d="M106 290 L106 310 C106 314 112 318 120 318 C128 318 134 314 134 310 L134 290"
          stroke={accent} strokeWidth="1.8" fill="none" />
        <path d="M106 298 C106 302 112 306 120 306 C128 306 134 302 134 298"
          stroke={accent} strokeWidth="1.2" fill="none" />
      </g>

      {/* Node: Gear/Settings (bottom-right) */}
      <g>
        <circle cx="430" cy="320" r="26" fill="white" stroke={accent} strokeWidth="2" />
        <circle cx="430" cy="320" r="8" stroke={accent} strokeWidth="1.8" fill="none" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={angle}
              x1={430 + Math.cos(rad) * 11} y1={320 + Math.sin(rad) * 11}
              x2={430 + Math.cos(rad) * 16} y2={320 + Math.sin(rad) * 16}
              stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
          );
        })}
      </g>

      {/* Node: Mobile (right-center) */}
      <g>
        <circle cx="470" cy="240" r="22" fill="white" stroke={accentLight} strokeWidth="1.8" />
        <rect x="460" y="228" width="20" height="28" rx="3" stroke={accent} strokeWidth="1.5" fill="none" />
        <line x1="460" y1="234" x2="480" y2="234" stroke={accent} strokeWidth="1" />
        <line x1="460" y1="249" x2="480" y2="249" stroke={accent} strokeWidth="1" />
        <circle cx="470" cy="253" r="1.5" fill={accent} />
      </g>

      {/* Connecting lines (dashed) */}
      <line x1="398" y1="268" x2="430" y2="295" stroke={stroke} strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="398" y1="180" x2="414" y2="165" stroke={stroke} strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="448" y1="240" x2="400" y2="220" stroke={stroke} strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="170" y1="260" x2="145" y2="278" stroke={stroke} strokeWidth="1.5" strokeDasharray="4 4" />

      {/* Decorative dots */}
      <circle cx="80" cy="180" r="3" fill={accentLight} opacity="0.4" />
      <circle cx="95" cy="220" r="2" fill={accent} opacity="0.3" />
      <circle cx="490" cy="130" r="2.5" fill={accentLight} opacity="0.4" />
      <circle cx="350" cy="380" r="3" fill={accent} opacity="0.2" />
      <circle cx="150" cy="380" r="2" fill={accentLight} opacity="0.3" />
    </svg>
  );
};
