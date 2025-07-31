import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Animated, Dimensions, Alert } from "react-native";
import { Button, Text, useTheme, Surface, Portal, Modal } from "react-native-paper";
import {
  Clock,
  Clock3,
  UserCheck,
  MapPin,
  Camera,
  Timer,
  UserPlus,
  CheckCircle,
  AlertCircle
} from "lucide-react-native";
import { LinearGradient } from 'react-native-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";


import { getStatusConfig as getThemeStatusConfig } from "../constants/theme";
import { DrawerContext } from "../context/DrawerContext";
import { AuthContext } from "../context/AuthContext";

// import { CameraPermissionHandler } from "../utils/CameraPermissionHandler";
import LocationService from "../utils/LocationService";
// import AttendanceCamera from "./AttendanceCamera";
import { attendanceAPI } from "../utils/api";
import Factory from "../utils/Factory";


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
  const [scaleAnim] = useState(new Animated.Value(1));
  const [sessionDuration, setSessionDuration] = useState("00:00:00");
  const [checkInTime, setCheckInTime] = useState(null);
  // const [showCamera, setShowCamera] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);



  // Load check-in time from storage on component mount
  useEffect(() => {
    loadCheckInTime();
  }, []);

  // Handle check-in time from API
  useEffect(() => {
    if (checkInTimeFromAPI && currentStatus === "clocked-in") {
      setCheckInTime(new Date(checkInTimeFromAPI));
      saveCheckInTime(new Date(checkInTimeFromAPI));
    } else if (currentStatus === "clocked-out") {
      setCheckInTime(null);
      clearCheckInTime();
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

  const loadCheckInTime = async () => {
    try {
      const storedTime = await AsyncStorage.getItem("checkInTime");
      if (storedTime) {
        setCheckInTime(new Date(storedTime));
      }
    } catch (error) {
      console.error("Error loading check-in time:", error);
    }
  };

  const saveCheckInTime = async (time) => {
    try {
      await AsyncStorage.setItem("checkInTime", time.toISOString());
    } catch (error) {
      console.error("Error saving check-in time:", error);
    }
  };

  const clearCheckInTime = async () => {
    try {
      await AsyncStorage.removeItem("checkInTime");
    } catch (error) {
      console.error("Error clearing check-in time:", error);
    }
  };

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
      'clock-out': Clock3,
      'clock-in': Clock,
      'user-check': UserCheck,
      'check-circle': CheckCircle,
      'alert-circle': AlertCircle,
      'clock-start': Clock,
      'timer': Timer,
      'map-marker': MapPin,
      'face-recognition': Camera,
      'account-plus': UserPlus
    };
    return iconMap[iconName] || Clock;
  };

  const config = getStatusConfig();

  // Function to get area name with multiple fallback options
  const getAreaNameWithFallback = async (latitude, longitude) => {
    const services = [
      // Service 1: OpenStreetMap Nominatim (with proper headers)
      async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16`,
            {
              headers: {
                'User-Agent': 'TaraFlow/1.0',
                'Accept': 'application/json'
              }
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const data = await response.json();
          return data.display_name || null;
        } catch (error) {
          throw error;
        }
      },

      // Service 2: Alternative geocoding service (BigDataCloud)
      async () => {
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const data = await response.json();
          return data.locality || data.city || data.countryName || null;
        } catch (error) {
          throw error;
        }
      },

      // Service 3: Simple coordinate-based area name
      async () => {
        // Fallback: Create a simple area name from coordinates
        const lat = parseFloat(latitude).toFixed(4);
        const lon = parseFloat(longitude).toFixed(4);
        return `Location (${lat}, ${lon})`;
      }
    ];

    // Try each service in order
    for (let i = 0; i < services.length; i++) {
      try {
        const result = await services[i]();
        if (result) {
          return result;
        }
      } catch (error) {
        if (i === services.length - 1) {
          // Last service failed, return null
          return null;
        }
        // Continue to next service
      }
    }

    return null;
  };

  const handlePress = async () => {
    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();

    if (currentStatus === "clocked-in") {
      // Clocking out
      await handleClockOut();
    } else {
      // Clocking in - with camera and location verification
      await startVerificationProcess();
    }
  };

  const startVerificationProcess = async () => {
    setIsLoading(true);

    try {
      // Request location permission
      const hasLocationPermission = await LocationService.checkPermissions();
      if (!hasLocationPermission) {
        const granted = await requestLocationPermission();
        if (!granted) {
          setIsLoading(false);
          return;
        }
      }

      // Get current location
      let locationData = await LocationService.getCurrentLocation();

      // Get area name from lon and lat with fallback options
      let areaName = null;
      if (locationData && locationData.latitude && locationData.longitude) {
        try {
          // Try multiple geocoding services with fallback
          areaName = await getAreaNameWithFallback(locationData.latitude, locationData.longitude);
          locationData.areaName = areaName;

          if (areaName) {
          } else {
            console.tron.log('No area name available, using coordinates only');
          }
        } catch (err) {
          console.warn('Failed to fetch area name:', err);
          locationData.areaName = null;
          // Don't fail the attendance process if area name fetch fails
        }
      }
      console.tron.log('Area name fetched:', locationData);

      // Prepare attendance data with location only
      const attendanceData = {
        userId: user?.id || user?.employeeId,
        timestamp: new Date().toISOString(),
        location: locationData,
        type: 'clock-in'
      };

      // Save verification data locally
      await AsyncStorage.setItem('lastVerificationData', JSON.stringify(attendanceData));

      // Send to backend API

      try {
        const response = await Factory('post', '/payroll/manual-checkin/', {
          location: locationData.areaName,
          device_info: 'mobile',
        }, {}, {});
        if (response.status_cd === 1) {
          const now = new Date();
          await saveCheckInTime(now);
          setCheckInTime(now);
          setSessionDuration("00:00:00");
          await onMarkAttendance();
          Alert.alert(
            '✅ Attendance Marked Successfully!',
            `Location verified and data sent to server.\n\nWelcome to work!`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('❌ Error', 'Failed to mark attendance: ' + response.error, [{ text: 'OK' }]);
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        // Continue with local attendance marking even if API fails
        console.warn('API call failed, but continuing with local attendance marking');
      }



    } catch (error) {
      console.error('Error completing attendance:', error);
      Alert.alert('❌ Error', 'Failed to mark attendance: ' + error.message, [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    return new Promise((resolve) => {
      Alert.alert(
        'Location Permission Required',
        'This app needs location access to verify your attendance. Please grant location permission.',
        [
          {
            text: 'Cancel',
            onPress: () => resolve(false),
            style: 'cancel',
          },
          {
            text: 'Grant Permission',
            onPress: async () => {
              try {
                await LocationService.requestPermissions();
                resolve(true);
              } catch (error) {
                Alert.alert(
                  'Permission Denied',
                  'Location permission is required for attendance verification. Please enable it in your device settings.',
                  [{ text: 'OK' }]
                );
                resolve(false);
              }
            },
          },
        ]
      );
    });
  };

  // const handleCameraCapture = async (attendanceData) => {
  //   console.log('handleCameraCapture called with data:', attendanceData);

  //   // Close camera
  //   setShowCamera(false);
  //   setIsLoading(true);

  //   try {
  //     // Save verification data locally
  //     console.log('Saving verification data locally...');
  //     await AsyncStorage.setItem('lastVerificationData', JSON.stringify(attendanceData));

  //     // Send to backend API
  //     console.log('Sending to backend API...');
  //     const apiResult = await attendanceAPI.punchIn(attendanceData);
  //     console.log('API result:', apiResult);

  //     if (!apiResult.success) {
  //         throw new Error(apiResult.error || 'Failed to send attendance data to server');
  //     }

  //     // Complete attendance marking locally
  //     console.log('Completing attendance marking locally...');
  //     const now = new Date();
  //     await saveCheckInTime(now);
  //     setCheckInTime(now);
  //     setSessionDuration("00:00:00");

  //     await onMarkAttendance();

  //     // Show success popup
  //     Alert.alert(
  //       '✅ Attendance Marked Successfully!',
  //       `Photo captured and location verified.\nData sent to server.\n\nWelcome to work!`,
  //       [{ text: 'OK' }]
  //     );

  //   } catch (error) {
  //     console.error('Error completing attendance:', error);
  //     Alert.alert('❌ Error', 'Failed to mark attendance: ' + error.message, [{ text: 'OK' }]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleCameraError = (error) => {
  //   setShowCamera(false);
  //   setIsLoading(false);
  //   Alert.alert('❌ Camera Error', error, [{ text: 'OK' }]);
  // };

  const handleClockOut = async () => {
    setIsLoading(true);
    try {
      // Get location data for clock out
      let locationData = null;
      try {
        const hasLocationPermission = await LocationService.checkPermissions();
        if (hasLocationPermission) {
          locationData = await LocationService.getCurrentLocation();
        }
      } catch (error) {
        console.log('Location error during clock out:', error);
      }

      // Prepare clock out data
      const clockOutData = {
        userId: user?.id || user?.employeeId,
        timestamp: new Date().toISOString(),
        location: locationData,
        type: 'clock-out'
      };

      // Send to backend API
      const apiResult = await Factory('post', '/payroll/manual-checkout/', {
        location: locationData.areaName,
        device_info: 'mobile',
      }, {}, {});
      if (apiResult.status_cd === 1) {
        // Complete clock out locally
        await clearCheckInTime();
        setCheckInTime(null);
        setSessionDuration("00:00:00");
        await onMarkAttendance();
        Alert.alert(
          '✅ Clock Out Successful!',
          'Have a great day!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('❌ Error', 'Failed to clock out: ' + apiResult.error, [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Error during clock out:', error);
      Alert.alert('❌ Error', 'Failed to clock out: ' + error.message, [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  };



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
            {/* Right: Current Time */}
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

      {/* Main Button Row */}
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <Animated.View
          style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          <Animated.View
            style={[styles.pulseContainer, { transform: [{ scale: pulseAnim }] }]}
          >
            <LinearGradient
              colors={config.gradient}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Button
                mode="contained"
                onPress={handlePress}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                icon={({ size, color }) => (
                  React.createElement(getIconComponent(config.icon), {
                    size: size,
                    color: color
                  })
                )}
              >
                {config.text}
              </Button>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </View>




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
      alignItems: "flex-end"
    },
    currentTimeText: {
      color: colors.onSurfaceVariant,
      fontWeight: "600"
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
    buttonContainer: {
      alignItems: "center"
    },
    pulseContainer: {
      alignItems: "center"
    },
    gradientButton: {
      borderRadius: 18,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4
      },
      shadowOpacity: 0.3,
      shadowRadius: 8
    },
    button: {
      borderRadius: 18,
      backgroundColor: "transparent",
      elevation: 0
    },
    buttonContent: {
      paddingVertical: 10,
      minWidth: 120
    },
    buttonLabel: {
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0.5
    },

    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 8
    },
    currentTime: {
      color: colors.onSurfaceVariant,
      fontWeight: "600"
    }
  });
