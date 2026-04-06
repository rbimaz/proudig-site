import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { ThemeToggle } from './components/ThemeToggle';
import { ComingSoon } from './components/ComingSoon';

// Public pages
import { HomePage } from './pages/HomePage';
import { ImpressumPage } from './pages/ImpressumPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { SeminarePage } from './pages/SeminarePage';
import { SeminarDetailPage } from './pages/SeminarDetailPage';

// Admin pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StaticPageList } from './pages/admin/StaticPageList';
import { StaticPageEditor } from './pages/admin/StaticPageEditor';
import { BlogList } from './pages/admin/BlogList';
import { PageEditor } from './pages/admin/PageEditor';
import { SeminarList } from './pages/admin/SeminarList';
import { MediaLibrary } from './pages/admin/MediaLibrary';

// Portal pages
import { PortalLogin } from './pages/portal/PortalLogin';
import { ChangePassword } from './pages/portal/ChangePassword';
import { PortalLayout } from './pages/portal/PortalLayout';
import { PortalDashboard } from './pages/portal/PortalDashboard';
import { PortalDocuments } from './pages/portal/PortalDocuments';
import { PortalShared } from './pages/portal/PortalShared';
import { PortalUsers } from './pages/portal/PortalUsers';

function AppContent() {
  const [theme, setTheme] = useState('udig2');
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('proudig-preview') === 'true');
  const location = useLocation();

  const isImpressum = location.pathname === '/impressum';
  const isAdmin = location.pathname.startsWith('/admin') && !location.pathname.startsWith('/admin/login');
  const isPortal = location.pathname.startsWith('/portal') && !location.pathname.startsWith('/portal/login');
  const hideThemeToggle = isAdmin || isPortal || location.pathname.startsWith('/admin/login') || location.pathname.startsWith('/portal/login');

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
      {!isAdmin && !isPortal && <Navbar theme={theme} />}
      {/* ThemeToggle hidden — only variant 10 (udig2) is used */}

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage theme={theme} />} />
        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/seminare" element={<SeminarePage />} />
        <Route path="/seminare/:slug" element={<SeminarDetailPage />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="seiten" element={<StaticPageList />} />
          <Route path="seiten/new" element={<StaticPageEditor />} />
          <Route path="seiten/:id" element={<StaticPageEditor />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/new" element={<PageEditor category="BLOG" />} />
          <Route path="blog/:id" element={<PageEditor category="BLOG" />} />
          <Route path="seminare" element={<SeminarList />} />
          <Route path="seminare/new" element={<PageEditor category="SEMINAR" />} />
          <Route path="seminare/:id" element={<PageEditor category="SEMINAR" />} />
          <Route path="media" element={<MediaLibrary />} />
        </Route>

        {/* Portal */}
        <Route path="/portal/login" element={<PortalLogin />} />
        <Route path="/portal/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        <Route path="/portal" element={<ProtectedRoute><PortalLayout /></ProtectedRoute>}>
          <Route index element={<PortalDashboard />} />
          <Route path="documents" element={<PortalDocuments />} />
          <Route path="shared" element={<PortalShared />} />
          <Route path="users" element={<ProtectedRoute requiredRole="ADMIN"><PortalUsers /></ProtectedRoute>} />
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider>
          <AppContent />
        </ContentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
