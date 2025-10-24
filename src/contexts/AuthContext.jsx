import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api'; // ✅ Import standardisé

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken')); // ✅ Correction: 'authToken'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger l'utilisateur s'il y a un token
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const { data } = await authAPI.getProfile(); // ✅ Méthode API standardisée
      setUser(data);
    } catch {
      logout();
    }
  };

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAPI.login({ identifier, password }); // ✅ Méthode API standardisée
      localStorage.setItem('authToken', data.token); // ✅ Correction: 'authToken'
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Échec de la connexion'); // ✅ Structure erreur standardisée
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const superAdminLogin = async (firstname, lastname, phone, adminPassword) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAPI.superAdminLogin({ // ✅ Méthode API standardisée
        firstname, lastname, phone, adminPassword
      });
      localStorage.setItem('authToken', data.token); // ✅ Correction: 'authToken'
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Connexion admin échouée'); // ✅ Structure erreur standardisée
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await authAPI.register(formData); // ✅ Méthode API standardisée
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Échec de l\'inscription'); // ✅ Structure erreur standardisée
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout(); // ✅ Méthode API standardisée
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('authToken'); // ✅ Correction: 'authToken'
      localStorage.removeItem('userData'); // ✅ Nettoyage cohérent avec intercepteurs
      setUser(null);
      setToken(null);
    }
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
