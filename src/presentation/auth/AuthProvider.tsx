import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../../infrastructure/api/authApi.ts';
import type { PublicUser } from '../../types/index.ts';

interface AuthValue {
  user: PublicUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

/**
 * Holds the authenticated user. On mount it asks the server who the current
 * user is (via the session cookie); a 401 simply means "not logged in".
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<void> => {
    const u = await authApi.login(username, password);
    setUser(u);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value: AuthValue = { user, loading, isAdmin: user?.role === 'admin', login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Accesses the auth context. Must be called inside AuthProvider.
 * @throws {Error} When called outside AuthProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
