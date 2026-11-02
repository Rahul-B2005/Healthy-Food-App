import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => sessionStorage.getItem("hf_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me(token)
      .then(setUser)
      .catch(() => {
        setToken(null);
        sessionStorage.removeItem("hf_token");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    sessionStorage.setItem("hf_token", data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const data = await api.register({ name, email, password, phone });
    sessionStorage.setItem("hf_token", data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    sessionStorage.removeItem("hf_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
