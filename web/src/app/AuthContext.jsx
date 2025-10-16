'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AsyncStorage = {
  getItem: async (key) => typeof window !== 'undefined' ? localStorage.getItem(key) : null,
  setItem: async (key, value) => typeof window !== 'undefined' ? localStorage.setItem(key, value) : null,
  removeItem: async (key) => typeof window !== 'undefined' ? localStorage.removeItem(key) : null,
};

const validateToken = async (token) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const userData = await AsyncStorage.getItem("userData");
  if (token && userData) {
    return JSON.parse(userData);
  }
  return null;
};

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const validUser = await validateToken(token);
          if (validUser) {
            setUser(validUser);
          } else {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("userData");
          }
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  // 🔥 Função de logout global
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userData");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
