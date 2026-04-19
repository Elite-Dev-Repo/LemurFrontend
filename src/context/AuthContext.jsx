import { createContext, useContext, useState, useCallback } from "react";
import api, { authLogin, authRegister } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("lemur_user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const getUserData = async () => {
    const res = await api.get("/me");
    const userData = await res.data;
    localStorage.setItem("lemur_user", JSON.stringify(userData));
    setUser(userData);
    console.log(userData);
  };

  const login = useCallback(async (username, password) => {
    const { data } = await authLogin(username, password);
    localStorage.setItem("lemur_access", data.access);
    localStorage.setItem("lemur_refresh", data.refresh);
    await getUserData();
  }, []);

  const register = useCallback(
    async (username, email, password) => {
      await authRegister(username, email, password);
      await login(username, password);
    },
    [login],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("lemur_access");
    localStorage.removeItem("lemur_refresh");
    localStorage.removeItem("lemur_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
