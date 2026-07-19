import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('proudig-token'));
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login fehlgeschlagen');
    const data = await res.json();
    setToken(data.token);
    setUser({ email: data.email, roles: data.roles, firstName: data.firstName, lastName: data.lastName, forcePasswordChange: data.forcePasswordChange });
    localStorage.setItem('proudig-token', data.token);
    localStorage.setItem('proudig-refresh', data.refreshToken);
    return data;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('proudig-refresh');
      if (refreshToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (e) { /* ignore */ }
    setToken(null);
    setUser(null);
    localStorage.removeItem('proudig-token');
    localStorage.removeItem('proudig-refresh');
  };

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('proudig-refresh');
    if (!refreshToken) { setLoading(false); return; }
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setToken(data.token);
      setUser({ email: data.email, roles: data.roles, firstName: data.firstName, lastName: data.lastName, forcePasswordChange: data.forcePasswordChange });
      localStorage.setItem('proudig-token', data.token);
    } catch {
      setToken(null);
      setUser(null);
      localStorage.removeItem('proudig-token');
      localStorage.removeItem('proudig-refresh');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) refreshAccessToken();
    else setLoading(false);
  }, []);

  const authFetch = useCallback(async (url, options = {}) => {
    const headers = { ...options.headers, Authorization: `Bearer ${token}` };
    let res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      await refreshAccessToken();
      const newToken = localStorage.getItem('proudig-token');
      if (newToken) {
        headers.Authorization = `Bearer ${newToken}`;
        res = await fetch(url, { ...options, headers });
      }
    }
    return res;
  }, [token, refreshAccessToken]);

  const hasRole = (role) => user?.roles?.includes(role);
  const isAdmin = () => hasRole('ADMIN') || hasRole('CONSULTANT');

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, authFetch, hasRole, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
