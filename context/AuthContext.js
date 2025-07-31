import React, { useState, createContext, useEffect } from "react";
import { getToken, AuthLogout, getUser } from "../utils/auth";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser({
      id: userData.associate_id,
      name: userData.full_name,
      email: userData.email || "user@tarafirst.com",
      employeeId: userData.associate_id
    });
  };

  const logout = () => {
    AuthLogout();
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = await getToken();
      const user = await getUser();
      if (token) {
        login(user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      setIsLoggedIn,
      user,
      setUser,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
