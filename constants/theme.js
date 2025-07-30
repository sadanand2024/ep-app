import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

const lightColors = {
  primary: "#2196f3",
  onPrimary: "#ffffff",
  primaryContainer: "#e3f2fd",
  secondary: "#673ab7",
  onSecondary: "#ffffff",
  secondaryContainer: "#ede7f6",
  background: "#eef2f6",
  container: "#eef2f6",
  surface: "#ffffff",
  error: "#f44336",
  onError: "#ffffff",
  outline: "#cccccc",
  surfaceVariant: "#eef2f6",
  onSurface: "#364152",
  text: "#121926",
  drawerColor: "#ffffff",
  borderColor: "#d2d6d9c9"
};

const darkColors = {
  primary: "#90caf9",
  onPrimary: "#000000",
  primaryContainer: "#1976d2",
  onPrimaryContainer: "#ffffff",
  secondary: "#b39ddb",
  onSecondary: "#000000",
  secondaryContainer: "#512da8",
  onSecondaryContainer: "#ffffff",
  background: "#121212",
  container: "#121212",
  onBackground: "#ffffff",
  surface: "#1e1e1e",
  onSurface: "#ffffff",
  surfaceVariant: "#2d2d2d",
  onSurfaceVariant: "#e0e0e0",
  error: "#ff6b6b",
  onError: "#000000",
  errorContainer: "#8b0000",
  onErrorContainer: "#ffffff",
  outline: "#6b7280",
  outlineVariant: "#374151",
  shadow: "#000000",
  scrim: "#000000",
  inverseSurface: "#f5f5f5",
  inverseOnSurface: "#1a1a1a",
  inversePrimary: "#1976d2",
  borderColor: "#4e5053",
  elevation: {
    level0: "transparent",
    level1: "#1e1e1e",
    level2: "#2d2d2d",
    level3: "#3d3d3d",
    level4: "#4d4d4d",
    level5: "#5d5d5d"
  },
  drawerColor: "#1e1e1e"
};

