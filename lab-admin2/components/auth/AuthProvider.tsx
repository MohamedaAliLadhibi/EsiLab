'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, me as meRequest } from '@/lib/api';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employer';
  status: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 On mount, check if the user is authenticated via the cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await meRequest(); // cookie is sent automatically
        setUser(response.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  async function login(email: string, password: string) {
    const response = await loginRequest({ email, password });
    // The backend sets the cookie automatically, we just set the user state
    setUser(response.data.user);
  }

  function logout() {
    // Since the token is in an HttpOnly cookie, we can't delete it from the client.
    // Option 1: call a logout endpoint that clears the cookie.
    // Option 2: just clear the user state; the cookie will expire after 24h.
    // We'll implement a simple client-side logout for now.
    setUser(null);
    // Optionally redirect to login page.
    // If you want to clear the cookie immediately, add a POST /auth/logout route.
  }

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}