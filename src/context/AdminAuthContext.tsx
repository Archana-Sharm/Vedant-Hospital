import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const AUTH_ENDPOINT = '/api/admin/auth';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const response = await fetch(`${AUTH_ENDPOINT}/session`, {
          credentials: 'same-origin',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok && response.status !== 401) {
          throw new Error('Authentication service unavailable');
        }

        const result = response.ok
          ? (await response.json()) as { authenticated?: boolean }
          : { authenticated: false };

        if (isMounted) setIsAuthenticated(result.authenticated === true);
      } catch {
        if (isMounted) setIsAuthenticated(false);
      } finally {
        if (isMounted) setIsCheckingSession(false);
      }
    };

    void checkSession();
    return () => { isMounted = false; };
  }, []);

  const login = async (username: string, password: string) => {
    const response = await fetch(`${AUTH_ENDPOINT}/login`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 401) {
      setIsAuthenticated(false);
      return false;
    }
    if (!response.ok) throw new Error('Authentication service unavailable');

    const result = await response.json() as { authenticated?: boolean };
    const authenticated = result.authenticated === true;
    setIsAuthenticated(authenticated);
    return authenticated;
  };

  const logout = async () => {
    try {
      await fetch(`${AUTH_ENDPOINT}/logout`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      });
    } finally {
      setIsAuthenticated(false);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isCheckingSession, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
