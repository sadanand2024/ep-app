// context/DrawerContext.js
import React, { createContext, useRef, useState } from 'react';
import { DrawerLayout } from 'react-native-gesture-handler';

export const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
  const drawerRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const openDrawer = () => drawerRef.current?.openDrawer();
  const closeDrawer = () => drawerRef.current?.closeDrawer();
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <DrawerContext.Provider value={{ 
      drawerRef, 
      openDrawer, 
      closeDrawer, 
      toggleTheme, 
      isDarkMode 
    }}>
      {children}
    </DrawerContext.Provider>
  );
};
