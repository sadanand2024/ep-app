import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AttendanceContext = createContext();

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

export const AttendanceProvider = ({ children }) => {
  const [currentAttendanceStatus, setCurrentAttendanceStatus] = useState('not-marked');
  const [attendanceRecords, setAttendanceRecords] = useState();

  // Load attendance data from storage on mount
  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      const storedStatus = await AsyncStorage.getItem('currentAttendanceStatus');
      const storedRecords = await AsyncStorage.getItem('attendanceRecords');

      if (storedStatus) {
        setCurrentAttendanceStatus(storedStatus);
      }

      if (storedRecords) {
        setAttendanceRecords(JSON.parse(storedRecords));
      }
    } catch (error) {
      console.error('Error loading attendance data:', error);
    }
  };

  const saveAttendanceData = async (status, records) => {
    try {
      await AsyncStorage.setItem('currentAttendanceStatus', status);
      console.tron.log('records', records);
      await AsyncStorage.setItem('attendanceRecords', JSON.stringify(records));
    } catch (error) {
      console.error('Error saving attendance data:', error);
    }
  };

  const markAttendance = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    let newStatus;
    let newRecords;

    if (currentAttendanceStatus === 'not-marked' || currentAttendanceStatus === 'clocked-out') {
      newStatus = 'clocked-in';
      // Add to attendance records
      const newRecord = {
        date: new Date().toISOString().split('T')[0],
        inTime: new Date().toISOString(),
        outTime: null,
        status: 'present'
      };
      newRecords = [newRecord, ...attendanceRecords];
    } else {
      newStatus = 'clocked-out';
      // Update last record with out time
      newRecords = attendanceRecords.map((record, index) =>
        index === 0 ? { ...record, outTime: new Date().toISOString() } : record
      );
    }

    setCurrentAttendanceStatus(newStatus);
    setAttendanceRecords(newRecords);

    // Save to storage
    console.tron.log('newRecords', newRecords);
    await saveAttendanceData(newStatus, newRecords);
  };

  const getTodayRecord = () => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceRecords.find(record => record.date === today);
  };

  const getAttendanceStats = () => {
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(record => record.status === 'present').length;
    const lateDays = attendanceRecords.filter(record => record.status === 'late').length;
    const absentDays = totalDays - presentDays - lateDays;

    return {
      totalDays,
      presentDays,
      lateDays,
      absentDays,
      attendanceRate: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
    };
  };

  const value = {
    currentAttendanceStatus,
    attendanceRecords,
    markAttendance,
    getTodayRecord,
    getAttendanceStats,
    // For manual updates if needed
    setCurrentAttendanceStatus,
    setAttendanceRecords
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
}; 