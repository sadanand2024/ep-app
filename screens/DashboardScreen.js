// screens/DashboardScreen.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar
} from "react-native";
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
  const { toggleTheme, isDarkMode } = useContext(DrawerContext);
  const { currentAttendanceStatus, markAttendance, getAttendanceStats } =
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

  // API Functions
  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');

      // Fetch dashboard overview
      const dashboardResponse = await Factory('get', '/dashboard/overview');
      console.log('Dashboard Response:', dashboardResponse);

      if (dashboardResponse.res.status_cd === 0) {
        setDashboardData(dashboardResponse.res.data);
      } else {
        console.error('Dashboard API Error:', dashboardResponse.message);
      }

      // Fetch leave balances
      const leaveBalanceResponse = await Factory('get', '/leaves/balance');
      console.log('Leave Balance Response:', leaveBalanceResponse);

      if (leaveBalanceResponse.res.status_cd === 0) {
        setDashboardData(prev => ({
          ...prev,
          leaveBalances: leaveBalanceResponse.res.data.balances || []
        }));
      }

      // Fetch upcoming events
      const eventsResponse = await Factory('get', '/events/upcoming');
      console.log('Events Response:', eventsResponse);

      if (eventsResponse.res.status_cd === 0) {
        setDashboardData(prev => ({
          ...prev,
          events: eventsResponse.res.data.events || []
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchHolidayCalendar = async () => {
    try {
      const response = await Factory('get', '/payroll/holiday-calendar/?year=2025', {}, {}, {});

      console.log('Leave Requests Response:', response);

      // if (response.res.status_cd === 0) {
      //   setDashboardData(prev => ({
      //     ...prev,
      //     leaveRequests: response.res.data.requests || []
      //   }));
      // }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  // Handlers
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHolidayCalendar();
    setRefreshing(false);
  };

  const handleMarkAttendance = async () => {
    await markAttendance();
  };

  // Load data on component mount
  useEffect(() => {
    fetchHolidayCalendar();
  }, []);

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
      />
    </View>
  );

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
