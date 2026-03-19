import React from 'react';

export const HeroDarkDash = () => {
  return (
    <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-darkdash-img">
      {/* Background shapes */}
      <rect x="60" y="40" width="480" height="420" rx="24" fill="rgba(79,70,229,0.06)" />
      <rect x="80" y="60" width="440" height="380" rx="16" fill="#141929" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />

      {/* Browser chrome */}
      <rect x="80" y="60" width="440" height="36" rx="16" fill="#0F1424" />
      <circle cx="104" cy="78" r="5" fill="#EF4444" opacity="0.8" />
      <circle cx="122" cy="78" r="5" fill="#F59E0B" opacity="0.8" />
      <circle cx="140" cy="78" r="5" fill="#22C55E" opacity="0.8" />
      <rect x="180" y="71" width="200" height="14" rx="7" fill="rgba(255,255,255,0.05)" />

      {/* Sidebar */}
      <rect x="80" y="96" width="100" height="344" fill="#0D1225" />
      <rect x="96" y="116" width="68" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
      <rect x="96" y="140" width="52" height="6" rx="3" fill="rgba(255,255,255,0.08)" />
      <rect x="96" y="158" width="60" height="6" rx="3" fill="rgba(255,255,255,0.08)" />
      <rect x="96" y="176" width="48" height="6" rx="3" fill="#4F46E5" />
      <rect x="96" y="194" width="56" height="6" rx="3" fill="rgba(255,255,255,0.08)" />
      <rect x="96" y="212" width="44" height="6" rx="3" fill="rgba(255,255,255,0.08)" />

      {/* Main area - header */}
      <rect x="200" y="112" width="140" height="12" rx="6" fill="rgba(255,255,255,0.7)" />
      <rect x="200" y="132" width="200" height="8" rx="4" fill="rgba(255,255,255,0.15)" />

      {/* Stats cards */}
      <rect x="200" y="160" width="96" height="70" rx="10" fill="rgba(79,70,229,0.08)" stroke="rgba(79,70,229,0.2)" strokeWidth="1" />
      <rect x="216" y="176" width="40" height="8" rx="4" fill="#818CF8" />
      <rect x="216" y="196" width="64" height="16" rx="4" fill="#4F46E5" />

      <rect x="308" y="160" width="96" height="70" rx="10" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
      <rect x="324" y="176" width="36" height="8" rx="4" fill="#4ADE80" />
      <rect x="324" y="196" width="64" height="16" rx="4" fill="#22C55E" />

      <rect x="416" y="160" width="96" height="70" rx="10" fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.2)" strokeWidth="1" />
      <rect x="432" y="176" width="44" height="8" rx="4" fill="#C084FC" />
      <rect x="432" y="196" width="64" height="16" rx="4" fill="#A855F7" />

      {/* Chart area */}
      <rect x="200" y="248" width="312" height="140" rx="10" fill="#161C2E" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <rect x="216" y="264" width="80" height="8" rx="4" fill="rgba(255,255,255,0.4)" />

      {/* Bar chart — indigo gradient */}
      <rect x="230" y="340" width="24" height="32" rx="4" fill="rgba(79,70,229,0.2)" />
      <rect x="264" y="316" width="24" height="56" rx="4" fill="rgba(79,70,229,0.3)" />
      <rect x="298" y="296" width="24" height="76" rx="4" fill="rgba(79,70,229,0.45)" />
      <rect x="332" y="308" width="24" height="64" rx="4" fill="rgba(79,70,229,0.6)" />
      <rect x="366" y="288" width="24" height="84" rx="4" fill="#4F46E5" />
      <rect x="400" y="300" width="24" height="72" rx="4" fill="#6366F1" />
      <rect x="434" y="280" width="24" height="92" rx="4" fill="#818CF8" />

      {/* Table rows */}
      <rect x="200" y="404" width="312" height="28" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <rect x="212" y="414" width="60" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
      <rect x="300" y="414" width="40" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
      <rect x="380" y="414" width="80" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
      <rect x="480" y="411" width="20" height="12" rx="4" fill="rgba(34,197,94,0.25)" />

      {/* Floating elements */}
      <rect x="40" y="140" width="60" height="60" rx="12" fill="#161C2E" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" filter="url(#shadowDark)" />
      <rect x="52" y="156" width="36" height="6" rx="3" fill="#4F46E5" />
      <rect x="52" y="170" width="28" height="14" rx="3" fill="#6366F1" />

      <rect x="500" y="320" width="80" height="50" rx="12" fill="#161C2E" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" filter="url(#shadowDark)" />
      <circle cx="524" cy="340" r="8" fill="rgba(34,197,94,0.5)" />
      <rect x="540" y="332" width="28" height="6" rx="3" fill="#4ADE80" />
      <rect x="540" y="346" width="20" height="6" rx="3" fill="rgba(255,255,255,0.15)" />

      {/* Glow effect behind dashboard */}
      <defs>
        <filter id="shadowDark" x="-20" y="-20" width="140" height="140" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#4F46E5" floodOpacity="0.15" />
        </filter>
      </defs>
    </svg>
  );
};
