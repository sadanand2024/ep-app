import { Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Get safe area insets for different edges
export const useSafeArea = () => {
  const insets = useSafeAreaInsets();
  
  return {
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
    // Helper for common padding
    padding: {
      top: insets.top,
      bottom: insets.bottom,
      horizontal: Math.max(insets.left, insets.right),
    },
    // Helper for margins
    margin: {
      top: insets.top,
      bottom: insets.bottom,
      horizontal: Math.max(insets.left, insets.right),
    }
  };
};

// Configure status bar for different screens
export const configureStatusBar = (isDarkMode = false, backgroundColor = null) => {
  StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
  
  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor(backgroundColor || 'transparent');
    StatusBar.setTranslucent(true);
  }
};

// Get status bar height
export const getStatusBarHeight = () => {
  if (Platform.OS === 'ios') {
    return 44; // iOS status bar height
  } else {
    return StatusBar.currentHeight || 24; // Android status bar height
  }
};

// Safe area styles for different components
export const getSafeAreaStyles = (insets, options = {}) => {
  const {
    includeTop = true,
    includeBottom = true,
    includeLeft = false,
    includeRight = false,
    padding = 0,
  } = options;

  return {
    paddingTop: includeTop ? (insets.top + padding) : padding,
    paddingBottom: includeBottom ? (insets.bottom + padding) : padding,
    paddingLeft: includeLeft ? (insets.left + padding) : padding,
    paddingRight: includeRight ? (insets.right + padding) : padding,
  };
};

// Common safe area configurations
export const safeAreaConfigs = {
  // For screens with headers
  screen: {
    edges: ['top', 'left', 'right'],
    includeBottom: false,
  },
  // For full screen content
  fullScreen: {
    edges: ['top', 'left', 'right', 'bottom'],
    includeBottom: true,
  },
  // For modals
  modal: {
    edges: ['top', 'left', 'right', 'bottom'],
    includeBottom: true,
  },
  // For bottom sheets
  bottomSheet: {
    edges: ['left', 'right', 'bottom'],
    includeTop: false,
  },
};

// Platform-specific adjustments
export const platformAdjustments = {
  android: {
    statusBarHeight: StatusBar.currentHeight || 24,
    navigationBarHeight: 48,
    // Additional padding for Android devices with notches
    notchPadding: 8,
  },
  ios: {
    statusBarHeight: 44,
    navigationBarHeight: 0,
    notchPadding: 0,
  },
};

// Get platform-specific adjustments
export const getPlatformAdjustments = () => {
  return platformAdjustments[Platform.OS] || platformAdjustments.android;
}; 