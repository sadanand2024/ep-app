import React, { useContext, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, useTheme, Switch, Text, Avatar } from "react-native-paper";
import { DrawerContext } from "../context/DrawerContext";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { ArrowLeft, Menu } from "lucide-react-native";
import { getCommonStyles } from "../constants/commonStyles";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function PageHeader({ onToggleTheme, isDarkMode = false, back = false }) {
  const { openDrawer } = useContext(DrawerContext);
  const { user } = useContext(AuthContext);
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const commonStyles = getCommonStyles(colors);

  // Try to get navigation context, but handle case when not available
  let navigation, route;
  try {
    navigation = useNavigation();
    route = useRoute();
  } catch (error) {
    // Component is not inside a navigator
    console.log('PageHeader: Not inside navigator context');
  }

  // Get current page name and set header title
  const getCurrentPageName = () => {
    if (!route) {
      return 'Dashboard'; // Fallback when not in navigator
    }

    const currentRoute = route.name;

    // Map route names to display names
    const pageNames = {
      'overview': { title: 'Dashboard', subtitle: 'Your main hub' },
      'attendance': { title: 'Attendance', subtitle: 'Track your presence' },
      'leave': { title: 'Leave Management', subtitle: 'Manage your leaves' },
      'calendar': { title: 'Calendar', subtitle: 'View your schedule' },
      'profile': { title: 'Profile', subtitle: 'Your personal info' },
      'taxtds': { title: 'Tax & TDS', subtitle: 'Tax and deductions' },
      'myEarnings': { title: 'My Earnings', subtitle: 'View & download your payslips' },
      'mainTabs': { title: 'Dashboard', subtitle: 'Your main hub' },
      'payslips': { title: 'Payslips', subtitle: 'View or download your payslip' }
    };

    return pageNames[currentRoute] || { title: 'Dashboard', subtitle: 'Dashboard' };
  };

  const currentPageName = getCurrentPageName();
  // Mock notifications - replace with actual data
  const notifications = [
    {
      id: 1,
      title: "Attendance Marked",
      message: "Your attendance has been successfully marked for today",
      type: "attendance",
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: 2,
      title: "Leave Request Approved",
      message: "Your casual leave request for Jan 20 has been approved",
      type: "leave",
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
      id: 3,
      title: "Upcoming Holiday",
      message: "Republic Day holiday on January 26",
      type: "holiday",
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    }
  ];

  const handleNotificationPress = (notification) => {
    console.log("Notification pressed:", notification);
    // Handle notification press - navigate to relevant screen
  };


  return (
    <View style={commonStyles.header}>
      {back && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.onSurface} />
        </TouchableOpacity>
      )}
      {/* Left side - User info */}
      <View style={styles.userSection}>
        <View style={styles.userInfo}>
          <Text variant="titleMedium" style={styles.userName}>
            {currentPageName.title}
          </Text>
          <Text variant="bodySmall" style={styles.userRole}>
            {currentPageName.subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <NotificationBell
          notifications={notifications}
          onNotificationPress={handleNotificationPress}
        />

        {/* Menu Button */}
        <IconButton
          icon={({ size, color }) => (
            <Menu size={size} color={color} />
          )}
          iconColor={colors.onSurface}
          size={24}
          onPress={openDrawer}
          style={styles.menuButton}
        />
      </View>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
      elevation: 4, // Adds bottom elevation (Android)
      shadowColor: "#000", // Adds shadow for iOS
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 4
    },
    userSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1
    },
    avatar: {
      backgroundColor: colors.primary,
      marginRight: 12
    },
    userInfo: {
      flex: 1
    },
    userName: {
      color: colors.onSurface,
      fontWeight: "600",
      lineHeight: 20
    },
    userRole: {
      color: colors.onSurfaceVariant,
      lineHeight: 16
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8
    },
    themeToggle: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surfaceVariant,
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 4
    },
    switch: {
      marginHorizontal: 4
    },
    menuButton: {
      margin: 0
    },
    backButton: {
      marginRight: 16
    }
  });
