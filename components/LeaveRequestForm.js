import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import {
  Text,
  useTheme,
  TextInput,
  Button,
  HelperText,
  Menu,
  TouchableRipple
} from "react-native-paper";
import { 
  Calendar, 
  FileText, 
  Send, 
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  Beach,
  Briefcase,
  Star,
  Heart,
  Users
} from "lucide-react-native";
import { useDatePicker } from "../context/DatePickerContext";





export default function LeaveRequestForm({ onSubmit, leaveTypes = [] }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { openDatePicker } = useDatePicker();

  console.log("LeaveRequestForm rendered with leaveTypes:", leaveTypes);

  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const getIconComponent = (iconName) => {
    const iconMap = {
      'beach': Beach,
      'medical-bag': Briefcase,
      'calendar': Calendar,
      'heart': Heart,
      'users': Users,
      'star': Star,
      'alert-circle': AlertCircle
    };
    return iconMap[iconName] || AlertCircle;
  };

  const getSelectedLeaveType = () => {
    return leaveTypes.find(type => type.value === formData.type);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = "Please select leave type";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (
      formData.startDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = "End date cannot be before start date";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("Form submission started");
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", formData);
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        type: "",
        startDate: "",
        endDate: "",
        reason: "",
        description: ""
      });
      console.log("Form submitted successfully");
    } catch (error) {
      console.error("Error submitting leave request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB"); // DD/MM/YYYY format
  };

  const handleDateChange = (selectedDate, field) => {
    updateFormData(field, selectedDate.toISOString());
  };

  const showDatePicker = (field) => {
    console.log("showDatePicker called for field:", field);
    const currentDate = field === "startDate" 
      ? (formData.startDate ? new Date(formData.startDate) : new Date())
      : (formData.endDate ? new Date(formData.endDate) : new Date());
    
    openDatePicker(currentDate, (selectedDate) => {
      handleDateChange(selectedDate, field);
    });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
        {/* Leave Type Selection */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Leave Type
          </Text>
          {leaveTypes && leaveTypes.length > 0 ? (
            <Menu
              visible={dropdownVisible}
              onDismiss={() => setDropdownVisible(false)}
              anchor={
                <TouchableRipple
                  onPress={() => setDropdownVisible(true)}
                  style={styles.dropdownButton}
                  borderless
                >
                  <View style={styles.dropdownContent}>
                    <View style={styles.dropdownLeft}>
                      {formData.type ? (
                        <>
                          {React.createElement(getIconComponent(getSelectedLeaveType()?.icon), {
                            size: 20,
                            color: colors.primary
                          })}
                          <Text variant="bodyMedium" style={styles.dropdownText}>
                            {getSelectedLeaveType()?.label}
                          </Text>
                        </>
                      ) : (
                        <>
                          {React.createElement(getIconComponent("alert-circle"), {
                            size: 20,
                            color: colors.onSurfaceVariant
                          })}
                          <Text variant="bodyMedium" style={[styles.dropdownText, { color: colors.onSurfaceVariant }]}>
                            Select leave type
                          </Text>
                        </>
                      )}
                    </View>
                    <ChevronDown size={20} color={colors.onSurfaceVariant} />
                  </View>
                </TouchableRipple>
              }
              contentStyle={styles.dropdownMenu}
            >
              {leaveTypes.map((type) => (
                <Menu.Item
                  key={type.value}
                  onPress={() => {
                    updateFormData("type", type.value);
                    setDropdownVisible(false);
                  }}
                  title={type.label}
                  leadingIcon={() => (
                    React.createElement(getIconComponent(type.icon), {
                      size: 20,
                      color: colors.primary
                    })
                  )}
                  style={styles.dropdownMenuItem}
                />
              ))}
            </Menu>
          ) : (
            <View style={styles.fallbackContainer}>
              <Text variant="bodyMedium" style={styles.fallbackText}>
                No leave types available
              </Text>
            </View>
          )}
          {errors.type && (
            <HelperText type="error" visible={!!errors.type}>
              {errors.type}
            </HelperText>
          )}
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Leave Period
          </Text>
          <View style={styles.dateContainer}>
            <View style={styles.dateInput}>
              <TouchableOpacity
                onPress={() => showDatePicker("startDate")}
                style={styles.dateTouchable}
                activeOpacity={0.7}
              >
                <TextInput
                  label="Start Date"
                  value={formatDate(formData.startDate)}
                  mode="outlined"
                  placeholder="DD/MM/YYYY"
                  error={!!errors.startDate}
                  right={
                    <TextInput.Icon
                      icon={({ size, color }) => (
                        <Calendar size={size} color={color} />
                      )}
                      onPress={() => showDatePicker("startDate")}
                      forceTextInputFocus={false}
                    />
                  }
                  editable={false}
                  style={styles.dateTextInput}
                  pointerEvents="none"
                />
              </TouchableOpacity>
              {errors.startDate && (
                <HelperText type="error" visible={!!errors.startDate}>
                  {errors.startDate}
                </HelperText>
              )}
            </View>

            <View style={styles.dateInput}>
              <TouchableOpacity
                onPress={() => showDatePicker("endDate")}
                style={styles.dateTouchable}
                activeOpacity={0.7}
              >
                <TextInput
                  label="End Date"
                  value={formatDate(formData.endDate)}
                  mode="outlined"
                  placeholder="DD/MM/YYYY"
                  error={!!errors.endDate}
                  right={
                    <TextInput.Icon
                      icon={({ size, color }) => (
                        <Calendar size={size} color={color} />
                      )}
                      onPress={() => showDatePicker("endDate")}
                      forceTextInputFocus={false}
                    />
                  }
                  editable={false}
                  style={styles.dateTextInput}
                  pointerEvents="none"
                />
              </TouchableOpacity>
              {errors.endDate && (
                <HelperText type="error" visible={!!errors.endDate}>
                  {errors.endDate}
                </HelperText>
              )}
            </View>
          </View>
        </View>

        {/* Reason */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Reason
          </Text>
          <TextInput
            label="Brief reason for leave"
            value={formData.reason}
            onChangeText={(text) => updateFormData("reason", text)}
            mode="outlined"
            placeholder="e.g., Personal emergency, Medical appointment"
            error={!!errors.reason}
            multiline
            numberOfLines={2}
            style={styles.reasonInput}
            contentStyle={styles.reasonInputContent}
          />
          {errors.reason && (
            <HelperText type="error" visible={!!errors.reason}>
              {errors.reason}
            </HelperText>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Additional Details (Optional)
          </Text>
          <TextInput
            label="Additional information"
            value={formData.description}
            onChangeText={(text) => updateFormData("description", text)}
            mode="outlined"
            placeholder="Provide any additional details..."
            multiline
            numberOfLines={4}
            style={styles.descriptionInput}
            contentStyle={styles.descriptionInputContent}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
            icon={({ size, color }) => (
              <Send size={size} color={color} />
            )}
          >
            Submit Leave Request
          </Button>
        </View>
        </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      // Platform-specific alignment
      ...(Platform.OS === "android"
        ? {
            paddingHorizontal: 16
          }
        : {})
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    content: {
      // flex: 1, // Removed to fix iPhone infinite scroll
      width: "100%",
      // Platform-specific alignment
      // Removed alignItems from here
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 20, // Extra padding for keyboard
      // Platform-specific alignment
      ...(Platform.OS === "android"
        ? {
            alignItems: "center"
          }
        : {})
    },
    section: {
      marginBottom: 20,
      width: "100%", // Ensure full width
      // Platform-specific alignment
      ...(Platform.OS === "android"
        ? {
            maxWidth: Dimensions.get("window").width - 32
          }
        : {})
    },
    testButton: {
      marginBottom: 10
    },
    sectionTitle: {
      color: colors.onSurface,
      marginBottom: 12,
      fontWeight: "600"
    },
    dropdownButton: {
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: 8,
      backgroundColor: colors.surface,
      marginBottom: 4,
    },
    dropdownContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    dropdownLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    dropdownText: {
      color: colors.onSurface,
      fontWeight: '500',
    },
    dropdownMenu: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginTop: 4,
      minWidth: 250,
    },
    dropdownMenuItem: {
      paddingVertical: 8,
    },
    dateContainer: {
      flexDirection: "row",
      gap: 12,
      width: "100%", // Ensure full width
      // Platform-specific alignment
      ...(Platform.OS === "android"
        ? {
            justifyContent: "space-between"
          }
        : {})
    },
    dateInput: {
      flex: 1,
      minWidth: 0 // Allow flex to work properly
    },
    dateTouchable: {
      width: "100%"
    },
    dateInputContainer: {
      width: "100%"
    },
    dateTextInput: {
      width: "100%"
    },
    reasonInput: {
      width: "100%",
      minWidth: "100%",
      // Platform-specific alignment
      ...(Platform.OS === "android"
        ? {
            textAlignVertical: "top"
          }
        : {})
    },
    reasonInputContent: {
      minHeight: 80,
      width: "100%",
      // Platform-specific alignment
      ...(Platform.OS === "android"
        ? {
            paddingVertical: 8
          }
        : {})
    },
    descriptionInput: {
      width: "100%",
      minWidth: "100%",
      // Platform-specific alignment
      ...(Platform.OS === "android"
        ? {
            textAlignVertical: "top"
          }
        : {})
    },
    descriptionInputContent: {
      minHeight: 120,
      width: "100%",
      // Platform-specific alignment
      ...(Platform.OS === "android"
        ? {
            paddingVertical: 8
          }
        : {})
    },
    submitContainer: {
      marginTop: 20,
      marginBottom: 10,
      width: "100%" // Ensure full width
    },
    submitButton: {
      borderRadius: 8,
      width: "100%", // Ensure full width
      // Platform-specific alignment
      ...(Platform.OS === "android"
        ? {
            alignSelf: "stretch"
          }
        : {})
    },
    submitButtonContent: {
      paddingVertical: 8
    },
    fallbackContainer: {
      padding: 16,
      alignItems: "center",
      backgroundColor: colors.surfaceVariant,
      borderRadius: 8
    },
    fallbackText: {
      color: colors.onSurfaceVariant
    }
  });
 