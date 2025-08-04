// utils/auth.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem("authToken", token);
  } catch (e) {
    console.error("Failed to save token", e);
  }
};

export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (e) {
    console.error("Failed to save user", e);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("authToken");
  } catch (e) {
    console.error("Failed to get token", e);
  }
};

export const AuthLogout = async () => {
  try {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("attendanceRecords");
    await AsyncStorage.removeItem("userData");
  } catch (e) {
    console.error("Logout failed", e);
  }
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    return JSON.parse(user);
  } catch (e) {
    console.error("Failed to get user", e);
  }
};
