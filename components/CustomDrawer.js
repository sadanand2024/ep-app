// components/CustomDrawer.js
import React, { useContext } from "react";
import { Drawer, useTheme, Avatar, Text, Divider, Switch } from "react-native-paper";
import { View, StyleSheet, ScrollView } from "react-native";
import { DrawerContext } from "../context/DrawerContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  Bell,
  Calendar,
  CreditCard,
  Shield,
  Sun,
  Moon
} from "lucide-react-native";

export default function CustomDrawer() {
  const { closeDrawer, isDarkMode, toggleTheme } = useContext(DrawerContext);
  const { logout, user } = useContext(AuthContext);
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  // Get user data from AuthContext
  const userProfile = {
    name: user?.name || "User",
    email: user?.email || "user@company.com",
    avatar: user?.name ? user.name.substring(0, 2).toUpperCase() : "U",
    role: "Software Engineer",
    department: "Engineering"
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* User Profile Section */}
          <View style={styles.profileSection}>
            <Avatar.Text
              size={60}
              label={userProfile.avatar}
              style={styles.avatar}
              color={colors.onPrimary}
            />
            <View style={styles.profileInfo}>
              <Text variant="titleMedium" style={styles.userName}>
                {userProfile.name}
              </Text>
              <Text variant="bodyMedium" style={styles.userRole}>
                {userProfile.role}
              </Text>
              <Text variant="bodySmall" style={styles.userDepartment}>
                {userProfile.department}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Main Navigation Items */}
          <View style={styles.section}>
            <Text variant="labelMedium" style={styles.sectionTitle}>
              MAIN MENU
            </Text>

            <Drawer.Item
              icon={({ size, color }) => <User size={size} color={color} />}
              label="Profile"
              onPress={() => {
                closeDrawer();
                navigation.navigate("Profile");
              }}
              style={styles.drawerItem}
              labelStyle={styles.drawerItemLabel}
            />

            <Drawer.Item
              icon={({ size, color }) => <Calendar size={size} color={color} />}
              label="Attendance"
              onPress={() => {
                closeDrawer();
                navigation.navigate("Attendance");
              }}
              style={styles.drawerItem}
              labelStyle={styles.drawerItemLabel}
            />

            <Drawer.Item
              icon={({ size, color }) => <FileText size={size} color={color} />}
              label="Leave Management"
              onPress={() => {
                closeDrawer();
                navigation.navigate("Leave");
              }}
              style={styles.drawerItem}
              labelStyle={styles.drawerItemLabel}
            />
          </View>

          <Divider style={styles.divider} />

          {/* Employee Services */}
          <View style={styles.section}>
            <Text variant="labelMedium" style={styles.sectionTitle}>
              EMPLOYEE SERVICES
            </Text>

            <Drawer.Item
              icon={({ size, color }) => <CreditCard size={size} color={color} />}
              label="Salary Details"
              onPress={() => {
                closeDrawer();
                // Navigate to salary details
              }}
              style={styles.drawerItem}
              labelStyle={styles.drawerItemLabel}
            />

            <Drawer.Item
              icon={({ size, color }) => <FileText size={size} color={color} />}
              label="Documents"
              onPress={() => {
                closeDrawer();
                // Navigate to documents
              }}
              style={styles.drawerItem}
              labelStyle={styles.drawerItemLabel}
            />

            <Drawer.Item
              icon={({ size, color }) => <Shield size={size} color={color} />}
              label="Policies"
              onPress={() => {
                closeDrawer();
                // Navigate to policies
              }}
              style={styles.drawerItem}
              labelStyle={styles.drawerItemLabel}
            />

            <Drawer.Item
              icon={({ size, color }) => <Bell size={size} color={color} />}
              label="Notifications"
              onPress={() => {
                closeDrawer();
                // Navigate to notifications
              }}
              style={styles.drawerItem}
              labelStyle={styles.drawerItemLabel}
            />
            <Drawer.Item
              icon={({ size, color }) => <HelpCircle size={size} color={color} />}
              label="Help & Support"
              onPress={() => {
                closeDrawer();
                // Navigate to help
              }}
              style={styles.drawerItem}
              labelStyle={styles.drawerItemLabel}
            />
          </View>

          <Divider style={styles.divider} />

          {/* Theme Toggle */}
          <View style={styles.themeSection}>
            <View style={styles.themeRow}>
              <View style={styles.themeInfo}>
                {React.createElement(isDarkMode ? Moon : Sun, {
                  size: 20,
                  color: colors.primary
                })}
                <Text variant="bodyMedium" style={styles.themeLabel}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                color={colors.primary}
              />
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Logout */}
          <View style={styles.section}>
            <Drawer.Item
              icon={({ size, color }) => <LogOut size={size} color={colors.error} />}
              label="Logout"
              onPress={() => {
                closeDrawer();
                logout();
              }}
              style={[styles.drawerItem, styles.logoutItem]}
              labelStyle={[styles.drawerItemLabel, styles.logoutLabel]}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    safeArea: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    profileSection: {
      padding: 20,
      alignItems: 'center',
      backgroundColor: colors.primaryContainer,
      marginBottom: 8,
    },
    avatar: {
      backgroundColor: colors.primary,
      marginBottom: 12,
    },
    profileInfo: {
      alignItems: 'center',
    },
    userName: {
      color: colors.onSurface,
      fontWeight: '600',
      marginBottom: 4,
    },
    userRole: {
      color: colors.onSurfaceVariant,
      fontWeight: '500',
      marginBottom: 2,
    },
    userDepartment: {
      color: colors.onSurfaceVariant,
      opacity: 0.8,
    },
    divider: {
      marginVertical: 8,
      backgroundColor: colors.outline,
      opacity: 0.3,
    },
    section: {
      marginBottom: 8,
    },
    sectionTitle: {
      color: colors.primary,
      fontWeight: '600',
      marginHorizontal: 16,
      marginBottom: 8,
      marginTop: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    drawerItem: {
      marginHorizontal: 8,
      marginVertical: 2,
      borderRadius: 8,
    },
    drawerItemLabel: {
      color: colors.onSurface,
      fontWeight: '500',
    },
    themeSection: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    themeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    themeInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    themeLabel: {
      color: colors.onSurface,
      fontWeight: '500',
    },
    logoutItem: {
      backgroundColor: colors.errorContainer,
      marginHorizontal: 8,
      marginVertical: 2,
      borderRadius: 8,
    },
    logoutLabel: {
      color: colors.error,
      fontWeight: '600',
    },
  });
