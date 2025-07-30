// navigation/MainStack.js
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerLayout } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DashboardScreen from "../screens/DashboardScreen";
import AttendanceScreen from "../screens/AttendanceScreen";
import LeaveScreen from "../screens/LeaveScreen";
import CalendarScreen from "../screens/CalendarScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { DrawerContext } from "../context/DrawerContext";
import CustomDrawer from "../components/CustomDrawer";
import {
  LayoutDashboard,
  History,
  Calendar,
  CalendarDays,
  User
} from "lucide-react-native";

const Tab = createBottomTabNavigator();

export default function MainStack() {
  const { drawerRef } = useContext(DrawerContext);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <DrawerLayout
      ref={drawerRef}
      drawerWidth={350}
      drawerPosition="right"
      renderNavigationView={() => <CustomDrawer />}
      edgeWidth={150} // swipe zone
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            const iconMap = {
              Overview: <LayoutDashboard color={color} size={size} />,
              Attendance: <History color={color} size={size} />,
              Leave: <Calendar color={color} size={size} />,
              Calendar: <CalendarDays color={color} size={size} />,
              Profile: <User color={color} size={size} />
            };
            return iconMap[route.name] || null;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.onSurfaceVariant,
          tabBarStyle: {
            height: 60 + insets.bottom,
            paddingBottom: 12 + insets.bottom,
            paddingTop: 8,
            paddingHorizontal: 8,
            backgroundColor: colors.surface,
            borderTopColor: colors.outline,
            borderTopWidth: 1
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            color: colors.onSurface
          }
        })}
      >
        <Tab.Screen
          name="Overview"
          component={DashboardScreen}
          options={{
            tabBarLabel: "Overview"
          }}
        />
        <Tab.Screen
          name="Attendance"
          component={AttendanceScreen}
          options={{
            tabBarLabel: "Attendance"
          }}
        />
        <Tab.Screen
          name="Leave"
          component={LeaveScreen}
          options={{
            tabBarLabel: "Leave"
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            tabBarLabel: "Calendar"
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile"
          }}
        />
      </Tab.Navigator>
    </DrawerLayout>
  );
}
