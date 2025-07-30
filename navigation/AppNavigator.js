// navigation/AppNavigator.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import MainStack from "./MainStack";

export default function AppNavigator() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
