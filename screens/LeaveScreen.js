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
  Calendar,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Beach,
  Briefcase,
  X,
  Heart,
  Users
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerContext } from "../context/DrawerContext";
import { getCommonStyles } from "../constants/commonStyles";
import { getStatusColor } from "../constants/theme";

// Import components
import LeaveBalance from "../components/LeaveBalance";
import LeaveRequestForm from "../components/LeaveRequestForm";

export default function LeaveScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const commonStyles = getCommonStyles(colors);
  const { isDarkMode } = useContext(DrawerContext);

  const getIconComponent = (iconName) => {
    const iconMap = {
      'calendar': Calendar,
      'plus': Plus,
      'clock': Clock,
      'check-circle': CheckCircle,
      'x-circle': XCircle,
      'alert-circle': AlertCircle,
      'beach': Beach,
      'medical-bag': Briefcase,
      'star': Star,
      'calendar': Calendar,
      'heart': Heart,
      'users': Users,
      'close': X,
      'close-circle': XCircle,
      'help-circle': AlertCircle
    };
    return iconMap[iconName] || Calendar;
  };

  // State management
  const [refreshing, setRefreshing] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  // Debug modal state
  useEffect(() => {
    console.log("Modal state changed:", showLeaveForm);
  }, [showLeaveForm]);

  // Mock data - replace with actual API calls
  const [leaveBalances, setLeaveBalances] = useState([
    { type: "Casual", used: 3, total: 10, icon: "calendar", color: "#2196f3" },
    { type: "Sick", used: 2, total: 15, icon: "briefcase", color: "#f44336" },
    { type: "Earned Leave", used: 3, total: 25, icon: "star", color: "#4caf50" },
    { type: "Compensatory Off", used: 0, total: 2, icon: "calendar-clock", color: "#ffd600" },
    { type: "Privilege Leave", used: 3, total: 10, icon: "user-plus", color: "#ff9800" },
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
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
  ]);

  const leaveTypes = [
    { value: "casual", label: "Casual Leave", icon: "beach" },
    { value: "sick", label: "Sick Leave", icon: "medical-bag" },
    { value: "annual", label: "Annual Leave", icon: "calendar" },
    { value: "maternity", label: "Maternity Leave", icon: "heart" },
    { value: "paternity", label: "Paternity Leave", icon: "users" },
    { value: "earned", label: "Earned Leave", icon: "star" },
    { value: "unpaid", label: "Unpaid Leave", icon: "alert-circle" }
  ];

  // Handlers
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleLeaveSubmit = async (formData) => {
    console.log("Leave submission received:", formData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newRequest = {
      id: Date.now(),
      ...formData,
      status: "pending"
    };

    console.log("New leave request created:", newRequest);
    setLeaveRequests((prev) => [newRequest, ...prev]);
    setShowLeaveForm(false);
  };

  const getLocalStatusColor = (status) => {
    return getStatusColor(status, "leave", isDarkMode, "primary");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return "check-circle";
      case "rejected":
        return "close-circle";
      case "pending":
        return "clock";
      default:
        return "help-circle";
    }
  };

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
          {React.createElement(getIconComponent("calendar"), {
            size: 24,
            style: commonStyles.headIcon
          })}
          <Text variant="headlineMedium" style={commonStyles.headerTitle}>
            Leave Management
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
        {/* Leave Balance Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Leave Balance
          </Text>
          <LeaveBalance leaveBalances={leaveBalances} />

          <Button
            mode="contained"
            onPress={() => {
              setShowLeaveForm(true);
            }}
            style={styles.applyLeaveButton}
            contentStyle={styles.applyLeaveButtonContent}
            icon={({ size, color }) => (
              React.createElement(getIconComponent("plus"), {
                size: size,
                color: color
              })
            )}
          >
            Apply for Leave
          </Button>
        </View>

        {/* Leave Requests Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Leave Requests
          </Text>

          {leaveRequests.length > 0 ? (
            leaveRequests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View style={styles.requestType}>
                    {React.createElement(getIconComponent(
                      leaveTypes.find((t) => t.value === request.type)
                        ?.icon || "calendar"
                    ), {
                      size: 20,
                      color: colors.primary
                    })}
                    <Text variant="titleMedium" style={styles.requestTypeText}>
                      {request.type}
                    </Text>
                  </View>
                  <View style={styles.statusContainer}>
                    {React.createElement(getIconComponent(getStatusIcon(request.status)), {
                      size: 16,
                      color: getLocalStatusColor(request.status)
                    })}
                    <Text
                      variant="bodySmall"
                      style={[
                        styles.statusText,
                        { color: getLocalStatusColor(request.status) }
                      ]}
                    >
                      {request.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.requestDetails}>
                  <Text variant="bodyMedium" style={styles.dateText}>
                    {request.startDate} - {request.endDate}
                  </Text>
                  <Text variant="bodySmall" style={styles.reasonText}>
                    {request.reason}
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
                No leave requests found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Leave Request Modal */}
      <Portal>
        <Modal
          visible={showLeaveForm}
          onDismiss={() => setShowLeaveForm(false)}
          contentContainerStyle={styles.modal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text variant="titleLarge" style={styles.modalTitle}>
                Apply for Leave
              </Text>
              <Button
                mode="text"
                onPress={() => setShowLeaveForm(false)}
                icon={({ size, color }) => (
                  React.createElement(getIconComponent("close"), {
                    size: size,
                    color: color
                  })
                )}
                compact
              />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
              style={styles.modalScrollView}
              keyboardShouldPersistTaps="handled"
            >
              <LeaveRequestForm
                onSubmit={handleLeaveSubmit}
                leaveTypes={leaveTypes}
              />
            </ScrollView>
          </View>
        </Modal>
      </Portal>
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
    section: {
      marginBottom: 24
    },
    sectionTitle: {
      color: colors.onSurface,
      marginBottom: 16,
      fontWeight: "600"
    },
    requestCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      elevation: 2
    },
    requestHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    },
    requestType: {
      flexDirection: "row",
      alignItems: "center"
    },
    requestTypeText: {
      marginLeft: 8,
      color: colors.onSurface,
      fontWeight: "600"
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center"
    },
    statusText: {
      marginLeft: 4,
      textTransform: "capitalize",
      fontWeight: "500"
    },
    requestDetails: {
      gap: 4
    },
    dateText: {
      color: colors.onSurface,
      fontWeight: "500"
    },
    reasonText: {
      color: colors.onSurfaceVariant
    },
    emptyContainer: {
      alignItems: "center",
      paddingVertical: 32
    },
    emptyText: {
      color: colors.onSurfaceVariant,
      marginTop: 8,
      textAlign: "center"
    },
    applyLeaveButton: {
      marginTop: 20,
      borderRadius: 8
    },
    applyLeaveButtonContent: {
      paddingVertical: 2
    },
    modal: {
      flex: 1,
      backgroundColor: colors.surface,
      margin: 20,
      borderRadius: 12,
      alignSelf: "center"
    },
    modalContainer: {
      flex: 1,
      width: "100%"
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline
    },
    modalTitle: {
      color: colors.onSurface,
      fontWeight: "600"
    },
    modalScrollView: {
      flex: 1,
      width: "100%"
    },
    modalContent: {
      padding: 20,
      paddingBottom: 20,
      width: "100%"
    }
  });
