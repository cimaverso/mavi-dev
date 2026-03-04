

import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveAuth, clearAuth, getUser, isAuthenticated } from '../utils/auth.js';
import httpClient from '../api/httpClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      if (isAuthenticated()) {
        const userData = getUser();
        setUser(userData);
        setIsAuth(true);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await httpClient.post('/api/auth/login', {
        username,
        password,
      });

      if (response.success) {
        const { token, usuario } = response.data;
        
        saveAuth(token, usuario);
        
        setUser(usuario);
        setIsAuth(true);
        
        return { success: true, user: usuario };
      }

      return { success: false, error: 'Error en la autenticación' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setIsAuth(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    isAuth,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  
  return context;
}
