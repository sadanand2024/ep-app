import React, { createContext, useContext, useState } from 'react';
import { Platform, Modal, View, StyleSheet, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, useTheme } from 'react-native-paper';

const DatePickerContext = createContext();

export const useDatePicker = () => {
  const context = useContext(DatePickerContext);
  if (!context) {
    throw new Error('useDatePicker must be used within a DatePickerProvider');
  }
  return context;
};

export const DatePickerProvider = ({ children }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [onDateSelect, setOnDateSelect] = useState(null);

  const openDatePicker = (currentDate, callback) => {
    setSelectedDate(currentDate || new Date());
    setOnDateSelect(() => callback);
    setShowPicker(true);
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (date) {
      setSelectedDate(date);
      if (Platform.OS === 'android' && onDateSelect) {
        onDateSelect(date);
      }
    }
  };

  const handleConfirm = () => {
    if (onDateSelect) {
      onDateSelect(selectedDate);
    }
    closePicker();
  };

  const handleCancel = () => {
    closePicker();
  };

  const closePicker = () => {
    setShowPicker(false);
    setOnDateSelect(null);
  };

  const confirmDate = () => {
    if (onDateSelect) {
      onDateSelect(selectedDate);
    }
    closePicker();
  };

  return (
    <DatePickerContext.Provider value={{ openDatePicker, closePicker, confirmDate }}>
      {children}
      
      {/* Global DateTimePicker */}
      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date(2030, 11, 31)}
          minimumDate={new Date(2020, 0, 1)}
        />
      )}

      {/* iOS Modal with DateTimePicker */}
      {showPicker && Platform.OS === 'ios' && (
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Button onPress={handleCancel} mode="text">
                  Cancel
                </Button>
                <Button onPress={handleConfirm} mode="text">
                  Done
                </Button>
              </View>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={(event, date) => {
                    if (date) setSelectedDate(date);
                  }}
                  maximumDate={new Date(2030, 11, 31)}
                  minimumDate={new Date(2020, 0, 1)}
                  style={styles.picker}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </DatePickerContext.Provider>
  );
};

const getStyles = (colors) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area for iPhone
    maxHeight: 300, // Limit height to content size
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  pickerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  picker: {
    width: Dimensions.get('window').width,
    height: 200,
  },
}); 