import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar
} from "react-native";
import { Text, useTheme, Portal, Modal, Button } from "react-native-paper";
import { 
  Clock, 
  Calendar, 
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerContext } from "../context/DrawerContext";
import { getCommonStyles } from "../constants/commonStyles";

// Import components
import AttendanceButton from "../components/AttendanceButton";
import AttendanceHistory from "../components/AttendanceHistory";
import { useAttendance } from "../context/AttendanceContext";

export default function AttendanceScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const commonStyles = getCommonStyles(colors);
  const { isDarkMode } = useContext(DrawerContext);
  const { currentAttendanceStatus, attendanceRecords, markAttendance } =
    useAttendance();

  const getIconComponent = (iconName) => {
    const iconMap = {
      'clock': Clock,
      'calendar': Calendar,
      'user-check': UserCheck,
      'user-x': UserX,
      'alert-circle': AlertCircle,
      'check-circle': CheckCircle,
      'clock-check': Clock
    };
    return iconMap[iconName] || Clock;
  };

  // State management
  const [refreshing, setRefreshing] = useState(false);

  // Handlers
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleMarkAttendance = async () => {
    await markAttendance();
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
        translucent={false}
      />
      <View style={commonStyles.header}>
        <View style={commonStyles.headerSide}>
          {React.createElement(getIconComponent("clock-check"), {
            size: 24,
            style: commonStyles.headIcon
          })}
          <Text variant="headlineMedium" style={commonStyles.headerTitle}>
            Attendance
          </Text>
        </View>
        <View style={commonStyles.headerSide}>
          {/* Right side of header if needed */}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Mark Attendance Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Mark Attendance
          </Text>
          <AttendanceButton
            onMarkAttendance={handleMarkAttendance}
            currentStatus={currentAttendanceStatus}
          />
        </View>

        {/* Attendance History Section */}
        <View style={styles.section}>
          <AttendanceHistory attendanceRecords={attendanceRecords} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    content: {
      flex: 1
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 100,
      flexGrow: 1
    },
    section: {
      marginBottom: 24
    },
    sectionTitle: {
      color: colors.onSurface,
      marginBottom: 16,
      fontWeight: "600"
    }
  });
