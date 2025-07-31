/** @jsxImportSource @emotion/react */
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileStatus, setProfileStatus] = useState(null);

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
    
    // Verificar estado del perfil después de login
    checkProfileStatus();
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
    const { data } = await api.post("/auth/register", payload);
    // Después del registro, automáticamente hacer login
    if (data.access_token) {
      saveSession(data);
    }
    return data;
  };

  const verifyEmail = async (verificationCode) => {
    try {
      const { data } = await api.post("/auth/verify-email", {
        email: user.email,
        code: verificationCode
      });
      // Actualizar el usuario con el estado de verificación
      const updatedUser = { ...user, is_verified: true };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return data;
    } catch (error) {
      console.error("Error en verificación de email:", error);
      throw error;
    }
  };

  const resendVerificationCode = async () => {
    try {
      const { data } = await api.post("/auth/resend-verification", {
        email: user.email
      });
      return data;
    } catch (error) {
      console.error("Error al reenviar código:", error);
      throw error;
    }
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

  const checkProfileStatus = async () => {
    try {
      const { data } = await api.get("/doctor-profile/profile-status");
      setProfileStatus(data);
      return data;
    } catch (error) {
      console.error("Error checking profile status:", error);
      setProfileStatus({ has_profile: false, profile_completed: false, is_verified: false });
    }
  };

  const updateProfileStatus = (status) => {
    setProfileStatus(status);
    if (status.profile_completed && user) {
      const updatedUser = { ...user, profile_completed: true };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setAccess(null);
    setUser(null);
    setProfileStatus(null);
    localStorage.clear();
    delete api.defaults.headers.common.Authorization;
  };

  const value = { 
    user, 
    access, 
    loading, 
    profileStatus,
    login, 
    register, 
    refresh, 
    googleLogin, 
    logout, 
    verifyEmail, 
    resendVerificationCode,
    checkProfileStatus,
    updateProfileStatus
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
