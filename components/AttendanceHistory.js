import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Text, useTheme, DataTable } from "react-native-paper";
import { History } from "lucide-react-native";

export default function AttendanceHistory({ attendanceRecords = [] }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const formatTime = (time) => {
    if (!time) return "-";
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };

  const calculateHours = (inTime, outTime) => {
    if (!inTime || !outTime) return "-";
    const inDate = new Date(inTime);
    const outDate = new Date(outTime);
    const diffMs = outDate - inDate;
    const diffHours = diffMs / (1000 * 60 * 60);
    return `${diffHours.toFixed(1)}h`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "#4caf50";
      case "absent":
        return "#f44336";
      case "late":
        return "#ff9800";
      default:
        return colors.onSurfaceVariant;
    }
  };

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content style={{ padding: 0 }}>
        <View style={styles.header}>
          <History size={24} color={colors.primary} />
          <Text variant="titleLarge" style={styles.title}>
            Attendance History
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <DataTable style={styles.table}>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title style={styles.dateColumn}>
                <Text variant="labelMedium" style={styles.headerText}>
                  Date
                </Text>
              </DataTable.Title>
              <DataTable.Title style={styles.timeColumn}>
                <Text variant="labelMedium" style={styles.headerText}>
                  In Time
                </Text>
              </DataTable.Title>
              <DataTable.Title style={styles.timeColumn}>
                <Text variant="labelMedium" style={styles.headerText}>
                  Out Time
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
            </DataTable.Header>

            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record, index) => (
                <DataTable.Row key={index} style={styles.tableRow}>
                  <DataTable.Cell style={styles.dateColumn}>
                    <Text variant="bodySmall" style={styles.cellText}>
                      {formatDate(record.date)}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.timeColumn}>
                    <Text variant="bodySmall" style={styles.cellText}>
                      {formatTime(record.inTime)}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.timeColumn}>
                    <Text variant="bodySmall" style={styles.cellText}>
                      {formatTime(record.outTime)}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.hoursColumn}>
                    <Text variant="bodySmall" style={styles.cellText}>
                      {calculateHours(record.inTime, record.outTime)}
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
            )}
          </DataTable>
        </ScrollView>
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
      marginBottom: 16
    },
    title: {
      marginLeft: 8,
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
    timeColumn: {
      flex: 1
    },
    hoursColumn: {
      flex: 0.8
    },
    statusColumn: {
      flex: 1
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
