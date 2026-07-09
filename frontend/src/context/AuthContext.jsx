import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'pooltech_session';

function loadSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadSession());

  const login = (user, token) => {
    const data = { user, token };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSession(data);
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  const canViewRoutes = () =>
    ['administrador', 'supervisor'].includes(session?.user?.rol);

  return (
    <AuthContext.Provider
      value={{
        authenticated: !!session,
        user: session?.user ?? null,
        token: session?.token ?? null,
        login,
        logout,
        canViewRoutes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
