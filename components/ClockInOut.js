import React, { useState, useContext } from "react";
import { View, StyleSheet, Animated, Alert } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { Clock, Clock3 } from "lucide-react-native";
import { LinearGradient } from 'react-native-linear-gradient';

import { AuthContext } from "../context/AuthContext";
import LocationService from "../utils/LocationService";
import Factory from "../utils/Factory";

export default function ClockInOut({
    onMarkAttendance,
    currentStatus = "not-marked",
    isLoading = false,
    setIsLoading = null
}) {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const { user } = useContext(AuthContext);
    const [scaleAnim] = useState(new Animated.Value(1));

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

    const handlePunchIn = async () => {
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

        if (setIsLoading) setIsLoading(true);

        try {
            // Request location permission
            const hasLocationPermission = await LocationService.checkPermissions();
            if (!hasLocationPermission) {
                const granted = await requestLocationPermission();
                if (!granted) {
                    if (setIsLoading) setIsLoading(false);
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
                    locationData.areaName = null;
                    // Don't fail the attendance process if area name fetch fails
                }
            }

            // Prepare attendance data with location only
            const attendanceData = {
                userId: user?.id || user?.employeeId,
                timestamp: new Date().toISOString(),
                location: locationData,
                type: 'clock-in'
            };

            // Send to backend API
            try {
                const response = await Factory('post', '/payroll/manual-checkin/', {
                    location: locationData.areaName,
                    device_info: 'Mobile',
                }, {}, {});

                if (response.status_cd === 1) {
                    // Call the parent's onMarkAttendance to refresh the status
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
                Alert.alert('❌ Error', 'Failed to connect to server. Please try again.', [{ text: 'OK' }]);
            }

        } catch (error) {
            Alert.alert('❌ Error', 'Failed to mark attendance: ' + error.message, [{ text: 'OK' }]);
        } finally {
            if (setIsLoading) setIsLoading(false);
        }
    };

    const handlePunchOut = async () => {
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

        if (setIsLoading) setIsLoading(true);

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
                location: locationData?.areaName,
                device_info: 'mobile',
            }, {}, {});

            if (apiResult.status_cd === 1) {
                // Call the parent's onMarkAttendance to refresh the status
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
            Alert.alert('❌ Error', 'Failed to clock out: ' + error.message, [{ text: 'OK' }]);
        } finally {
            if (setIsLoading) setIsLoading(false);
        }
    };

    const getButtonConfig = () => {
        switch (currentStatus) {
            case "clocked-in":
                return {
                    text: "Punch Out",
                    icon: Clock3,
                    gradient: ["#ff6b6b", "#ee5a52"],
                    onPress: handlePunchOut
                };
            case "clocked-out":
            default:
                return {
                    text: "Punch In",
                    icon: Clock,
                    gradient: ["#4caf50", "#45a049"],
                    onPress: handlePunchIn
                };
        }
    };

    const config = getButtonConfig();
    const IconComponent = config.icon;

    return (
        <Animated.View
            style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}
        >
            <LinearGradient
                colors={config.gradient}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Button
                    mode="contained"
                    onPress={config.onPress}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                >
                    {config.text}
                </Button>
            </LinearGradient>
        </Animated.View>
    );
}

const getStyles = (colors) =>
    StyleSheet.create({
        buttonContainer: {
            alignItems: "center"
        },
        gradientButton: {
            borderRadius: 6,
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1
            },
            shadowOpacity: 0.2,
            shadowRadius: 4
        },
        button: {
            backgroundColor: "transparent",
        },
        buttonContent: {
            paddingVertical: 6,
            paddingHorizontal: 8
        },
        buttonLabel: {
            fontSize: 12,
            fontWeight: "700",
            letterSpacing: 0.5,
            marginVertical: 0,
            marginHorizontal: 0,
        }
    });
