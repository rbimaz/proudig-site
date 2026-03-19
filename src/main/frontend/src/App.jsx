import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ThemeToggle } from './components/ThemeToggle';
import { ComingSoon } from './components/ComingSoon';
import { HomePage } from './pages/HomePage';
import { ImpressumPage } from './pages/ImpressumPage';

function AppContent() {
  const [theme, setTheme] = useState('light');
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('proudig-preview') === 'true');
  const location = useLocation();
  const isImpressum = location.pathname === '/impressum';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  if (!unlocked) {
    return <ComingSoon onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="app">
      <Navbar theme={theme} />
      {!isImpressum && <ThemeToggle theme={theme} onThemeChange={handleThemeChange} />}

      <Routes>
        <Route path="/" element={<HomePage theme={theme} />} />
        <Route path="/impressum" element={<ImpressumPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
