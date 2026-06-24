import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('pooltech_auth') === '1'
  );

  const login = () => {
    sessionStorage.setItem('pooltech_auth', '1');
    setAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('pooltech_auth');
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
