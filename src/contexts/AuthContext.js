// src/contexts/AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: true
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("dms_token") || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attach token to axios default headers
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    // On mount, if token exists try to fetch profile
    async function fetchProfile() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const resp = await api.get("/auth/me");
        setUser(resp.data.user || resp.data);
      } catch (err) {
        console.error("Auth: failed to fetch profile", err);
        // token invalid -> logout
        setToken(null);
        localStorage.removeItem("dms_token");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [token]);

  async function login({ identifier, password }) {
    // identifier can be phone/email/username depending on backend
    try {
      const resp = await api.post("/auth/login", { phoneOrEmailOrUsername: identifier, password });
      const t = resp.data.token || resp.data.accessToken || resp.data?.data?.token;
      const u = resp.data.user || resp.data?.user || resp.data?.data?.user;
      if (!t) {
        throw new Error("Aucun token reçu du serveur.");
      }
      setToken(t);
      localStorage.setItem("dms_token", t);
      api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
      if (u) setUser(u);
      toast.success("Connecté !");
      return { success: true, user: u };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Échec de la connexion";
      toast.error(msg);
      return { success: false, error: msg };
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("dms_token");
    delete api.defaults.headers.common["Authorization"];
    // optional: call backend logout
    try {
      api.post("/auth/logout").catch(() => {});
    } catch {}
    toast.success("Déconnecté");
    // redirect handled by consumer
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
