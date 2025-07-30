import { Alert, Platform, Linking } from 'react-native';
import { Camera as VisionCamera } from 'react-native-vision-camera';

export class CameraPermissionHandler {
  static async checkPermission() {
    try {
      const status = await VisionCamera.getCameraPermissionStatus();
      return status;
    } catch (error) {
      return 'denied';
    }
  }

  static async requestPermission() {
    try {
      const permission = await VisionCamera.requestCameraPermission();
      return permission;
    } catch (error) {
      return 'denied';
    }
  }

  static async ensurePermission(onGranted, onDenied) {
    try {
      // First check current status
      const currentStatus = await this.checkPermission();
      
      if (currentStatus === 'granted') {
        onGranted && onGranted();
        return true;
      }
      
      // If not granted, request permission
      const permission = await this.requestPermission();
      
      if (permission === 'granted') {
        onGranted && onGranted();
        return true;
      } else {
        // Show alert with settings option
        this.showPermissionAlert(onDenied);
        onDenied && onDenied();
        return false;
      }
    } catch (error) {
      // Don't show alert on error, just call onDenied
      onDenied && onDenied();
      return false;
    }
  }

  static showPermissionAlert(onDenied) {
    Alert.alert(
      "Camera Permission Required",
      "Camera access is required for face recognition. Please enable it in your device settings.",
      [
        { 
          text: "Cancel", 
          onPress: () => {
            onDenied && onDenied();
          },
          style: 'cancel'
        },
        { 
          text: "Settings", 
          onPress: () => {
            this.openSettings();
          }
        }
      ]
    );
  }

  static openSettings() {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }

  static getPermissionStatusText(status) {
    switch (status) {
      case 'granted':
        return 'Camera access granted';
      case 'denied':
        return 'Camera access denied';
      case 'restricted':
        return 'Camera access restricted';
      case 'not-determined':
        return 'Camera permission not determined';
      default:
        return 'Unknown permission status';
    }
  }

  // New method to proactively request permission on app start
  static async initializePermissions() {
    try {
      const status = await this.checkPermission();
      
      if (status === 'not-determined') {
        const permission = await this.requestPermission();
        return permission;
      }
      
      return status;
    } catch (error) {
      return 'denied';
    }
  }
} 