// Status color configurations for light and dark themes
const statusConfigs = {
  light: {
    // Attendance Status Colors
    attendance: {
      "clocked-in": {
        primary: "#4caf50",
        secondary: "#e8f5e8",
        text: "#2e7d32",
        icon: "#4caf50",
        background: "#f1f8e9"
      },
      "clocked-out": {
        primary: "#f44336",
        secondary: "#ffebee",
        text: "#c62828",
        icon: "#f44336",
        background: "#ffebee"
      },
      "not-marked": {
        primary: "#ff9800",
        secondary: "#fff3e0",
        text: "#ef6c00",
        icon: "#ff9800",
        background: "#fff3e0"
      },
      "late": {
        primary: "#ff5722",
        secondary: "#fbe9e7",
        text: "#d84315",
        icon: "#ff5722",
        background: "#fbe9e7"
      },
      "present": {
        primary: "#4caf50",
        secondary: "#e8f5e8",
        text: "#2e7d32",
        icon: "#4caf50",
        background: "#f1f8e9"
      }
    },
    // Leave Request Status Colors
    leave: {
      "approved": {
        primary: "#4caf50",
        secondary: "#e8f5e8",
        text: "#2e7d32",
        icon: "#4caf50",
        background: "#f1f8e9"
      },
      "rejected": {
        primary: "#f44336",
        secondary: "#ffebee",
        text: "#c62828",
        icon: "#f44336",
        background: "#ffebee"
      },
      "pending": {
        primary: "#ff9800",
        secondary: "#fff3e0",
        text: "#ef6c00",
        icon: "#ff9800",
        background: "#fff3e0"
      }
    },
    // Verification Status Colors
    verification: {
      "approved": {
        primary: "#4caf50",
        secondary: "#e8f5e8",
        text: "#2e7d32",
        icon: "#4caf50",
        background: "#f1f8e9"
      },
      "rejected": {
        primary: "#f44336",
        secondary: "#ffebee",
        text: "#c62828",
        icon: "#f44336",
        background: "#ffebee"
      },
      "pending": {
        primary: "#2196f3",
        secondary: "#e3f2fd",
        text: "#1565c0",
        icon: "#2196f3",
        background: "#e3f2fd"
      }
    }
  },
  dark: {
    // Attendance Status Colors
    attendance: {
      "clocked-in": {
        primary: "#4caf50",
        secondary: "#1e3a1e",
        text: "#81c784",
        icon: "#4caf50",
        background: "#1e3a1e"
      },
      "clocked-out": {
        primary: "#f44336",
        secondary: "#3d1a1a",
        text: "#e57373",
        icon: "#f44336",
        background: "#3d1a1a"
      },
      "not-marked": {
        primary: "#ff9800",
        secondary: "#3d2c1a",
        text: "#ffb74d",
        icon: "#ff9800",
        background: "#3d2c1a"
      },
      "late": {
        primary: "#ff5722",
        secondary: "#3d1f1a",
        text: "#ff8a65",
        icon: "#ff5722",
        background: "#3d1f1a"
      },
      "present": {
        primary: "#4caf50",
        secondary: "#1e3a1e",
        text: "#81c784",
        icon: "#4caf50",
        background: "#1e3a1e"
      }
    },
    // Leave Request Status Colors
    leave: {
      "approved": {
        primary: "#4caf50",
        secondary: "#1e3a1e",
        text: "#81c784",
        icon: "#4caf50",
        background: "#1e3a1e"
      },
      "rejected": {
        primary: "#f44336",
        secondary: "#3d1a1a",
        text: "#e57373",
        icon: "#f44336",
        background: "#3d1a1a"
      },
      "pending": {
        primary: "#ff9800",
        secondary: "#3d2c1a",
        text: "#ffb74d",
        icon: "#ff9800",
        background: "#3d2c1a"
      }
    },
    // Verification Status Colors
    verification: {
      "approved": {
        primary: "#4caf50",
        secondary: "#1e3a1e",
        text: "#81c784",
        icon: "#4caf50",
        background: "#1e3a1e"
      },
      "rejected": {
        primary: "#f44336",
        secondary: "#3d1a1a",
        text: "#e57373",
        icon: "#f44336",
        background: "#3d1a1a"
      },
      "pending": {
  primary: "#2196f3",
        secondary: "#1a2e3d",
        text: "#64b5f6",
        icon: "#2196f3",
        background: "#1a2e3d"
      }
    }
  }
};

/**
 * Get status configuration with theme-appropriate colors
 * @param {string} status - The status value (e.g., "approved", "pending", "clocked-in")
 * @param {string} category - The status category ("attendance", "leave", "verification")
 * @param {boolean} isDarkMode - Whether dark mode is active
 * @returns {Object} Status configuration with colors
 */
export const getStatusConfig = (status, category = "attendance", isDarkMode = false) => {
  const theme = isDarkMode ? "dark" : "light";
  const configs = statusConfigs[theme];
  
  if (!configs || !configs[category] || !configs[category][status]) {
    // Return default colors if status not found
    const defaultColors = isDarkMode ? darkColors : lightColors;
    return {
      primary: defaultColors.primary,
      secondary: defaultColors.surfaceVariant,
      text: defaultColors.onSurface,
      icon: defaultColors.primary,
      background: defaultColors.surfaceVariant
    };
  }
  
  return configs[category][status];
};

/**
 * Get status color for a specific status
 * @param {string} status - The status value
 * @param {string} category - The status category
 * @param {boolean} isDarkMode - Whether dark mode is active
 * @param {string} colorType - The color type to return ("primary", "secondary", "text", "icon", "background")
 * @returns {string} The color value
 */
export const getStatusColor = (status, category = "attendance", isDarkMode = false, colorType = "primary") => {
  const config = getStatusConfig(status, category, isDarkMode);
  return config[colorType] || config.primary;
};

export const AppLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...lightColors
  }
};

export const AppDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkColors
  }
};
