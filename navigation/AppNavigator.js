// navigation/AppNavigator.js
import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import MainStack from "./MainStack";
import { getToken, getUser } from "../utils/auth";
import { ActivityIndicator, View } from "react-native";

export default function AppNavigator() {
  const { login, logout, isLoggedIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await getToken();
      const user = await getUser();
      if (token) {
        login(user);
      } else {
        logout();
      }
      setIsLoading(false);
    };
    checkLogin();
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      ) : (
        isLoggedIn ? <MainStack /> : <AuthStack />
      )}
    </NavigationContainer>
  );
}
