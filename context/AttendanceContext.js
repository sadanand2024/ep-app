import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
  const [attendanceRecords, setAttendanceRecords] = useState([]); // Initialize as empty array

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
        const parsedRecords = JSON.parse(storedRecords);
        setAttendanceRecords(parsedRecords || []); // Ensure it's always an array
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
      newRecords = [newRecord, ...(attendanceRecords || [])];
    } else {
      newStatus = 'clocked-out';
      // Update last record with out time
      newRecords = (attendanceRecords || []).map((record, index) =>
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
    return (attendanceRecords || []).find(record => record.date === today);
  };

  const getAttendanceStats = () => {
    const records = attendanceRecords || [];
    const totalDays = records.length;
    const presentDays = records.filter(record => record.status === 'present').length;
    const lateDays = records.filter(record => record.status === 'late').length;
    const absentDays = totalDays - presentDays - lateDays;

    return {
      totalDays,
      presentDays,
      lateDays,
      absentDays,
      attendanceRate: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
    };
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentAttendanceStatus,
    attendanceRecords: attendanceRecords || [], // Ensure it's always an array
    markAttendance,
    getTodayRecord,
    getAttendanceStats,
    // For manual updates if needed
    setCurrentAttendanceStatus,
    setAttendanceRecords
  }), [currentAttendanceStatus, attendanceRecords]);

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
}; 