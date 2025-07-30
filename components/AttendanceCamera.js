import React, { useState, useEffect, useRef, useContext } from "react";
import {
    View,
    StyleSheet,
    Alert,
    Dimensions,
    Platform,
    StatusBar,
    Linking,
    Text,
    Button,
    Modal,
    TouchableOpacity
} from "react-native";
import { Camera as VisionCamera, useCameraDevices } from 'react-native-vision-camera';
import { useTheme } from 'react-native-paper';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { AuthContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerContext } from "../context/DrawerContext";
import { CameraPermissionHandler } from "../utils/CameraPermissionHandler";
import LocationService from "../utils/LocationService";

const { width, height } = Dimensions.get("window");

export default function AttendanceCamera({
    visible,
    onClose,
    onCapture,
    onError
}) {
    const { colors } = useTheme();
    const [orientation, setOrientation] = useState('portrait');
    const styles = getStyles(colors, orientation);
    const { user } = useContext(AuthContext);

    // Camera state
    const [hasPermission, setHasPermission] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [cameraPosition, setCameraPosition] = useState('front');
    const [locationData, setLocationData] = useState(null);

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
            getLocationData();
        }
    }, [visible]);

    // Handle orientation changes
    useEffect(() => {
        const updateOrientation = () => {
            const { width, height } = Dimensions.get('window');
            setOrientation(width > height ? 'landscape' : 'portrait');
        };

        // Set initial orientation
        updateOrientation();

        // Listen for orientation changes
        const subscription = Dimensions.addEventListener('change', updateOrientation);

        return () => {
            subscription?.remove();
        };
    }, []);

    const checkAndRequestPermission = async () => {
        console.log('Checking camera permissions...');
        const success = await CameraPermissionHandler.ensurePermission(
            () => {
                console.log('Camera permission granted');
                setHasPermission(true);
            },
            () => {
                console.log('Camera permission denied');
                setHasPermission(false);
            }
        );
    };

    const getLocationData = async () => {
        try {
            const hasLocationPermission = await LocationService.checkPermissions();
            if (hasLocationPermission) {
                const location = await LocationService.getCurrentLocation();
                setLocationData(location);
            }
        } catch (error) {
            console.log('Location error:', error);
        }
    };

    const takePicture = async () => {
        console.log('takePicture called', { device: !!device, isCapturing, hasPermission });

        if (!device) {
            console.log('No camera device available');
            onError('Camera device not available');
            return;
        }

        if (isCapturing) {
            console.log('Already capturing, ignoring request');
            return;
        }

        if (!hasPermission) {
            console.log('No camera permission');
            onError('Camera permission not granted');
            return;
        }

        if (!camera.current) {
            console.log('Camera ref not available');
            onError('Camera not ready');
            return;
        }

        setIsCapturing(true);
        try {
            console.log('Taking photo...');

            // Take photo using VisionCamera
            const photo = await camera.current.takePhoto({
                qualityPrioritization: 'quality',
                flash: 'off',
                enableShutterSound: false,
            });

            console.log('Photo taken:', photo);

            const photoData = {
                uri: `file://${photo.path}`,
                width: photo.width,
                height: photo.height,
                timestamp: new Date().toISOString()
            };

            console.log('Converting to base64...');

            // Convert to base64
            const response = await fetch(photoData.uri);
            const blob = await response.blob();
            const base64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.readAsDataURL(blob);
            });
            photoData.base64 = base64;

            console.log('Photo converted to base64, length:', base64.length);

            // Combine photo and location data
            const attendanceData = {
                photo: photoData,
                location: locationData,
                userId: user?.id || user?.employeeId,
                timestamp: new Date().toISOString()
            };

            console.log('Calling onCapture with attendance data');
            onCapture(attendanceData);

        } catch (error) {
            console.error('Photo capture error:', error);
            onError('Failed to capture photo: ' + error.message);
        } finally {
            setIsCapturing(false);
        }
    };

    const switchCamera = () => {
        setCameraPosition(prev => prev === 'front' ? 'back' : 'front');
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="slide"
            transparent={false}
        >
            <SafeAreaView style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#000"
                    translucent={false}
                />

                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onClose}
                    >
                        <ArrowLeft size={24} color={colors.onSurface} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.switchCameraIcon}
                        onPress={switchCamera}
                    >
                        <Text style={[styles.switchCameraText, { color: colors.onSurface }]}>
                            🔄
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Camera View */}
                <View style={styles.cameraContainer}>
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
                                Camera not available
                            </Text>
                            <Text style={styles.cameraFallbackSubtext}>
                                Available devices: {Object.keys(devices).join(', ')}
                            </Text>
                            <Text style={styles.cameraFallbackSubtext}>
                                Please check camera permissions and try again
                            </Text>
                        </View>
                    )}

                    {/* Camera Overlay */}
                    <View style={styles.cameraOverlay}>
                        {/* Face Frame */}
                        <View style={styles.faceFrame}>
                            <View style={styles.crosshairVertical} />
                            <View style={styles.crosshairHorizontal} />
                        </View>

                        {/* Instructions */}
                        <Text style={[styles.instructionText, orientation === 'landscape' && styles.instructionTextLandscape]}>
                            Position your face in the frame
                        </Text>

                        {/* Location Status */}
                        {locationData && (
                            <Text style={[styles.locationText, orientation === 'landscape' && styles.locationTextLandscape]}>
                                📍 Location Captured
                            </Text>
                        )}
                    </View>
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={takePicture}
                            disabled={isCapturing || !device}
                        >
                            <Camera size={32} color={colors.onSurface} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const getStyles = (colors, orientation) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'transparent',
        },
        header: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: 'transparent',
            height: 60,
        },
        headerTitle: {
            color: colors.onSurface,
            fontWeight: '600',
        },
        cameraContainer: {
            flex: 1,
            position: 'relative',
        },
        cameraFallback: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.surfaceVariant,
        },
        cameraFallbackText: {
            color: colors.onSurface,
            fontSize: 16,
            marginBottom: 8,
        },
        cameraFallbackSubtext: {
            color: colors.onSurfaceVariant,
            fontSize: 14,
            textAlign: 'center',
        },
        cameraOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
        faceFrame: {
            width: 280,
            height: 280,
            borderWidth: 3,
            borderColor: colors.primary,
            borderRadius: 140,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            marginBottom: 20,
        },
        crosshairVertical: {
            position: 'absolute',
            width: 2,
            height: 60,
            backgroundColor: colors.secondary,
            opacity: 0.8,
        },
        crosshairHorizontal: {
            position: 'absolute',
            width: 60,
            height: 2,
            backgroundColor: colors.secondary,
            opacity: 0.8,
        },
        instructionText: {
            color: colors.onSurface,
            fontSize: 16,
            textAlign: 'center',
            marginTop: 20,
            backgroundColor: colors.surface,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
        },
        instructionTextLandscape: {
            position: 'absolute',
            bottom: 100,
            left: 20,
            right: 20,
            marginTop: 0,
        },
        locationText: {
            color: colors.primary,
            fontSize: 14,
            textAlign: 'center',
            marginTop: 8,
            backgroundColor: colors.surface,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 6,
        },
        locationTextLandscape: {
            position: 'absolute',
            bottom: 60,
            left: 20,
            right: 20,
            marginTop: 0,
        },
        controls: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            paddingHorizontal: 20,
            paddingBottom: 20,
            paddingTop: 20,
            color: colors.onSurface,
            height: 100,
        },
        captureButton: {
            borderRadius: 12,
            color: colors.onSurface,
        },
        debugText: {
            color: colors.onSurface,
            fontSize: 12,
            textAlign: 'center',
            marginBottom: 10,
            backgroundColor: colors.surfaceVariant,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
        },
        backButton: {
            padding: 8,
        },
        switchCameraIcon: {
            padding: 8,
        },
        switchCameraText: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        captureButton: {
            padding: 16,
            borderRadius: 50,
            borderWidth: 3,
            borderColor: colors.onSurface,
        },
    }); 