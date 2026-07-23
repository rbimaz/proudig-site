import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { ThemeToggle } from './components/ThemeToggle';
import { ComingSoon } from './components/ComingSoon';

// Public pages
import { HomePage } from './pages/HomePage';
import { ImpressumPage } from './pages/ImpressumPage';
import { StaticPageRenderer } from './pages/StaticPageRenderer';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { SeminarePage } from './pages/SeminarePage';
import { SeminarDetailPage } from './pages/SeminarDetailPage';
import { NewsPage } from './pages/NewsPage';
import { NewsPostPage } from './pages/NewsPostPage';

// Admin pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminHome } from './pages/admin/AdminHome';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StaticPageList } from './pages/admin/StaticPageList';
import { StaticPageEditor } from './pages/admin/StaticPageEditor';
import { BlogList } from './pages/admin/BlogList';
import { PageEditor } from './pages/admin/PageEditor';
import { SeminarList } from './pages/admin/SeminarList';
import { NewsList } from './pages/admin/NewsList';
import { Settings } from './pages/admin/Settings';
import { MediaLibrary } from './pages/admin/MediaLibrary';
import { MessageList } from './pages/admin/MessageList';
import { MessageDetail } from './pages/admin/MessageDetail';

// Portal pages
import { ChangePassword } from './pages/portal/ChangePassword';
import { PortalLayout } from './pages/portal/PortalLayout';
import { PortalDashboard } from './pages/portal/PortalDashboard';
import { PortalDocuments } from './pages/portal/PortalDocuments';
import { PortalShared } from './pages/portal/PortalShared';
import { PortalUsers } from './pages/portal/PortalUsers';
import { PortalUserForm } from './pages/portal/PortalUserForm';

function AppContent() {
  const [theme, setTheme] = useState('udig2');
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('proudig-preview') === 'true');
  const location = useLocation();

  const isStaticPage = location.pathname === '/impressum' || location.pathname === '/datenschutz' || location.pathname.startsWith('/seite/');
  const isAdminArea = location.pathname.startsWith('/admin') && !location.pathname.startsWith('/admin/login') && location.pathname !== '/admin';
  const hideNavbar = isAdminArea || location.pathname === '/admin' || location.pathname.startsWith('/admin/login');

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
      {!hideNavbar && <Navbar theme={theme} />}
      {/* ThemeToggle hidden — only variant 10 (udig2) is used */}

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage theme={theme} />} />
        <Route path="/impressum" element={<StaticPageRenderer slug="impressum" />} />
        <Route path="/datenschutz" element={<StaticPageRenderer slug="datenschutz" />} />
        <Route path="/seite/:slug" element={<StaticPageRenderer />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/seminare" element={<SeminarePage />} />
        <Route path="/seminare/:slug" element={<SeminarDetailPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsPostPage />} />

        {/* Admin - Zentrale Einstiegsseite */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />

        {/* Admin - CMS */}
        <Route path="/admin/cms" element={<ProtectedRoute requiredRole="ADMIN,CONSULTANT"><AdminLayout /></ProtectedRoute>}>
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
          <Route path="news" element={<NewsList />} />
          <Route path="news/new" element={<PageEditor category="NEWS" />} />
          <Route path="news/:id" element={<PageEditor category="NEWS" />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="nachrichten" element={<MessageList />} />
          <Route path="nachrichten/:id" element={<MessageDetail />} />
          <Route path="einstellungen" element={<ProtectedRoute requiredRole="ADMIN"><Settings /></ProtectedRoute>} />
        </Route>

        {/* Admin - Portal */}
        <Route path="/admin/portal/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        <Route path="/admin/portal" element={<ProtectedRoute><PortalLayout /></ProtectedRoute>}>
          <Route index element={<PortalDashboard />} />
          <Route path="documents" element={<PortalDocuments />} />
          <Route path="shared" element={<PortalShared />} />
          <Route path="users" element={<ProtectedRoute requiredRole="ADMIN"><PortalUsers /></ProtectedRoute>} />
          <Route path="users/new" element={<ProtectedRoute requiredRole="ADMIN"><PortalUserForm /></ProtectedRoute>} />
          <Route path="users/:id" element={<ProtectedRoute requiredRole="ADMIN"><PortalUserForm /></ProtectedRoute>} />
        </Route>

        {/* Legacy Redirects */}
        <Route path="/portal/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/portal/change-password" element={<Navigate to="/admin/portal/change-password" replace />} />
        <Route path="/portal/documents" element={<Navigate to="/admin/portal/documents" replace />} />
        <Route path="/portal/shared" element={<Navigate to="/admin/portal/shared" replace />} />
        <Route path="/portal/users" element={<Navigate to="/admin/portal/users" replace />} />
        <Route path="/portal" element={<Navigate to="/admin/portal" replace />} />
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
