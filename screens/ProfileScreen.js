import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  Alert,
  Modal,
  Dimensions
} from "react-native";
import {
  Text,
  useTheme,
  Avatar,
  Card,
  List,
  Switch,
  Button,
  Divider,
  IconButton
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import {
  User,
  Settings,
  LogOut,
  Bell,
  Calendar,
  Clock,
  FileText,
  Sun,
  Moon,
  Fingerprint,
  Edit,
  ChevronRight,
  Lock,
  Shield,
  HelpCircle
} from "lucide-react-native";
import { DrawerContext } from "../context/DrawerContext";
import { getCommonStyles } from "../constants/commonStyles";


export default function ProfileScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { colors } = useTheme();
  const { toggleTheme, isDarkMode } = useContext(DrawerContext);
  const styles = getStyles(colors);
  const commonStyles = getCommonStyles(colors);
  const { logout } = useContext(AuthContext);

  const getIconComponent = (iconName) => {
    const iconMap = {
      'account': User,
      'account-details': User,
      'email': FileText,
      'phone': FileText,
      'cog': Settings,
      'account-cog': Settings,
      'card-account-details': User,
      'calendar': Calendar,
      'account-group': User,
      'map-marker': FileText,
      'theme-light-dark': isDarkMode ? Sun : Moon,
      'bell': Bell,
      'fingerprint': Fingerprint,
      'account-edit': Edit,
      'chevron-right': ChevronRight,
      'lock-reset': Lock,
      'shield-account': Shield,
      'help-circle': HelpCircle,
      'logout': LogOut
    };
    return iconMap[iconName] || User;
  };

  // State management
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);





  // Get user data from AuthContext
  const userProfile = {
    name: user?.name || "User",
    email: user?.email || "user@company.com",
    phone: user?.mobileNumber || "Phone",
    employeeId: user?.employeeId || "Employee ID",
    designation: user?.designation || "Designation",
    department: user?.department || "Department",
    team: "Frontend Development",
    joinDate: user?.joinDate || "Unknown",
    manager: "Sarah Johnson",
    location: user?.location || "Location",
    avatar: user?.name ? user.name.substring(0, 2).toUpperCase() : "U"
  };

  // Handlers
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    console.log("Edit profile pressed");
  };

  const handleChangePassword = () => {
    // Navigate to change password screen
    console.log("Change password pressed");
  };

  // Face registration configuration
  const faceAngles = [
    { key: 'front', name: 'Front Face', description: 'Look straight at the camera' },
    { key: 'left', name: 'Left Profile', description: 'Turn your head to the left' },
    { key: 'right', name: 'Right Profile', description: 'Turn your head to the right' },
    { key: 'chinup', name: 'Chin Up', description: 'Tilt your head up slightly' },
    { key: 'chindown', name: 'Chin Down', description: 'Tilt your head down slightly' }
  ];



  return (
    <SafeAreaView
      style={commonStyles.container}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
        translucent={false}
      />
      <View style={commonStyles.header}>
        <View style={commonStyles.headerSide}>
          {React.createElement(getIconComponent("account"), {
            size: 24,
            style: commonStyles.headIcon
          })}
          <Text variant="headlineMedium" style={commonStyles.headerTitle}>
            Profile
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
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar.Text
            size={80}
            label={userProfile.avatar}
            style={styles.avatar}
            color={colors.onPrimary}
          />
          <View style={styles.profileInfo}>
            <Text variant="headlineSmall" style={styles.userName}>
              {userProfile.name}
            </Text>
            <Text variant="titleMedium" style={styles.userDesignation}>
              {userProfile.designation}
            </Text>
            <Text variant="bodyMedium" style={styles.userDepartment}>
              {userProfile.department} • {userProfile.team}
            </Text>
          </View>
        </View>

        {/* Personal Information */}
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <View style={styles.cardHeader}>
              {React.createElement(getIconComponent("account-details"), {
                size: 20,
                color: colors.primary
              })}
              <Text variant="titleMedium" style={styles.cardTitle}>
                Personal Information
              </Text>
            </View>

            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                {React.createElement(getIconComponent("email"), {
                  size: 16,
                  color: colors.onSurfaceVariant
                })}
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  Email
                </Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {userProfile.email}
                </Text>
              </View>

              <View style={styles.infoItem}>
                {React.createElement(getIconComponent("phone"), {
                  size: 16,
                  color: colors.onSurfaceVariant
                })}
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  Phone
                </Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {userProfile.phone}
                </Text>
              </View>

              <View style={styles.infoItem}>
                {React.createElement(getIconComponent("card-account-details"), {
                  size: 16,
                  color: colors.onSurfaceVariant
                })}
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  Employee ID
                </Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {userProfile.employeeId}
                </Text>
              </View>

              <View style={styles.infoItem}>
                {React.createElement(getIconComponent("calendar"), {
                  size: 16,
                  color: colors.onSurfaceVariant
                })}
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  Join Date
                </Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {new Date(userProfile.joinDate).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.infoItem}>
                {React.createElement(getIconComponent("account-group"), {
                  size: 16,
                  color: colors.onSurfaceVariant
                })}
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  Manager
                </Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {userProfile.manager}
                </Text>
              </View>

              <View style={styles.infoItem}>
                {React.createElement(getIconComponent("map-marker"), {
                  size: 16,
                  color: colors.onSurfaceVariant
                })}
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  Location
                </Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {userProfile.location}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <View style={styles.cardHeader}>
              {React.createElement(getIconComponent("cog"), {
                size: 20,
                color: colors.primary
              })}
              <Text variant="titleMedium" style={styles.cardTitle}>
                Settings
              </Text>
            </View>

            <List.Item
              title="Dark Mode"
              description="Toggle dark/light theme"
              left={(props) => (
                <View style={[props.style, { marginRight: 8 }]}>
                  {React.createElement(getIconComponent("theme-light-dark"), {
                    size: 24,
                    color: colors.onSurfaceVariant
                  })}
                </View>
              )}
              right={() => (
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  color={colors.primary}
                />
              )}
              style={styles.listItem}
            />

            <Divider />

            <List.Item
              title="Notifications"
              description="Enable push notifications"
              left={(props) => (
                <View style={[props.style, { marginRight: 8 }]}>
                  {React.createElement(getIconComponent("bell"), {
                    size: 24,
                    color: colors.onSurfaceVariant
                  })}
                </View>
              )}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  color={colors.primary}
                />
              )}
              style={styles.listItem}
            />

            <Divider />


            <List.Item
              title="Biometric Login"
              description="Use fingerprint or face ID"
              left={(props) => (
                <View style={[props.style, { marginRight: 8 }]}>
                  {React.createElement(getIconComponent("fingerprint"), {
                    size: 24,
                    color: colors.onSurfaceVariant
                  })}
                </View>
              )}
              right={() => (
                <Switch
                  value={biometricEnabled}
                  onValueChange={setBiometricEnabled}
                  color={colors.primary}
                />
              )}
              style={styles.listItem}
            />

          </Card.Content>
        </Card>

        {/* Account Actions */}
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <View style={styles.cardHeader}>
              {React.createElement(getIconComponent("account-cog"), {
                size: 20,
                color: colors.primary
              })}
              <Text variant="titleMedium" style={styles.cardTitle}>
                Account
              </Text>
            </View>

            <List.Item
              title="Edit Profile"
              description="Update personal information"
              left={(props) => (
                <View style={[props.style, { marginRight: 8 }]}>
                  {React.createElement(getIconComponent("account-edit"), {
                    size: 24,
                    color: colors.onSurfaceVariant
                  })}
                </View>
              )}
              right={(props) => (
                <View style={[props.style, { marginLeft: 8 }]}>
                  {React.createElement(getIconComponent("chevron-right"), {
                    size: 24,
                    color: colors.onSurfaceVariant
                  })}
                </View>
              )}
              onPress={handleEditProfile}
              style={styles.listItem}
            />

            <Divider />

            <List.Item
              title="Change Password"
              description="Update your password"
              left={(props) => (
                <View style={[props.style, { marginRight: 8 }]}>
                  {React.createElement(getIconComponent("lock-reset"), {
                    size: 24,
                    color: colors.onSurfaceVariant
                  })}
                </View>
              )}
              right={(props) => (
                <View style={[props.style, { marginLeft: 8 }]}>
                  {React.createElement(getIconComponent("chevron-right"), {
                    size: 24,
                    color: colors.onSurfaceVariant
                  })}
                </View>
              )}
              onPress={handleChangePassword}
              style={styles.listItem}
            />

            <Divider />

            <List.Item
              title="Privacy Policy"
              description="View privacy settings"
              left={(props) => (
                <View style={[props.style, { marginRight: 8 }]}>
                  {React.createElement(getIconComponent("shield-account"), {
                    size: 24,
                    color: colors.onSurfaceVariant
                  })}
                </View>
              )}
              right={(props) => (
                <View style={[props.style, { marginLeft: 8 }]}>
                  {React.createElement(getIconComponent("chevron-right"), {
                    size: 24,
                    color: colors.onSurfaceVariant
                  })}
                </View>
              )}
              style={styles.listItem}
            />

            <Divider />

            <List.Item
              title="Help & Support"
              description="Get help and contact support"
              left={(props) => (
                <View style={[props.style, { marginRight: 8 }]}>
                  {React.createElement(getIconComponent("help-circle"), {
                    size: 24,
                    color: colors.onSurfaceVariant
                  })}
                </View>
              )}
              right={(props) => (
                <View style={[props.style, { marginLeft: 8 }]}>
                  {React.createElement(getIconComponent("chevron-right"), {
                    size: 24,
                    color: colors.onSurfaceVariant
                  })}
                </View>
              )}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              style={styles.logoutItem}
              title="Logout"
              description="Logout from your account"
              left={(props) => (
                <View style={[props.style, { marginRight: 8 }]}>
                  {React.createElement(getIconComponent("logout"), {
                    size: 24,
                    color: colors.error
                  })}
                </View>
              )}
              right={(props) => (
                <View style={[props.style, { marginLeft: 8 }]}>
                  {React.createElement(getIconComponent("chevron-right"), {
                    size: 24,
                    color: colors.error
                  })}
                </View>
              )}
              onPress={logout}
            />
          </Card.Content>
        </Card>
      </ScrollView>


    </SafeAreaView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.container
    },

    content: {
      flex: 1
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 100,
      flexGrow: 1
    },
    profileHeader: {
      alignItems: "center",
      paddingVertical: 24,
      marginBottom: 16
    },
    avatar: {
      backgroundColor: colors.primary,
      marginBottom: 16
    },
    profileInfo: {
      alignItems: "center"
    },
    userName: {
      color: colors.onSurface,
      fontWeight: "600",
      marginBottom: 4
    },
    userDesignation: {
      color: colors.primary,
      fontWeight: "500",
      marginBottom: 4
    },
    userDepartment: {
      color: colors.onSurfaceVariant,
      textAlign: "center"
    },
    card: {
      marginBottom: 16
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16
    },
    cardTitle: {
      marginLeft: 8,
      color: colors.onSurface,
      fontWeight: "600"
    },
    infoList: {
      gap: 12
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12
    },
    infoLabel: {
      color: colors.onSurfaceVariant,
      minWidth: 80
    },
    infoValue: {
      color: colors.onSurface,
      flex: 1,
      fontWeight: "500"
    },
    listItem: {
      paddingVertical: 4
    },
    logoutItem: {
      paddingVertical: 4
    },
  });
