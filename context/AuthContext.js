import React, { useState, createContext, useEffect } from "react";
import { getToken, AuthLogout, getUser } from "../utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  // Listen for AsyncStorage changes to handle logout from API responses
  useEffect(() => {
    console.tron.log('useEffect Calling');
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          setIsLoggedIn(false);
          setUser(null);
        } else {
          // If token exists, check if user data exists too
          const userData = await AsyncStorage.getItem('user');
          if (userData) {
            login(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkAuthStatus();
  }, []);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser({
      id: userData.profile.associate_id,
      name: userData.profile.first_name + " " + userData.profile.last_name || "user",
      email: userData.profile.work_email || "user@tarafirst.com",
      employeeId: userData.profile.associate_id,
      mobileNumber: userData.profile.mobile_number,
      department: userData.profile.department,
      designation: userData.profile.designation,
      profile_image: userData.photo,
      location: userData.profile.work_location,
      joinDate: userData.profile.doj,
    });
  };

  const logout = () => {
    AuthLogout();
    setIsLoggedIn(false);
    setUser(null);
  };

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
