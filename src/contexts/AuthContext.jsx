import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger l’utilisateur s’il y a un token
  useEffect(() => {
    if (token) {
      api.setToken(token);
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      setUser(data);
    } catch {
      logout();
    }
  };

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { identifier, password });
      localStorage.setItem('token', data.token);
      api.setToken(data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de la connexion');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const superAdminLogin = async (firstname, lastname, phone, adminPassword) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/super-admin/login', {
        firstname, lastname, phone, adminPassword
      });
      localStorage.setItem('token', data.token);
      api.setToken(data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Connexion admin échouée');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/register', formData);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de l’inscription');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = async() => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    api.setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading, error,
      login, register, superAdminLogin,
      logout, isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
