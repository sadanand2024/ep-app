import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Card } from 'react-native-paper';
import { Circle } from 'lucide-react-native';
import { DrawerContext } from '../context/DrawerContext';
import { getStatusConfig, getStatusColor } from '../constants/theme';

export default function StatusExample() {
  const { colors } = useTheme();
  const { isDarkMode } = useContext(DrawerContext);
  const styles = getStyles(colors);

  // Example statuses for different categories
  const attendanceStatuses = ['clocked-in', 'clocked-out', 'not-marked', 'late', 'present'];
  const leaveStatuses = ['approved', 'rejected', 'pending'];
  const verificationStatuses = ['approved', 'rejected', 'pending'];

  const renderStatusCard = (status, category, title) => {
    const config = getStatusConfig(status, category, isDarkMode);
    
    return (
      <Card key={`${category}-${status}`} style={[styles.card, { backgroundColor: config.background }]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.statusHeader}>
            <Circle size={16} color={config.primary} />
            <Text variant="titleSmall" style={[styles.statusTitle, { color: config.text }]}>
              {title}
            </Text>
          </View>
          <Text variant="bodyMedium" style={[styles.statusText, { color: config.text }]}>
            Status: {status}
          </Text>
          <View style={styles.colorInfo}>
            <Text variant="bodySmall" style={[styles.colorLabel, { color: config.text }]}>
              Primary: {config.primary}
            </Text>
            <Text variant="bodySmall" style={[styles.colorLabel, { color: config.text }]}>
              Background: {config.background}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.sectionTitle}>
        Status Configuration Examples
      </Text>
      
      {/* Attendance Statuses */}
      <Text variant="titleMedium" style={styles.categoryTitle}>
        Attendance Statuses
      </Text>
      <View style={styles.statusGrid}>
        {attendanceStatuses.map(status => 
          renderStatusCard(status, 'attendance', 'Attendance')
        )}
      </View>

      {/* Leave Statuses */}
      <Text variant="titleMedium" style={styles.categoryTitle}>
        Leave Request Statuses
      </Text>
      <View style={styles.statusGrid}>
        {leaveStatuses.map(status => 
          renderStatusCard(status, 'leave', 'Leave')
        )}
      </View>

      {/* Verification Statuses */}
      <Text variant="titleMedium" style={styles.categoryTitle}>
        Verification Statuses
      </Text>
      <View style={styles.statusGrid}>
        {verificationStatuses.map(status => 
          renderStatusCard(status, 'verification', 'Verification')
        )}
      </View>

      {/* Usage Examples */}
      <Card style={styles.usageCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.usageTitle}>
            Usage Examples
          </Text>
          <Text variant="bodySmall" style={styles.usageText}>
            • getStatusConfig('approved', 'leave', isDarkMode)
          </Text>
          <Text variant="bodySmall" style={styles.usageText}>
            • getStatusColor('pending', 'attendance', isDarkMode, 'primary')
          </Text>
          <Text variant="bodySmall" style={styles.usageText}>
            • getStatusColor('clocked-in', 'attendance', isDarkMode, 'background')
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    color: colors.onSurface,
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryTitle: {
    color: colors.onSurface,
    marginTop: 20,
    marginBottom: 12,
    fontWeight: '600',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  card: {
    width: '48%',
    marginBottom: 8,
  },
  cardContent: {
    padding: 12,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    marginLeft: 8,
    fontWeight: '600',
  },
  statusText: {
    marginBottom: 8,
  },
  colorInfo: {
    gap: 4,
  },
  colorLabel: {
    fontSize: 10,
  },
  usageCard: {
    marginTop: 20,
    backgroundColor: colors.surfaceVariant,
  },
  usageTitle: {
    color: colors.onSurface,
    marginBottom: 12,
    fontWeight: '600',
  },
  usageText: {
    color: colors.onSurfaceVariant,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
}); 