import React, { useState, useEffect, useRef, useContext } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { Text, useTheme, Surface } from "react-native-paper";
import {
  UserCheck,
  Timer,
  CheckCircle,
  AlertCircle
} from "lucide-react-native";

import { getStatusConfig as getThemeStatusConfig } from "../constants/theme";
import { DrawerContext } from "../context/DrawerContext";
import { AuthContext } from "../context/AuthContext";
import ClockInOut from "./ClockInOut";


const { width } = Dimensions.get("window");

export default function AttendanceButton({
  onMarkAttendance,
  currentStatus = "not-marked",
  checkInTimeFromAPI = null
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { isDarkMode } = useContext(DrawerContext);
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [sessionDuration, setSessionDuration] = useState("00:00:00");
  const [checkInTime, setCheckInTime] = useState(null);
  
  // Use ref to track previous checkInTimeFromAPI to prevent unnecessary updates
  const prevCheckInTimeFromAPI = useRef(null);


  // Handle check-in time from API
  useEffect(() => {
    // Only update if the checkInTimeFromAPI has actually changed
    if (checkInTimeFromAPI !== prevCheckInTimeFromAPI.current) {
      prevCheckInTimeFromAPI.current = checkInTimeFromAPI;
      
      if (checkInTimeFromAPI && currentStatus === "clocked-in") {
        setCheckInTime(new Date(checkInTimeFromAPI));
      } else if (currentStatus === "clocked-out") {
        setCheckInTime(null);
      }
    }
  }, [checkInTimeFromAPI, currentStatus]);

  // Timer effect for active sessions
  useEffect(() => {
    let interval;
    if (currentStatus === "clocked-in" && checkInTime) {
      interval = setInterval(() => {
        updateTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStatus, checkInTime]);

  // Pulse animation for clocked-in state
  useEffect(() => {
    if (currentStatus === "clocked-in") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [currentStatus]);

  // Removed local storage functions - using only API data

  const updateTimer = () => {
    if (checkInTime) {
      const now = new Date();
      const diff = now - checkInTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      setSessionDuration(formattedTime);
    }
  };

  const formatCheckInTime = () => {
    if (checkInTime) {
      return checkInTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    }
    return "";
  };

  const getStatusConfig = () => {
    const themeConfig = getThemeStatusConfig(currentStatus, "attendance", isDarkMode);

    switch (currentStatus) {
      case "clocked-in":
        return {
          text: "Punch Out",
          icon: "clock-out",
          gradient: ["#ff6b6b", "#ee5a52"],
          status: "Currently Working",
          statusColor: themeConfig.primary,
          statusIcon: "user-check",
          timeText: "Active Session",
          cardColor: themeConfig.background
        };
      case "clocked-out":
        return {
          text: "Punch In",
          icon: "clock-in",
          gradient: ["#4caf50", "#45a049"],
          status: "Session Ended",
          statusColor: themeConfig.primary,
          statusIcon: "check-circle",
          timeText: "Last Session",
          cardColor: themeConfig.background
        };
      default:
        return {
          text: "Punch In",
          icon: "clock-in",
          gradient: ["#2196f3", "#1976d2"],
          status: "Ready to Start",
          statusColor: themeConfig.primary,
          statusIcon: "alert-circle",
          timeText: "Today's Work",
          cardColor: themeConfig.background
        };
    }
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      'user-check': UserCheck,
      'check-circle': CheckCircle,
      'alert-circle': AlertCircle,
      'clock-start': Timer,
      'timer': Timer
    };
    return iconMap[iconName] || Timer;
  };

  const config = getStatusConfig();





  return (
    <View style={styles.container}>
      {/* Status Card */}
      <Surface
        style={[styles.statusCard, { backgroundColor: config.cardColor }]}
        elevation={2}
      >
        <View style={styles.statusHeader}>
          <View style={styles.statusHeaderRow}>
            {/* Left: Status Icon */}
            <View>
              <View style={styles.statusIconContainer}>
                {React.createElement(getIconComponent(config.statusIcon), {
                  size: 24,
                  color: config.statusColor
                })}
              </View>
              <View style={styles.statusInfo}>
                <Text
                  variant="titleMedium"
                  style={[styles.statusText, { color: config.statusColor }]}
                >
                  {config.status}
                </Text>
                <Text variant="bodySmall" style={styles.timeText}>
                  {config.timeText}
                </Text>
              </View>
            </View>
            {/* Right: Current Time and Clock Button */}
            <View style={styles.currentTimeContainer}>
              <Text variant="bodySmall" style={styles.timeText}>
                Current time
              </Text>
              <Text variant="bodyMedium" style={styles.currentTimeText}>
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </Text>
              
              {/* Clock Button */}
              <Animated.View
                style={[styles.clockButtonContainer, { transform: [{ scale: pulseAnim }] }]}
              >
                <ClockInOut
                  onMarkAttendance={onMarkAttendance}
                  currentStatus={currentStatus}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </Animated.View>
            </View>
          </View>
        </View>

        {/* Timer Display */}
        {currentStatus === "clocked-in" && checkInTime && (
          <View style={styles.timerContainer}>
            <View style={styles.timerRow}>
              {React.createElement(getIconComponent("clock-start"), {
                size: 16,
                color: colors.onSurfaceVariant
              })}
              <Text variant="bodySmall" style={styles.timerLabel}>
                Started at: {formatCheckInTime()}
              </Text>
            </View>
            <View style={styles.timerRow}>
              {React.createElement(getIconComponent("timer"), {
                size: 16,
                color: colors.primary
              })}
              <Text variant="titleMedium" style={styles.timerDisplay}>
                {sessionDuration}
              </Text>
            </View>
          </View>
        )}
      </Surface>




      {/* Attendance Camera Modal - Commented out for now */}
      {/* <AttendanceCamera
        visible={showCamera}
        onClose={() => {
          setShowCamera(false);
          setIsLoading(false);
        }}
        onCapture={handleCameraCapture}
        onError={handleCameraError}
      /> */}

    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      gap: 16
    },
    statusCard: {
      width: width - 40,
      borderRadius: 16,
      padding: 16,
      marginBottom: 8
    },
    statusHeader: {
      marginBottom: 12
    },
    statusHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    statusIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      elevation: 2
    },
    statusInfo: {
      flex: 1
    },
    currentTimeContainer: {
      alignItems: "flex-end",
      gap: 8
    },
    currentTimeText: {
      color: colors.onSurfaceVariant,
      fontWeight: "600"
    },
    clockButtonContainer: {
      marginTop: 8,
      alignItems: "center"
    },
    statusText: {
      fontWeight: "700",
      marginBottom: 2
    },
    timeText: {
      color: colors.onSurfaceVariant,
      fontWeight: "500"
    },
    timerContainer: {
      borderTopWidth: 1,
      borderTopColor: colors.outline,
      paddingTop: 12,
      gap: 8
    },
    timerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8
    },
    timerLabel: {
      color: colors.onSurfaceVariant,
      fontWeight: "500"
    },
    timerDisplay: {
      color: colors.primary,
      fontWeight: "700",
      fontFamily: "monospace"
    },
    pulseContainer: {
      alignItems: "center"
    }
  });
