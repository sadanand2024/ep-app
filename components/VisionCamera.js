import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
  Linking
} from "react-native";
import { Button, Text, useTheme, Modal, Portal } from "react-native-paper";
import { 
  Camera, 
  FlipCamera, 
  X, 
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserX,
  ArrowLeft,
  UserPlus
} from "lucide-react-native";
import { Camera as VisionCamera, useCameraDevices } from 'react-native-vision-camera';
import { faceRecognitionAPI } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { isDemoMode, APP_CONFIG } from "../utils/config";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerContext } from "../context/DrawerContext";
import { CameraPermissionHandler } from "../utils/CameraPermissionHandler";

const { width, height } = Dimensions.get("window");

const getIconComponent = (iconName) => {
  const iconMap = {
    'arrow-left': ArrowLeft,
    'camera': Camera,
    'camera-switch': FlipCamera,
    'account-plus': UserPlus,
    'check-circle': CheckCircle,
    'alert-circle': AlertCircle,
    'user-check': UserCheck,
    'user-x': UserX,
    'x': X
  };
  return iconMap[iconName] || Camera;
};

export default function VisionCameraComponent({
  visible,
  onClose,
  onCapture,
  onError,
  isFaceRegistered = false
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(DrawerContext);
  
  // Camera state
  const [hasPermission, setHasPermission] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraPosition, setCameraPosition] = useState('front');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Camera refs
  const camera = useRef(null);
  const devices = useCameraDevices();
  
  // Get the appropriate device based on position
  const getDevice = () => {
    if (cameraPosition === 'front') {
      return devices.front || devices['1'] || devices['0'];
    } else {
      return devices.back || devices['0'] || devices['1'];
    }
  };
  
  const device = getDevice();



  // Request camera permissions
  useEffect(() => {
    if (visible) {
      checkAndRequestPermission();
    }
  }, [visible]);

  const checkAndRequestPermission = async () => {
    const success = await CameraPermissionHandler.ensurePermission(
      () => {
        setHasPermission(true);
      },
      () => {
        setHasPermission(false);
      }
    );
  };

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const requestCameraPermission = async () => {
    const success = await CameraPermissionHandler.ensurePermission(
      () => {
        setHasPermission(true);
      },
      () => {
        setHasPermission(false);
      }
    );
  };

  const takePicture = async () => {
    if (!camera.current) {
      onError("Camera not ready");
      return;
    }

    setIsCapturing(true);
    try {
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'off',
        enableShutterSound: false,
      });

      const photoData = {
        uri: `file://${photo.path}`,
        width: photo.width,
        height: photo.height,
        base64: null // Will be converted if needed
      };

      // Convert to base64 if needed for API
      if (photoData.uri) {
        try {
          const response = await fetch(photoData.uri);
          const blob = await response.blob();
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
          });
          photoData.base64 = base64;
        } catch (error) {
          console.error("Error converting to base64:", error);
        }
      }

      // Mark attendance directly without face recognition
      const attendanceResult = {
        success: true,
        data: {
          confidence: 1.0,
          message: "Attendance marked successfully"
        }
      };

      onClose();
      setTimeout(() => {
        onCapture(photoData, attendanceResult);
      }, 100);
    } catch (error) {
      console.error("Error taking picture:", error);
      onError("Failed to capture photo. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  const performFaceRecognition = async (photoData) => {
    try {
      const userId = user?.id || "unknown_user";

      if (!photoData || (!photoData.uri && !photoData.base64)) {
        return {
          success: false,
          error: "Invalid photo data"
        };
      }

      let apiResult;
      if (photoData.base64) {
        apiResult = await faceRecognitionAPI.verifyFaceBase64(
          photoData.base64,
          userId
        );
      } else {
        apiResult = await faceRecognitionAPI.verifyFace(photoData, userId);
      }

      if (apiResult.success) {
        return {
          success: true,
          data: apiResult.data,
          confidence: apiResult.data.confidence || 0.9,
          message: apiResult.data.message || "Face recognized successfully"
        };
      } else {
        return {
          success: false,
          error: apiResult.error
        };
      }
    } catch (error) {
      console.error("Error in performFaceRecognition:", error);
      
      // Fallback to simulation
      return new Promise((resolve) => {
        setTimeout(() => {
          const isSuccess = Math.random() > 1 - APP_CONFIG.DEMO.SUCCESS_RATE;
          resolve({
            success: isSuccess,
            confidence: isSuccess ? Math.random() * 0.3 + 0.7 : 0.3,
            message: isSuccess
              ? "Face recognized successfully (demo mode)"
              : "Face not recognized (demo mode)",
            isDemo: true
          });
        }, APP_CONFIG.FACE_RECOGNITION.TIMEOUT);
      });
    }
  };

  const registerFace = async () => {
    if (!camera.current) {
      Alert.alert("Error", "Camera not ready");
      return;
    }

    setIsRegistering(true);
    try {
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'off',
        enableShutterSound: false,
      });

      const photoData = {
        uri: `file://${photo.path}`,
        width: photo.width,
        height: photo.height,
      };

      // Convert to base64
      if (photoData.uri) {
        try {
          const response = await fetch(photoData.uri);
          const blob = await response.blob();
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
          });
          photoData.base64 = base64;
        } catch (error) {
          console.error("Error converting to base64:", error);
        }
      }

      // Register face with backend
      const userId = user?.id || "unknown_user";
      let apiResult;
      if (photoData.base64) {
        apiResult = await faceRecognitionAPI.registerFaceBase64(
          photoData.base64,
          userId
        );
      } else {
        apiResult = await faceRecognitionAPI.registerFace(photoData, userId);
      }

      if (apiResult.success) {
        Alert.alert("Success", "Face registered successfully!");
        onClose();
      } else {
        Alert.alert(
          "Registration Failed",
          apiResult.error || "Could not register face. Try again."
        );
      }
    } catch (error) {
      console.error("Error registering face:", error);
      Alert.alert("Error", "Failed to register face. Try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const switchCamera = () => {
    setCameraPosition(current => current === 'front' ? 'back' : 'front');
  };

  if (!hasPermission) {
    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={onClose}
          style={styles.modal}
          transparent={false}
        >
          <SafeAreaView
            style={styles.errorContainer}
            edges={["top", "left", "right", "bottom"]}
          >
            <StatusBar
              barStyle={isDarkMode ? "light-content" : "dark-content"}
              backgroundColor={colors.background}
              translucent={false}
            />
            {React.createElement(getIconComponent("camera"), {
              size: 80,
              color: colors.error
            })}
            <Text variant="titleLarge" style={styles.errorText}>
              Camera Access Required
            </Text>
            <Text variant="bodyMedium" style={styles.errorSubtext}>
              Please enable camera access in your device settings to use face recognition.
            </Text>
            <Button
              mode="contained"
              onPress={checkAndRequestPermission}
              style={styles.closeButton}
            >
              Grant Permission
            </Button>
            <Button
              mode="outlined"
              onPress={CameraPermissionHandler.openSettings}
              style={[styles.closeButton, { marginTop: 8 }]}
            >
              Open Settings
            </Button>
            <Button
              mode="outlined"
              onPress={onClose}
              style={[styles.closeButton, { marginTop: 8 }]}
            >
              Cancel
            </Button>
          </SafeAreaView>
        </Modal>
      </Portal>
    );
  }

  if (!device) {
    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={onClose}
          style={styles.modal}
          transparent={false}
        >
          <SafeAreaView
            style={styles.errorContainer}
            edges={["top", "left", "right", "bottom"]}
          >
            <StatusBar
              barStyle={isDarkMode ? "light-content" : "dark-content"}
              backgroundColor={colors.background}
              translucent={false}
            />
            {React.createElement(getIconComponent("camera"), {
              size: 80,
              color: colors.error
            })}
            <Text variant="titleLarge" style={styles.errorText}>
              Camera Not Available
            </Text>
            <Text variant="bodyMedium" style={styles.errorSubtext}>
              No camera device found on this device.
            </Text>
            <Button
              mode="contained"
              onPress={onClose}
              style={styles.closeButton}
            >
              Close
            </Button>
          </SafeAreaView>
        </Modal>
      </Portal>
    );
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.modal}
        transparent={false}
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: colors.background }}
          edges={["top", "left", "right", "bottom"]}
        >
          <StatusBar
            barStyle={isDarkMode ? "light-content" : "dark-content"}
            backgroundColor={colors.background}
            translucent={false}
          />
          
          {/* Header */}
          <View style={styles.cameraHeader}>
            <Button
              mode="text"
              onPress={onClose}
              icon={({ size, color }) => (
                React.createElement(getIconComponent("arrow-left"), {
                  size: size,
                  color: color
                })
              )}
              textColor={colors.onSurface}
              style={styles.backButton}
            />
            <Text variant="titleLarge" style={styles.cameraTitle}>
              Mark Attendance
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Camera View */}
          <View style={styles.cameraView}>
            {device ? (
              <VisionCamera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={visible}
                photo={true}
                video={false}
                audio={false}
              />
            ) : (
              <View style={styles.cameraFallback}>
                <Text style={styles.cameraFallbackText}>
                  Camera device not available
                </Text>
                <Text style={styles.cameraFallbackSubtext}>
                  Available devices: {Object.keys(devices).join(', ')}
                </Text>
              </View>
            )}
            
            {/* Face Detection Overlay */}
            <View style={styles.faceOverlay}>
              <View style={styles.faceFrame} />
              <Text style={styles.faceInstruction}>
                Position your face within the frame to mark attendance
              </Text>
            </View>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <View style={styles.cameraControls}>
              <Button
                mode="outlined"
                onPress={switchCamera}
                icon={({ size, color }) => (
                  React.createElement(getIconComponent("camera-switch"), {
                    size: size,
                    color: color
                  })
                )}
                style={styles.switchButton}
              >
                Switch
              </Button>
              
              <Button
                mode="contained"
                onPress={takePicture}
                loading={isCapturing}
                disabled={isCapturing}
                icon={({ size, color }) => (
                  React.createElement(getIconComponent("camera"), {
                    size: size,
                    color: color
                  })
                )}
                style={styles.captureButton}
                contentStyle={styles.captureButtonContent}
              >
                {isCapturing ? "Processing..." : "Capture"}
              </Button>
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
              <Text variant="bodyMedium" style={styles.instructionText}>
                • Ensure good lighting{"\n"}• Look directly at the camera{"\n"}•
                Stay still while capturing{"\n"}• Tap Capture to mark attendance
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </Portal>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: colors.background
    },
    cameraHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.surface,
      elevation: 2,
      zIndex: 1000,
      paddingHorizontal: 16,
      paddingVertical: 8
    },
    cameraTitle: {
      color: colors.onSurface,
      fontWeight: "600",
      flex: 1,
      textAlign: "center"
    },
    cameraView: {
      flex: 1,
      position: "relative",
      backgroundColor: colors.surfaceVariant,
      width: "100%",
      height: "100%",
      overflow: "hidden"
    },
    cameraFallback: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.surface
    },
    cameraFallbackText: {
      color: colors.onSurface,
      marginTop: 16,
      textAlign: "center"
    },
    cameraFallbackSubtext: {
      color: colors.onSurfaceVariant,
      marginTop: 8,
      textAlign: "center",
      lineHeight: 20
    },
    faceOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100
    },
    faceFrame: {
      width: 250,
      height: 250,
      borderWidth: 3,
      borderColor: colors.primary,
      borderRadius: 125,
      backgroundColor: "transparent"
    },
    faceInstruction: {
      color: "#ffffff",
      backgroundColor: "rgba(10,10,10,0.8)",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginTop: 20,
      fontSize: 14
    },
    bottomControls: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: colors.surface,
      zIndex: 1000
    },
    cameraControls: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginBottom: 16
    },
    switchButton: {
      flex: 1,
      marginRight: 8
    },
    captureButton: {
      flex: 2,
      marginLeft: 8
    },
    captureButtonContent: {
      paddingVertical: 8
    },
    instructions: {
      paddingTop: 8
    },
    instructionText: {
      color: colors.onSurfaceVariant,
      textAlign: "center",
      lineHeight: 20
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      padding: 20
    },
    errorText: {
      color: colors.error,
      marginTop: 16,
      textAlign: "center"
    },
    errorSubtext: {
      color: colors.onSurfaceVariant,
      marginTop: 8,
      textAlign: "center",
      lineHeight: 20
    },
    closeButton: {
      marginTop: 20
    },
    backButton: {
      padding: 0,
      margin: 0,
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center"
    },
    headerSpacer: {
      width: 40
    }
  }); 