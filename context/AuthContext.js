import React, { useState, createContext, useEffect, useCallback, useRef } from "react";
import { AppState } from "react-native";
import { getToken, AuthLogout, getUser } from "../utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthEvent, emitAuthEvent, AUTH_EVENTS } from "../utils/authEventEmitter";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const lastTokenRef = useRef(null);

  // Check auth status function
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      // Only update state if token status has changed
      if (token !== lastTokenRef.current) {
        lastTokenRef.current = token;
        
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
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // Listen for auth events and app state changes
  useEffect(() => {
    console.tron.log('useEffect Calling');
    checkAuthStatus();
    
    // Listen for auth events (like token removal from API)
    const unsubscribeTokenRemoved = onAuthEvent(AUTH_EVENTS.TOKEN_REMOVED, () => {
      console.log('Auth event: Token removed, updating state');
      setIsLoggedIn(false);
      setUser(null);
    });
    
    // Listen for app state changes to check auth when app comes to foreground
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        checkAuthStatus();
      }
    };
    
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      unsubscribeTokenRemoved();
      appStateSubscription?.remove();
    };
  }, [checkAuthStatus]);

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
    // Emit login event for other components that might need to know
    emitAuthEvent(AUTH_EVENTS.USER_LOGIN, { user: userData });
  };

  const logout = () => {
    AuthLogout();
    setIsLoggedIn(false);
    setUser(null);
    // Emit logout event for other components that might need to know
    emitAuthEvent(AUTH_EVENTS.USER_LOGOUT);
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
