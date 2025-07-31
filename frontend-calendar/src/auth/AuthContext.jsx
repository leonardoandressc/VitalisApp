/** @jsxImportSource @emotion/react */
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga inicial (si guardas tokens en localStorage)
  useEffect(() => {
    const t = localStorage.getItem("access_token");
    const u = localStorage.getItem("user");
    if (t && u) {
      setAccess(t);
      setUser(JSON.parse(u));
    }
    setLoading(false);
  }, []);

  const saveSession = ({ access_token, refresh_token, user }) => {
    setAccess(access_token);
    setUser(user);
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));
    api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      const { data } = await api.post("/auth/login/json", { 
        email, 
        password,
        remember_me: rememberMe 
      });
      saveSession(data);
      return data;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const register = async (payload) => {
    await api.post("/auth/register", payload);
  };

  const refresh = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) return logout();
    const { data } = await api.post("/auth/refresh", { refresh_token });
    setAccess(data.access_token);
    localStorage.setItem("access_token", data.access_token);
    api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
    return data.access_token;
  };

  const googleLogin = async (id_token) => {
    const { data } = await api.post("/auth/google", { id_token });
    saveSession(data);
  };

  const logout = () => {
    setAccess(null);
    setUser(null);
    localStorage.clear();
    delete api.defaults.headers.common.Authorization;
  };

  const value = { user, access, loading, login, register, refresh, googleLogin, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
