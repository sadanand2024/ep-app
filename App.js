import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { AppLightTheme, AppDarkTheme } from "./constants/theme";
import { Appearance, StyleSheet, StatusBar, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./context/AuthContext";
import { AttendanceProvider } from "./context/AttendanceContext";
import { DatePickerProvider } from "./context/DatePickerContext";
import AppNavigator from "./navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DrawerProvider, DrawerContext } from "./context/DrawerContext";
import { useContext, useEffect } from "react";
import { CameraPermissionHandler } from "./utils/CameraPermissionHandler";
if (__DEV__) {
  require('./ReactotronConfig');
}

function AppContent() {
  const { isDarkMode } = useContext(DrawerContext);
  const theme = isDarkMode ? AppDarkTheme : AppLightTheme;

  // Initialize camera permissions when app starts
  useEffect(() => {
    const initializeCameraPermissions = async () => {
      try {
        await CameraPermissionHandler.initializePermissions();
      } catch (error) {
        // Silent error handling
      }
    };

    // Delay permission request slightly to ensure app is fully loaded
    const timer = setTimeout(initializeCameraPermissions, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
        translucent={Platform.OS === 'android'}
      />
      <AppNavigator />
    </PaperProvider>
  );
}

export default function App() {
  const colorScheme = Appearance.getColorScheme();
  const useDarkMode = colorScheme === "dark";

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
          <AttendanceProvider>
            <DatePickerProvider>
              <DrawerProvider>
                <AppContent />
              </DrawerProvider>
            </DatePickerProvider>
          </AttendanceProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  }
});
