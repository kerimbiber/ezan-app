import React, { createContext, useContext, useState, useEffect } from 'react';
import DB from './db';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await DB.seedDemoData();
      const session = await DB.getSession();
      if (session) setUser(session);
      setLoading(false);
    })();
  }, []);

  const login = async (email, password, role) => {
    const found = await DB.findUser(email);
    if (!found || found.password !== password) {
      throw new Error('E-posta veya şifre hatalı.');
    }
    if (found.role !== role) {
      const label = role === 'shipper' ? 'Yük Sahibi' : 'Nakliyeci';
      throw new Error(`Bu hesap ${label} hesabı değil.`);
    }
    await DB.setSession(found);
    setUser(found);
    return found;
  };

  const register = async (userData) => {
    const existing = await DB.findUser(userData.email);
    if (existing) {
      throw new Error('Bu e-posta adresi zaten kayıtlı.');
    }
    const newUser = { id: 'u' + Date.now(), ...userData };
    await DB.saveUser(newUser);
    await DB.setSession(newUser);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await DB.clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
