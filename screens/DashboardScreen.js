// screens/DashboardScreen.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, useTheme, Portal, Modal, Button } from "react-native-paper";
import {
  TrendingUp,
  Clock,
  Calendar,
  UserCheck,
  UserX,
  AlertCircle
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import components
import ProfileHeader from "../components/ProfileHeader";
import DashboardCard from "../components/DashboardCard";
import AttendanceButton from "../components/AttendanceButton";
import { DrawerContext } from "../context/DrawerContext";
import { useAttendance } from "../context/AttendanceContext";
import { getCommonStyles } from "../constants/commonStyles";

// Import API Factory
import Factory from "../utils/Factory";

export default function DashboardScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const commonStyles = getCommonStyles(colors);
  const [todaysAttendance, setTodaysAttendance] = useState([]);
  const [currentCheckInTime, setCurrentCheckInTime] = useState(null);
  const { toggleTheme, isDarkMode } = useContext(DrawerContext);
  const { currentAttendanceStatus, markAttendance, getAttendanceStats, setCurrentAttendanceStatus } =
    useAttendance();

  const getIconComponent = (iconName) => {
    const iconMap = {
      'trending-up': TrendingUp,
      'clock': Clock,
      'calendar': Calendar,
      'user-check': UserCheck,
      'user-x': UserX,
      'alert-circle': AlertCircle
    };
    return iconMap[iconName] || TrendingUp;
  };

  // State management
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API calls
  const [dashboardData, setDashboardData] = useState({
    totalLeaves: 15,
    leavesTaken: 8,
    upcomingHolidays: 2,
    leaveBalances: [
      { type: "Casual", used: 3, total: 10 },
      { type: "Sick", used: 2, total: 15 },
      { type: "Earned", used: 3, total: 20 }
    ],
    leaveRequests: [
      {
        id: 1,
        type: "Casual",
        startDate: "2024-01-20",
        endDate: "2024-01-20",
        reason: "Personal appointment",
        status: "approved"
      },
      {
        id: 2,
        type: "Sick",
        startDate: "2024-01-25",
        endDate: "2024-01-26",
        reason: "Medical emergency",
        status: "pending"
      }
    ],
    events: [
      {
        date: "2024-01-26",
        title: "Republic Day",
        type: "holiday"
      },
      {
        date: "2024-01-30",
        title: "Team Meeting",
        type: "event"
      }
    ]
  });



  // Handlers
  const onRefresh = async () => {
  };

  const handleMarkAttendance = async () => {
    await markAttendance();
  };

  const getTodaysAttendance = async () => {
    const response = await Factory('get', '/payroll/today/', {}, {}, {});
    if (response.status_cd === 1) {
      let attendanceLogs = response.data.logs;
      setTodaysAttendance(attendanceLogs);

      if (attendanceLogs.length > 0) {
        const latestLog = attendanceLogs[attendanceLogs.length - 1];

        if (latestLog.check_out === null) {
          console.tron.log('User is clocked in since:', latestLog.check_in);
          setCurrentAttendanceStatus("clocked-in");
          setCurrentCheckInTime(latestLog.check_in);
        } else {
          console.tron.log('User is clocked out at:', latestLog.check_out);
          setCurrentAttendanceStatus("clocked-out");
          setCurrentCheckInTime(null);
        }
      }
    };
  }

  const renderOverview = () => (
    <View style={[styles.section, styles.firstSection]}>
      <Text variant="titleLarge" style={styles.sectionTitle}>
        Dashboard Overview
      </Text>

      <View style={styles.cardsGrid}>
        <DashboardCard
          title="Today's Status"
          value={
            currentAttendanceStatus === "clocked-in" ? "Present" : "Not Marked"
          }
          subtitle="Attendance status"
          icon="account-check"
          status={
            currentAttendanceStatus === "clocked-in" ? "success" : "warning"
          }
        />

        <DashboardCard
          title="Leave Balance"
          value={`${dashboardData.totalLeaves - dashboardData.leavesTaken}`}
          subtitle={`${dashboardData.leavesTaken} days taken`}
          icon="calendar-clock"
          status="info"
        />

        <DashboardCard
          title="Upcoming Events"
          value={dashboardData.upcomingHolidays}
          subtitle="Holidays this month"
          icon="calendar-star"
          status="info"
        />
      </View>

      <AttendanceButton
        onMarkAttendance={handleMarkAttendance}
        currentStatus={currentAttendanceStatus}
        checkInTimeFromAPI={currentCheckInTime}
      />
    </View>
  );

  useEffect(() => {
    getTodaysAttendance();
  }, []);

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
      <ProfileHeader onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={commonStyles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
      >
        {renderOverview()}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    content: {
      flex: 1
    },
    section: {
      marginBottom: 24
    },
    firstSection: {
      marginTop: 8
    },
    sectionTitle: {
      color: colors.onSurface,
      marginBottom: 16,
      fontWeight: "600"
    },
    cardsGrid: {
      gap: 12,
      marginBottom: 20
    }
  });
