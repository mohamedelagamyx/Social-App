import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as usersApi from '../api/usersApi';

const AuthContext = createContext(null);

const normalizeUser = (value) => {
  if (!value) return null;
  if (value.user && !value.name && !value.username && !value.email) {
    return value.user;
  }
  return value;
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      const parsed = raw ? JSON.parse(raw) : null;
      return normalizeUser(parsed);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });
  const [initializing, setInitializing] = useState(true);

  // On first load, if we have a token but no cached user, fetch the
  // profile so a page refresh doesn't lose the signed-in state.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!token || user) {
        if (!cancelled) setInitializing(false);
        return;
      }

      try {
        const res = await usersApi.getProfile();
        const profileUser = normalizeUser(res.data);
        if (!cancelled) setUser(profileUser);
      } catch {
        if (!cancelled) {
          setToken(null);
          localStorage.removeItem('token');
        }
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [token, user]);

  const login = useCallback(
    (nextToken, nextUser = user) => {
      if (!nextToken) return;

      localStorage.setItem('token', nextToken);
      const resolvedUser = normalizeUser(nextUser ?? user);

      if (resolvedUser) {
        localStorage.setItem('user', JSON.stringify(resolvedUser));
      } else {
        localStorage.removeItem('user');
      }

      setToken(nextToken);
      setUser(resolvedUser || null);
    },
    [user]
  );

  const updateUser = useCallback((nextUser) => {
    const normalized = normalizeUser(nextUser);
    localStorage.setItem('user', JSON.stringify(normalized));
    setUser(normalized);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      initializing,
      login,
      logout,
      updateUser,
    }),
    [token, user, initializing, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
