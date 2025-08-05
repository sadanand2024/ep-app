import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import {
  Calendar,
  Plus,
  Clock,
  UserCheck,
  UserX,
  Star
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerContext } from "../context/DrawerContext";
import { getCommonStyles } from "../constants/commonStyles";
import Factory from "../utils/Factory";

// Import components
import PageHeader from "../components/PageHeader";
import CalendarView from "../components/CalendarView";

export default function CalendarScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const commonStyles = getCommonStyles(colors);
  const { isDarkMode } = useContext(DrawerContext);
  const [holidayCalendar, setHolidayCalendar] = useState([]);

  const fetchHolidayCalendar = async () => {
    try {
      const response = await Factory('get', '/payroll/holiday-calendar/?year=2025', {}, {}, {});
      if (response.status_cd === 1) {
        setHolidayCalendar(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      'calendar': Calendar,
      'plus': Plus,
      'clock': Clock,
      'user-check': UserCheck,
      'user-x': UserX,
      'star': Star
    };
    return iconMap[iconName] || Calendar;
  };

  // State management
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API calls
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15`,
      inTime: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15T09:00:00`,
      outTime: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15T17:30:00`,
      status: "present"
    },
    {
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-14`,
      inTime: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-14T08:45:00`,
      outTime: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-14T17:00:00`,
      status: "present"
    },
    {
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-13`,
      inTime: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-13T09:15:00`,
      outTime: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-13T17:45:00`,
      status: "late"
    },
    {
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-12`,
      inTime: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-12T08:30:00`,
      outTime: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-12T17:15:00`,
      status: "present"
    },
    {
      date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-11`,
      inTime: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-11T09:05:00`,
      outTime: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-11T17:30:00`,
      status: "present"
    }
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      type: "Casual",
      startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-20`,
      endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-20`,
      reason: "Personal appointment",
      status: "approved"
    },
    {
      id: 2,
      type: "Sick",
      startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-25`,
      endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-26`,
      reason: "Medical emergency",
      status: "pending"
    }
  ]);

  const [events, setEvents] = useState([
    {
      date: `${currentYear}-06-26`,
      title: "Republic Day",
      type: "holiday"
    },
    {
      date: `${currentYear}-06-30`,
      title: "Team Meeting",
      type: "event"
    },
    {
      date: `${currentYear}-07-11`,
      title: "Happy Birthday Krishna Sai Kannekanti",
      type: "holiday"
    },
    {
      date: `${currentYear}-07-20`,
      title: "Project Review",
      type: "event"
    }
  ]);

  // Handlers
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  useEffect(() => {
    fetchHolidayCalendar();
  }, []);

  return (
    <>
      <PageHeader />
      <ScrollView
        style={commonStyles.content}
        contentContainerStyle={commonStyles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar View Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Monthly Calendar
          </Text>
          <CalendarView
            events={events}
            attendanceRecords={attendanceRecords}
            leaveRequests={leaveRequests}
          />
        </View>

        {/* Upcoming Events Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Upcoming Events
          </Text>

          {events.length > 0 ? (
            events.slice(0, 5).map((event, index) => (
              <View key={index} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  {React.createElement(getIconComponent(
                    event.type === "holiday" ? "calendar-star" : "calendar"
                  ), {
                    size: 20,
                    color: event.type === "holiday" ? "#ff9800" : colors.primary
                  })}
                  <Text variant="titleMedium" style={styles.eventTitle}>
                    {event.title}
                  </Text>
                </View>

                <View style={styles.eventDetails}>
                  <Text variant="bodyMedium" style={styles.eventDate}>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </Text>
                  <Text variant="bodySmall" style={styles.eventType}>
                    {event.type === "holiday" ? "Holiday" : "Event"}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              {React.createElement(getIconComponent("calendar-remove"), {
                size: 48,
                color: colors.onSurfaceVariant
              })}
              <Text variant="bodyMedium" style={styles.emptyText}>
                No upcoming events
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
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
    },
    eventCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      elevation: 2
    },
    eventHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8
    },
    eventTitle: {
      marginLeft: 8,
      color: colors.onSurface,
      fontWeight: "600"
    },
    eventDetails: {
      gap: 4
    },
    eventDate: {
      color: colors.onSurface,
      fontWeight: "500"
    },
    eventType: {
      color: colors.onSurfaceVariant,
      textTransform: "capitalize"
    },
    emptyContainer: {
      alignItems: "center",
      paddingVertical: 32
    },
    emptyText: {
      color: colors.onSurfaceVariant,
      marginTop: 8,
      textAlign: "center"
    }
  });
