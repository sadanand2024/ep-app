import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text as RNText,
  StatusBar,
  Dimensions
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Checkbox,
  IconButton,
  Card,
  useTheme
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_URL } from "@env";
import { useNavigation } from "@react-navigation/native";
import { saveToken, saveUser, getUser } from "../utils/auth";
import { AuthContext } from "../context/AuthContext";
import { DrawerContext } from "../context/DrawerContext";
import { LinearGradient } from 'react-native-linear-gradient';
import { Eye, EyeOff } from "lucide-react-native";


const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { isDarkMode } = useContext(DrawerContext);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const styles = getStyles(colors);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    let BASE_URL = API_URL + "/payroll/auth/employee-login/";
    try {
      const res = await axios.post(BASE_URL, { username, password });
      const serviceToken = res?.data?.access_token;
      await saveToken(serviceToken);
      await saveUser(res?.data?.employee);
      login(res?.data?.employee);
    } catch (err) {
      console.log("error", err?.response?.data?.error || err.message);
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Gradient Background */}
      <LinearGradient
        colors={[
          colors.primary,
          colors.secondary,
          colors.tertiary || colors.primary
        ]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Header Section with Logo */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/Tarafirstlogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Login Section */}
        <View style={styles.loginSection}>
          {/* Welcome Message */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome back !</Text>

            <Text style={styles.subTitle}>
              Enter your credentials to continue
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                keyboardType="default"
                autoCapitalize="none"
                placeholder="Enter your username"
                activeOutlineColor={colors.secondary}
                outlineColor={colors.secondary}
                outlineStyle={{ borderRadius: 12 }}
                theme={{
                  colors: {
                    outline: colors.outline,
                    primary: colors.secondary,
                    onSurface: colors.onSurface,
                    surface: colors.surface,
                    placeholder: colors.onSurfaceVariant
                  },
                  roundness: 12
                }}
                cursorColor={colors.onSurface}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                activeOutlineColor={colors.secondary}
                outlineColor={colors.secondary}
                outlineStyle={{ borderRadius: 12 }}
                theme={{
                  colors: {
                    outline: colors.outline,
                    primary: colors.secondary,
                    onSurface: colors.onSurface,
                    surface: colors.surface,
                    placeholder: colors.onSurfaceVariant
                  },
                  roundness: 12
                }}
                cursorColor={colors.onSurface}
                right={
                  <TextInput.Icon
                    icon={() => React.createElement(showPassword ? Eye : EyeOff, {
                      size: 20,
                      color: colors.onSurfaceVariant
                    })}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            </View>

            {/* Forgot Password */}
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              style={styles.loginButton}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loginButtonText}>Loading...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signupSection}>
              <RNText style={styles.signupText}>New user? </RNText>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Login Section */}
          <View style={styles.socialSection}>
            <View style={styles.socialIcons}>
              <TouchableOpacity
                style={[styles.socialIcon, { backgroundColor: "#1DA1F2" }]}
              >
                <Text style={styles.socialIconText}>𝕏</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialIcon, { backgroundColor: "#0077B5" }]}
              >
                <Text style={styles.socialIconText}>in</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialIcon, { backgroundColor: "#4267B2" }]}
              >
                <Text style={styles.socialIconText}>f</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.socialIcon,
                  {
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                    borderColor: colors.outline
                  }
                ]}
              >
                <Text style={[styles.socialIconText, { color: "#4285F4" }]}>
                  G
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.socialText}>Sign in with another account</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    gradientBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 8
    },
    headerSection: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 60
    },
    logoContainer: {
      alignItems: "center"
    },
    logo: {
      height: 180,
      width: 180,
      marginBottom: 16,
      tintColor: "#FFFFFF",
      textShadowColor: "#ffffff",
      textShadowOffset: { width: 20, height: 20 },
      textShadowRadius: 10
    },
    brandName: {
      fontSize: 24,
      fontWeight: "700",
      color: "#FFFFFF",
      letterSpacing: 2
    },

    loginSection: {
      width: "100%",
      maxWidth: 400,
      marginTop: 20,
      padding: 32,
      position: "relative",
      zIndex: 10
    },
    welcomeSection: {
      alignItems: "center",
      marginBottom: 32
    },
    welcomeTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.surface,
      textAlign: "center",
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
      marginBottom: 8
    },
    subTitleSection: {
      alignItems: "center",
      marginBottom: 32
    },
    subTitle: {
      fontSize: 16,
      color: colors.surface,
      textAlign: "center",
      marginBottom: 24
    },
    formSection: {
      marginBottom: 24
    },
    inputContainer: {
      marginBottom: 20
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.surface,
      marginBottom: 8,
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2
    },
    inputWrapper: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.outline
    },
    input: {
      backgroundColor: colors.surface,
      fontSize: 16,
      color: colors.onSurface,
      selectionColor: colors.primary,
      paddingHorizontal: 16,
      tintColor: colors.primary,
      borderRadius: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8
    },
    forgotPasswordContainer: {
      alignItems: "center",
      marginBottom: 12
    },
    forgotPassword: {
      color: colors.surface,
      fontSize: 14,
      fontWeight: "500"
    },
    errorContainer: {
      marginBottom: 10,
      borderRadius: 8
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center"
    },
    loginButton: {
      borderRadius: 12,
      marginBottom: 20,
      backgroundColor: colors.primary,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 12
    },
    loginButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF"
    },
    loadingContainer: {
      paddingVertical: 10
    },
    signupSection: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24
    },
    signupText: {
      fontSize: 14,
      color: colors.surface
    },
    signupLink: {
      fontSize: 14,
      color: colors.surface,
      fontWeight: "600"
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 24,
      width: "100%"
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: colors.surface,
      opacity: 0.6
    },
    dividerText: {
      marginHorizontal: 16,
      fontSize: 14,
      color: colors.surface,
      fontWeight: "600",
      textAlign: "center",
      minWidth: 30
    },
    socialSection: {
      alignItems: "center"
    },
    socialIcons: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 16,
      marginBottom: 16
    },
    socialIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8
    },
    socialIconText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#FFFFFF"
    },
    socialText: {
      fontSize: 14,
      color: colors.surface,
      textAlign: "center"
    }
  });
