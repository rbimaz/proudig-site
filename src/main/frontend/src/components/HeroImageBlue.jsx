import React from 'react';

export const HeroImageBlue = () => {
  return (
    <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-static-img">
      {/* Background shapes */}
      <rect x="60" y="40" width="480" height="420" rx="24" fill="#EFF6FF" />
      <rect x="80" y="60" width="440" height="380" rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />

      {/* Browser chrome */}
      <rect x="80" y="60" width="440" height="36" rx="16" fill="#F8FAFC" />
      <circle cx="104" cy="78" r="5" fill="#FC8181" />
      <circle cx="122" cy="78" r="5" fill="#F6E05E" />
      <circle cx="140" cy="78" r="5" fill="#68D391" />
      <rect x="180" y="71" width="200" height="14" rx="7" fill="#EDF2F7" />

      {/* Dashboard content */}
      {/* Sidebar */}
      <rect x="80" y="96" width="100" height="344" fill="#1E293B" />
      <rect x="96" y="116" width="68" height="8" rx="4" fill="#475569" />
      <rect x="96" y="140" width="52" height="6" rx="3" fill="#334155" />
      <rect x="96" y="158" width="60" height="6" rx="3" fill="#334155" />
      <rect x="96" y="176" width="48" height="6" rx="3" fill="#2563EB" />
      <rect x="96" y="194" width="56" height="6" rx="3" fill="#334155" />
      <rect x="96" y="212" width="44" height="6" rx="3" fill="#334155" />

      {/* Main area - header */}
      <rect x="200" y="112" width="140" height="12" rx="6" fill="#1E293B" />
      <rect x="200" y="132" width="200" height="8" rx="4" fill="#CBD5E0" />

      {/* Stats cards */}
      <rect x="200" y="160" width="96" height="70" rx="10" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
      <rect x="216" y="176" width="40" height="8" rx="4" fill="#2563EB" />
      <rect x="216" y="196" width="64" height="16" rx="4" fill="#1D4ED8" />

      <rect x="308" y="160" width="96" height="70" rx="10" fill="#F0FFF4" stroke="#C6F6D5" strokeWidth="1" />
      <rect x="324" y="176" width="36" height="8" rx="4" fill="#38A169" />
      <rect x="324" y="196" width="64" height="16" rx="4" fill="#276749" />

      <rect x="416" y="160" width="96" height="70" rx="10" fill="#FAF5FF" stroke="#E9D8FD" strokeWidth="1" />
      <rect x="432" y="176" width="44" height="8" rx="4" fill="#805AD5" />
      <rect x="432" y="196" width="64" height="16" rx="4" fill="#553C9A" />

      {/* Chart area */}
      <rect x="200" y="248" width="312" height="140" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="216" y="264" width="80" height="8" rx="4" fill="#1E293B" />

      {/* Bar chart — #2563EB gradient */}
      <rect x="230" y="340" width="24" height="32" rx="4" fill="#BFDBFE" />
      <rect x="264" y="316" width="24" height="56" rx="4" fill="#93C5FD" />
      <rect x="298" y="296" width="24" height="76" rx="4" fill="#60A5FA" />
      <rect x="332" y="308" width="24" height="64" rx="4" fill="#3B82F6" />
      <rect x="366" y="288" width="24" height="84" rx="4" fill="#2563EB" />
      <rect x="400" y="300" width="24" height="72" rx="4" fill="#1D4ED8" />
      <rect x="434" y="280" width="24" height="92" rx="4" fill="#1E40AF" />

      {/* Table rows */}
      <rect x="200" y="404" width="312" height="28" rx="6" fill="#F8FAFC" stroke="#EDF2F7" strokeWidth="1" />
      <rect x="212" y="414" width="60" height="6" rx="3" fill="#94A3B8" />
      <rect x="300" y="414" width="40" height="6" rx="3" fill="#CBD5E0" />
      <rect x="380" y="414" width="80" height="6" rx="3" fill="#CBD5E0" />
      <rect x="480" y="411" width="20" height="12" rx="4" fill="#C6F6D5" />

      {/* Floating elements for depth */}
      <rect x="40" y="140" width="60" height="60" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" filter="url(#shadowBlue)" />
      <rect x="52" y="156" width="36" height="6" rx="3" fill="#2563EB" />
      <rect x="52" y="170" width="28" height="14" rx="3" fill="#1D4ED8" />

      <rect x="500" y="320" width="80" height="50" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" filter="url(#shadowBlue)" />
      <circle cx="524" cy="340" r="8" fill="#68D391" />
      <rect x="540" y="332" width="28" height="6" rx="3" fill="#38A169" />
      <rect x="540" y="346" width="20" height="6" rx="3" fill="#94A3B8" />

      {/* Shadow filter */}
      <defs>
        <filter id="shadowBlue" x="-10" y="-10" width="120" height="120" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.08" />
        </filter>
      </defs>
    </svg>
  );
};
