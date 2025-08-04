import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Card, Text, useTheme, DataTable, Button } from "react-native-paper";
import { History, ChevronDown, Clock } from "lucide-react-native";
import Factory from "../utils/Factory";
import { Alert } from "react-native";

// Move arrays outside component to prevent recreation on every render
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function AttendanceHistory({ attendanceRecords = [] }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  // State for filters
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [sessionsModalVisible, setSessionsModalVisible] = useState(false);
  const [selectedDaySessions, setSelectedDaySessions] = useState([]);
  const [selectedDayDate, setSelectedDayDate] = useState('');
  const [tableRecords, setTableRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate current year and previous 5 years - memoized to prevent recreation
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());
  }, []);

  // Set default values on initial mount only
  useEffect(() => {
    const currentDate = new Date();
    setSelectedMonth(MONTHS[currentDate.getMonth()]);
    setSelectedYear(new Date().getFullYear().toString());
  }, []);


  const formatDate = (dateString) => {
    // Convert DD-MM-YYYY to readable format
    const [day, month, year] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "present":
        return "#4caf50";
      case "absent":
        return "#f44336";
      case "holiday":
        return "#ff9800";
      case "late":
        return "#ff9800";
      default:
        return colors.onSurfaceVariant;
    }
  };

  const handleSessionsPress = (sessions, date) => {
    setSelectedDaySessions(sessions);
    setSelectedDayDate(date);
    setSessionsModalVisible(true);
  };

  const formatTime = (timeString) => {
    if (!timeString || timeString === '-') return '-';
    return timeString;
  };

  const formatSessionTime = (checkIn, checkOut) => {
    if (!checkIn || checkIn === '-') return '-';
    if (!checkOut || checkOut === '-') return `${checkIn} (Active)`;
    return `${checkIn} - ${checkOut}`;
  };

  const calculateHours = (inTime, outTime) => {
    if (!inTime || !outTime) return "-";
    const inDate = new Date(inTime);
    const outDate = new Date(outTime);
    const diffMs = outDate - inDate;
    const diffHours = diffMs / (1000 * 60 * 60);
    return `${diffHours.toFixed(1)}h`;
  };

  const convertMonthToNumber = (month) => {
    return MONTHS.indexOf(month) + 1;
  }

  const getAttendanceRecords = async () => {
    const res = await Factory('get', `/payroll/monthly-report/?month=${convertMonthToNumber(selectedMonth)}&year=${selectedYear}`, {}, {}, {});
    if (res.status_cd === 1) {
      const response = res.data;
      setTableRecords(response);
    } else {
      console.tron.log('res', res);
    }
  }

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      getAttendanceRecords();
    }
  }, [selectedYear, selectedMonth]);

  return (

    <Card style={styles.card} mode="outlined">
      <View style={styles.headerContainer}>
        <View>
          <Text variant="titleLarge" style={styles.title}>
            Attendance History
          </Text>
          {/* <History size={24} color={colors.primary} /> */}
        </View>
        <View>
          <Text variant="labelMedium" style={styles.title}>
            Total working days in {selectedMonth}  {tableRecords?.total_present_days || 0}
          </Text>
        </View>
      </View>
      {/* Filters Section */}
      <View style={styles.filtersContainer}>
        <View style={styles.dropdownRow}>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setMonthModalVisible(true)}
            >
              <Text style={styles.filterButtonText}>
                {selectedMonth || "Select Month"}
              </Text>
              <ChevronDown size={16} color={colors.onSurface} />
            </TouchableOpacity>
          </View>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setYearModalVisible(true)}
            >
              <Text style={styles.filterButtonText}>
                {selectedYear || "Select Year"}
              </Text>
              <ChevronDown size={16} color={colors.onSurface} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Month Selection Modal */}
      <Modal
        visible={monthModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMonthModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Month</Text>
            <ScrollView style={styles.modalScrollView}>
              {MONTHS.map((month) => (
                <TouchableOpacity
                  key={month}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedMonth(month);
                    setMonthModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{month}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setMonthModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Year Selection Modal */}
      <Modal
        visible={yearModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setYearModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Year</Text>
            <ScrollView style={styles.modalScrollView}>
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedYear(year);
                    setYearModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{year}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setYearModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sessions Details Modal */}
      <Modal
        visible={sessionsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSessionsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sessions - {formatDate(selectedDayDate)}</Text>
            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={{ flexGrow: 0 }}
              showsVerticalScrollIndicator={true}
            >
              {selectedDaySessions.length > 0 ? (
                selectedDaySessions.map((session, index) => (
                  <View key={index} style={styles.sessionItem}>
                    <Text style={styles.sessionTitle}>Session {index + 1}</Text>
                    <Text style={styles.sessionTime}>
                      {formatSessionTime(
                        session.check_in
                          ? new Date(`1970-01-01T${session.check_in}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                          : session.check_in,
                        session.check_out && session.check_out !== '-'
                          ? new Date(`1970-01-01T${session.check_out}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                          : session.check_out
                      )}
                    </Text>
                    {session.location && session.location !== '-' && (
                      <Text style={styles.sessionLocation}>
                        📍 {session.location}
                      </Text>
                    )}
                    {session.device_info && session.device_info !== '-' && (
                      <Text style={styles.sessionDevice}>
                        📱 {session.device_info}
                      </Text>
                    )}
                  </View>
                ))
              ) : (
                <View>
                  <Text style={styles.noSessionsText}>No sessions for this day</Text>
                  <Text style={styles.noSessionsText}>Debug: Sessions array length is {selectedDaySessions.length}</Text>
                  <Text style={styles.noSessionsText}>Debug: Selected date is {selectedDayDate}</Text>
                </View>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setSessionsModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <DataTable style={styles.table}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title style={styles.dateColumn}>
              <Text variant="labelMedium" style={styles.headerText}>
                Date
              </Text>
            </DataTable.Title>
            <DataTable.Title style={styles.hoursColumn}>
              <Text variant="labelMedium" style={styles.headerText}>
                Hours
              </Text>
            </DataTable.Title>
            <DataTable.Title style={styles.statusColumn}>
              <Text variant="labelMedium" style={styles.headerText}>
                Status
              </Text>
            </DataTable.Title>
            <DataTable.Title style={styles.sessionsColumn}>
              <Text variant="labelMedium" style={styles.headerText}>
                Sessions
              </Text>
            </DataTable.Title>
          </DataTable.Header>
          {loading ? (
            <DataTable.Row>
              <DataTable.Cell style={styles.emptyCell}>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  Loading...
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          ) : (
            tableRecords?.report?.length > 0 ? (
              tableRecords?.report?.map((record, index) => (
                <DataTable.Row key={index} style={styles.tableRow}>
                  <DataTable.Cell style={styles.dateColumn}>
                    <Text variant="bodySmall" style={styles.cellText}>
                      {formatDate(record.date)}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.hoursColumn}>
                    <Text variant="bodySmall" style={styles.cellText}>
                      {record.total_hours || "0:00:00"}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.statusColumn}>
                    <View style={styles.statusContainer}>
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: getStatusColor(record.status) }
                        ]}
                      />
                      <Text
                        variant="bodySmall"
                        style={[
                          styles.statusText,
                          { color: getStatusColor(record.status) }
                        ]}
                      >
                        {record.status}
                      </Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.sessionsColumn}>
                    <TouchableOpacity
                      style={styles.sessionsButton}
                      onPress={() => {
                        console.tron.log('Record sessions:', record.sessions);
                        console.tron.log('Record session_count:', record.session_count);
                        if (record.sessions && record.sessions.length > 0) {
                          handleSessionsPress(record.sessions, record.date)
                        } else {
                          Alert.alert('No sessions found', 'There are no sessions recorded on this date', [{ text: 'OK' }]);
                        }
                      }}
                    >
                      <Clock size={16} color={colors.primary} />
                      <Text style={styles.sessionsButtonText}>
                        {record.session_count || 0}
                      </Text>
                    </TouchableOpacity>
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <DataTable.Row>
                <DataTable.Cell style={styles.emptyCell}>
                  <Text variant="bodyMedium" style={styles.emptyText}>
                    No attendance records found
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            )
          )}
        </DataTable>
      </ScrollView>
    </Card>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    card: {
      marginBottom: 16
    },
    filtersContainer: {
      padding: 16,
      paddingTop: 0,
      paddingBottom: 8
    },
    dropdownRow: {
      flexDirection: 'row',
      gap: 12
    },
    dropdownContainer: {
      flex: 1
    },
    filterButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: 8,
      padding: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    filterButtonText: {
      color: colors.onSurface,
      fontWeight: '500',
      fontSize: 14
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      width: '80%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.onSurface,
      textAlign: 'center',
      marginHorizontal: 16,
      marginVertical: 16,
    },
    modalBody: {
      flex: 1,
      marginVertical: 16,
    },
    modalScrollView: {
      // No flex or height here
    },
    modalItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline
    },
    modalItemText: {
      fontSize: 16,
      color: colors.onSurface
    },
    modalCancelButton: {
      paddingVertical: 12,
      backgroundColor: colors.error,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 10,
      marginVertical: 10,
    },
    modalCancelText: {
      color: colors.onError,
      fontWeight: '600',
      fontSize: 16
    },
    headerContainer: {
      alignItems: "left",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    title: {
      color: colors.onSurface
    },
    table: {
      minWidth: 400
    },
    tableHeader: {
      backgroundColor: colors.surfaceVariant
    },
    headerText: {
      color: colors.onSurface,
      fontWeight: "600"
    },
    tableRow: {
      borderBottomWidth: 1,
      borderBottomColor: colors.outline
    },
    dateColumn: {
      flex: 1.5
    },
    hoursColumn: {
      flex: 0.8
    },
    statusColumn: {
      flex: 1
    },
    sessionsColumn: {
      flex: 0.8
    },
    cellText: {
      color: colors.onSurface
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center"
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 4
    },
    statusText: {
      textTransform: "capitalize",
      fontWeight: "500"
    },
    sessionsButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.outline
    },
    sessionsButtonText: {
      marginLeft: 8,
      color: colors.onSurface,
      fontSize: 14,
      fontWeight: "500"
    },
    sessionItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline
    },
    sessionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.onSurface,
      marginBottom: 4
    },
    sessionTime: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      marginBottom: 2
    },
    sessionLocation: {
      fontSize: 13,
      color: colors.onSurfaceVariant,
      marginBottom: 2
    },
    sessionDevice: {
      fontSize: 13,
      color: colors.onSurfaceVariant
    },
    noSessionsText: {
      textAlign: "center",
      color: colors.onSurfaceVariant,
      fontStyle: "italic",
      paddingVertical: 20
    },
    emptyCell: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20
    },
    emptyText: {
      color: colors.onSurfaceVariant,
      fontStyle: "italic"
    }
  });
