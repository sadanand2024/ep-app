import { StyleSheet, Platform } from "react-native";

export const getCommonStyles = (colors) =>
  StyleSheet.create({
    // Header style for all screens
    content: {
      flex: 1
    },
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.background,
      // Platform-specific bottom shadow/elevation
      ...(Platform.OS === "android"
        ? {
          borderBottomWidth: 2,
          borderBottomColor: colors.borderColor
        }
        : {
          shadowColor: "#000", // iOS shadow
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.1,
          shadowRadius: 4
        })
    },

    // Header title style
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.onSurface
    },

    // Header left/right container
    headerSide: {
      flexDirection: "row",
      alignItems: "center"
    },
    headIcon: {
      marginRight: 12,
      color: colors.primary,
      fontSize: 28
    },
    // Common button styles
    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 12
    },

    primaryButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF"
    },

    // Common card styles
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4
    },

    // Common input styles
    input: {
      backgroundColor: colors.surface,
      fontSize: 16,
      color: colors.onSurface,
      selectionColor: colors.primary,
      paddingHorizontal: 16,
      tintColor: colors.primary,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 100,
      flexGrow: 1
    }
  });
