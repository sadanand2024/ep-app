import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, useTheme, Switch, Text, Avatar } from "react-native-paper";
import { DrawerContext } from "../context/DrawerContext";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { Menu } from "lucide-react-native";
import { getCommonStyles } from "../constants/commonStyles";

export default function ProfileHeader({ onToggleTheme, isDarkMode = false }) {
  const { openDrawer } = useContext(DrawerContext);
  const { user } = useContext(AuthContext);
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const commonStyles = getCommonStyles(colors);
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
      {/* Left side - User info */}
      <View style={styles.userSection}>
        <Avatar.Text
          size={40}
          label={user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
          style={styles.avatar}
          color={colors.onPrimary}
        />
        <View style={styles.userInfo}>
          <Text variant="titleMedium" style={styles.userName}>
            {user?.name || "User"}
          </Text>
          <Text variant="bodySmall" style={styles.userRole}>
            {user?.designation || "Unknown"}
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
    }
  });
