import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Text, useTheme, Button, Chip } from "react-native-paper";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  UserCheck,
  UserX,
  Star
} from "lucide-react-native";

export default function CalendarView({
  events = [],
  attendanceRecords = [],
  leaveRequests = []
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getIconComponent = (iconName) => {
    const iconMap = {
      'chevron-left': ChevronLeft,
      'chevron-right': ChevronRight,
      'check-circle': UserCheck,
      'calendar-remove': UserX,
      'calendar-star': Star,
      'calendar': Calendar,
      'clock': Clock
    };
    return iconMap[iconName] || Calendar;
  };

  // Debug logging
  console.log("CalendarView - Current Date:", currentDate);
  console.log("CalendarView - Events:", events);
  console.log("CalendarView - Attendance Records:", attendanceRecords);
  console.log("CalendarView - Leave Requests:", leaveRequests);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getEventForDate = (date) => {
    // Format date as YYYY-MM-DD for consistent comparison
    const dateStr = date.toISOString().split("T")[0];

    // Check for attendance
    const attendance = attendanceRecords.find(
      (record) => record.date === dateStr
    );

    // Check for leave
    const leave = leaveRequests.find((leave) => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const checkDate = new Date(date);
      
      // Reset time to midnight for accurate date comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      checkDate.setHours(0, 0, 0, 0);
      
      return (
        checkDate >= startDate &&
        checkDate <= endDate &&
        leave.status === "approved"
      );
    });

    // Check for events/holidays
    const event = events.find(
      (event) => event.date === dateStr
    );

    return { attendance, leave, event };
  };

  const getDayStyle = (date, isCurrentMonth) => {
    const { attendance, leave, event } = getEventForDate(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected =
      selectedDate && date.toDateString() === selectedDate.toDateString();

    let backgroundColor = "transparent";
    let borderColor = "transparent";
    let borderWidth = 1;

    if (leave) {
      backgroundColor = "#ffebee";
      borderColor = "#f44336";
    } else if (event) {
      backgroundColor = "#e3f2fd";
      borderColor = "#2196f3";
    } else if (attendance) {
      backgroundColor = "#e8f5e8";
      borderColor = "#4caf50";
    }

    if (isToday) {
      borderColor = colors.primary;
      borderWidth = 2;
    }

    if (isSelected) {
      backgroundColor = colors.primaryContainer;
    }

    return {
      backgroundColor,
      borderColor,
      borderWidth,
      opacity: isCurrentMonth ? 1 : 0.3
    };
  };

  const getDayIcon = (date) => {
    const { attendance, leave, event } = getEventForDate(date);

    if (leave) return { name: "calendar-remove", color: "#f44336" };
    if (event) return { name: "calendar-star", color: "#2196f3" };
    if (attendance) return { name: "check-circle", color: "#4caf50" };
    return null;
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];

    // Calculate the last day of the previous month
    const lastDayOfPrevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    const daysInPrevMonth = lastDayOfPrevMonth.getDate();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const day = daysInPrevMonth - startingDayOfWeek + i + 1;
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        day
      );
      days.push({ date, isCurrentMonth: false });
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      days.push({ date, isCurrentMonth: true });
    }

    // Calculate how many more days we need to fill the grid
    // We want exactly 6 rows (42 days total) for consistent layout
    const totalDaysInGrid = 42; // 6 rows * 7 days
    const remainingDays = totalDaysInGrid - days.length;
    
    // Add empty cells for days after the last day of the month
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        day
      );
      days.push({ date, isCurrentMonth: false });
    }

    console.log("Calendar grid generated with", days.length, "days");
    console.log("Current month days:", daysInMonth, "Starting day of week:", startingDayOfWeek);

    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getSelectedDateInfo = () => {
    if (!selectedDate) return null;

    const { attendance, leave, event } = getEventForDate(selectedDate);
    const dateStr = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    return { dateStr, attendance, leave, event };
  };

  const selectedInfo = getSelectedDateInfo();

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        {/* Month Navigation */}
        <View style={styles.navigation}>
          <Button
            mode="text"
            onPress={() => navigateMonth(-1)}
            icon={({ size, color }) => (
              React.createElement(getIconComponent("chevron-left"), {
                size: size,
                color: color
              })
            )}
          />
          <Text variant="titleMedium" style={styles.monthText}>
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric"
            })}
          </Text>
          <Button
            mode="text"
            onPress={() => navigateMonth(1)}
            icon={({ size, color }) => (
              React.createElement(getIconComponent("chevron-right"), {
                size: size,
                color: color
              })
            )}
          />
        </View>

        {/* Calendar Grid */}
        <View>
          {/* Day Headers */}
          <View style={styles.dayHeaders}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <View key={day} style={styles.dayHeader}>
                <Text variant="labelSmall" style={styles.dayHeaderText}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.calendarGrid}>
            {renderCalendar().map(({ date, isCurrentMonth }, index) => {
              const dayStyle = getDayStyle(date, isCurrentMonth);
              const dayIcon = getDayIcon(date);

              return (
                <View
                  key={index}
                  style={[styles.dayCell, dayStyle]}
                  onTouchEnd={() => setSelectedDate(date)}
                >
                  <Text
                    variant="bodySmall"
                    style={[
                      styles.dayText,
                      {
                        color: isCurrentMonth
                          ? colors.onSurface
                          : colors.onSurfaceVariant
                      }
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                  {dayIcon && (
                    React.createElement(getIconComponent(dayIcon.name), {
                      size: 12,
                      color: dayIcon.color,
                      style: styles.dayIcon
                    })
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#4caf50" }]} />
            <Text variant="bodySmall">Present</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#f44336" }]} />
            <Text variant="bodySmall">Leave</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#2196f3" }]} />
            <Text variant="bodySmall">Event</Text>
          </View>
        </View>

        {/* Selected Date Info */}
        {selectedInfo && (
          <View style={styles.selectedDateInfo}>
            <Text variant="titleMedium" style={styles.selectedDateTitle}>
              {selectedInfo.dateStr}
            </Text>
            <View style={styles.selectedDateDetails}>
              {selectedInfo.attendance && (
                <Chip 
                  icon={({ size, color }) => (
                    React.createElement(getIconComponent("check-circle"), {
                      size: size,
                      color: color
                    })
                  )}
                  style={styles.infoChip}
                >
                  Present -{" "}
                  {new Date(
                    selectedInfo.attendance.inTime
                  ).toLocaleTimeString()}
                </Chip>
              )}
              {selectedInfo.leave && (
                <Chip 
                  icon={({ size, color }) => (
                    React.createElement(getIconComponent("calendar-remove"), {
                      size: size,
                      color: color
                    })
                  )}
                  style={styles.infoChip}
                >
                  Leave - {selectedInfo.leave.type}
                </Chip>
              )}
              {selectedInfo.event && (
                <Chip 
                  icon={({ size, color }) => (
                    React.createElement(getIconComponent("calendar-star"), {
                      size: size,
                      color: color
                    })
                  )}
                  style={styles.infoChip}
                >
                  {selectedInfo.event.title}
                </Chip>
              )}
              {!selectedInfo.attendance &&
                !selectedInfo.leave &&
                !selectedInfo.event && (
                  <Text variant="bodySmall" style={styles.noInfoText}>
                    No events scheduled
                  </Text>
                )}
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    card: {
      marginBottom: 16
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      backgroundColor: colors.background
    },
    title: {
      marginLeft: 8,
      color: colors.onSurface
    },
    navigation: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16
    },
    monthText: {
      color: colors.onSurface,
      fontWeight: "600"
    },
    dayHeaders: {
      flexDirection: "row",
      marginBottom: 8
    },
    dayHeader: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 8
    },
    dayHeaderText: {
      color: colors.onSurfaceVariant,
      fontWeight: "600"
    },
    calendarGrid: {
      flexDirection: "row",
      flexWrap: "wrap"
    },
    dayCell: {
      width: "14.28%",
      aspectRatio: 1,
      borderWidth: 1,
      borderColor: colors.outline,
      alignItems: "center",
      justifyContent: "center",
      position: "relative"
    },
    dayText: {
      fontWeight: "500"
    },
    dayIcon: {
      position: "absolute",
      bottom: 2,
      right: 2
    },
    legend: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 16,
      paddingVertical: 8,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 8
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center"
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 4
    },
    selectedDateInfo: {
      backgroundColor: colors.surfaceVariant,
      padding: 12,
      borderRadius: 8
    },
    selectedDateTitle: {
      color: colors.onSurface,
      marginBottom: 8,
      fontWeight: "600"
    },
    selectedDateDetails: {
      gap: 8
    },
    infoChip: {
      alignSelf: "flex-start"
    },
    noInfoText: {
      color: colors.onSurfaceVariant,
      fontStyle: "italic"
    }
  });
