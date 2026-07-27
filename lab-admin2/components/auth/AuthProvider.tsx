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
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (!savedToken) {
      setLoading(false);
      return;
    }

    setToken(savedToken);
    meRequest(savedToken)
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const response = await loginRequest({ email, password });
    localStorage.setItem('auth_token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
  }

  function logout() {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ user, token, loading, login, logout }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}