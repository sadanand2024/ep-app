// navigation/MainStack.js
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { DrawerLayout } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DashboardScreen from "../screens/DashboardScreen";
import AttendanceScreen from "../screens/AttendanceScreen";
import LeaveScreen from "../screens/LeaveScreen";
import CalendarScreen from "../screens/CalendarScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TaxTDSScreen from "../screens/TaxTDS";
import PayslipsScreen from "../screens/Payslips";
import PayslipViewScreen from "../screens/Payslips/PayslipView";
import MyEarningsScreen from "../screens/MyEarnings";
import PersonalInfoScreen from "../screens/Settings/PersonalInfo";
import { DrawerContext } from "../context/DrawerContext";
import CustomDrawer from "../components/CustomDrawer";
import {
  LayoutDashboard,
  History,
  Calendar,
  CalendarDays,
  User
} from "lucide-react-native";
import { getCommonStyles } from "../constants/commonStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import ChangePasswordScreen from "../screens/Settings/ChangePassword";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            overview: <LayoutDashboard color={color} size={size} />,
            attendance: <History color={color} size={size} />,
            leave: <Calendar color={color} size={size} />,
            calendar: <CalendarDays color={color} size={size} />,
            profile: <User color={color} size={size} />
          };
          return iconMap[route.name] || null;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: 12 + insets.bottom,
          paddingTop: 12,
          backgroundColor: colors.surface,
          borderTopColor: colors.outline,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          color: colors.onSurface,
          textAlign: 'center'
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }
      })}
    >
      <Tab.Screen
        name="overview"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Home"
        }}
      />
      <Tab.Screen
        name="attendance"
        component={AttendanceScreen}
        options={{
          tabBarLabel: "Attendance"
        }}
      />
      <Tab.Screen
        name="leave"
        component={LeaveScreen}
        options={{
          tabBarLabel: "Leave"
        }}
      />
      <Tab.Screen
        name="calendar"
        component={CalendarScreen}
        options={{
          tabBarLabel: "Calendars"
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile"
        }}
      />
    </Tab.Navigator>
  );
}

export default function MainStack() {
  const { drawerRef } = useContext(DrawerContext);
  const { isDarkMode } = useContext(DrawerContext);
  const { colors } = useTheme();
  const commonStyles = getCommonStyles(colors);

  return (
    <DrawerLayout
      ref={drawerRef}
      drawerWidth={350}
      drawerPosition="right"
      renderNavigationView={() => <CustomDrawer />}
      edgeWidth={150}
    >
      <SafeAreaView
        style={commonStyles.container}
        edges={["top", "left", "right"]}
      >
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={colors.background}
          translucent={false}
        />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: true
          }}
        >
          {/* Main Tab Navigation */}
          <Stack.Screen
            name="mainTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />

          {/* Additional Screens - Add all your pages here */}
          <Stack.Screen
            name="taxtds"
            component={TaxTDSScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="myEarnings"
            component={MyEarningsScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="personalInfo"
            component={PersonalInfoScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="payslips"
            component={PayslipsScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="PayslipView"
            component={PayslipViewScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="changePassword"
            component={ChangePasswordScreen}
            options={{ headerShown: false }}
          />

          {/* You can add more screens here */}
          {/* <Stack.Screen name="SalaryDetails" component={SalaryDetailsScreen} /> */}
          {/* <Stack.Screen name="Documents" component={DocumentsScreen} /> */}
          {/* <Stack.Screen name="Policies" component={PoliciesScreen} /> */}
          {/* <Stack.Screen name="Notifications" component={NotificationsScreen} /> */}
          {/* <Stack.Screen name="HelpSupport" component={HelpSupportScreen} /> */}

        </Stack.Navigator>
      </SafeAreaView>
    </DrawerLayout>
  );
}
