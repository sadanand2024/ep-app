import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar
} from "react-native";
import { Text, useTheme, Portal, Modal, Button } from "react-native-paper";
import {
  Clock,
  Calendar,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerContext } from "../context/DrawerContext";
import { getCommonStyles } from "../constants/commonStyles";

// Import components
import PageHeader from "../components/PageHeader";
import AttendanceButton from "../components/AttendanceButton";
import AttendanceHistory from "../components/AttendanceHistory";
import { useAttendance } from "../context/AttendanceContext";
import Factory from "../utils/Factory";

export default function AttendanceScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const commonStyles = getCommonStyles(colors);
  const { isDarkMode } = useContext(DrawerContext);
  const { currentAttendanceStatus } = useAttendance();

  // State management
  const [refreshing, setRefreshing] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCheckInTime, setCurrentCheckInTime] = useState(null);

  const getIconComponent = (iconName) => {
    const iconMap = {
      'clock': Clock,
      'calendar': Calendar,
      'user-check': UserCheck,
      'user-x': UserX,
      'alert-circle': AlertCircle,
      'check-circle': CheckCircle,
      'clock-check': Clock
    };
    return iconMap[iconName] || Clock;
  };

  // Fetch attendance records from API
  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1; // 1-12
      const year = currentDate.getFullYear();

      const response = await Factory('get', `/payroll/monthly-report/?month=${month}&year=${year}`, {}, {}, {});
      console.tron.log(response);
      if (response.status_cd === 1 && response.data && response.data.report) {
        setAttendanceRecords(response.data.report);
      } else {
        setAttendanceRecords([]);
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      // Set empty array on error
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Get today's attendance data
  const getTodaysAttendance = async () => {
    try {
      const response = await Factory('get', '/payroll/today/', {}, {}, {});
      if (response.status_cd === 1) {
        let attendanceLogs = response.data.logs;
        if (attendanceLogs && attendanceLogs.length > 0) {
          const latestLog = attendanceLogs[attendanceLogs.length - 1];
          if (latestLog.check_out === null) {
            setCurrentCheckInTime(latestLog.check_in);
          } else {
            setCurrentCheckInTime(null);
          }
        } else {
          setCurrentCheckInTime(null);
        }
      }
    } catch (error) {
      console.error('Error fetching today\'s attendance:', error);
      setCurrentCheckInTime(null);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAttendanceRecords();
    getTodaysAttendance();
  }, []);

  // Handlers
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAttendanceRecords();
    await getTodaysAttendance();
    setRefreshing(false);
  };

  const handleMarkAttendance = async () => {
    // This function will be called by AttendanceButton after successful API call
    // to refresh the attendance status from the server
    console.log('Attendance marked successfully, status should be refreshed');
    // Refresh attendance records after marking attendance
    await fetchAttendanceRecords();
    await getTodaysAttendance();
  };

  return (
    <View style={commonStyles.container}>
      <PageHeader />
      <ScrollView
        style={commonStyles.content}
        contentContainerStyle={commonStyles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
      >
        {/* Mark Attendance Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Mark Attendance
          </Text>
          <AttendanceButton
            onMarkAttendance={handleMarkAttendance}
            currentStatus={currentAttendanceStatus}
            checkInTimeFromAPI={currentCheckInTime}
          />
        </View>

        {/* Attendance History Section */}
        <View style={styles.section}>
          <AttendanceHistory attendanceRecords={attendanceRecords} />
        </View>
      </ScrollView>
    </View>);
}

const getStyles = (colors) =>
  StyleSheet.create({
    section: {
      marginBottom: 24
    },
    sectionTitle: {
      color: colors.onSurface,
      marginBottom: 16,
      fontWeight: "600"
    }
  });
