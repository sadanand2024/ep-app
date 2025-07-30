import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme, ProgressBar } from 'react-native-paper';
import {
  Calendar,
  Beach,
  Briefcase,
  Star,
  CalendarX,
  Clock
} from 'lucide-react-native';

export default function LeaveBalance({ leaveBalances = [] }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const getIconComponent = (iconName) => {
    const iconMap = {
      'beach': Beach,
      'briefcase': Briefcase,
      'star': Star,
      'calendar': Calendar,
      'calendar-clock': Clock,
      'calendar-remove': CalendarX
    };
    return iconMap[iconName] || Calendar;
  };

  const calculateProgress = (used, total) => {
    if (total === 0) return 0;
    return used / total;
  };

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        {leaveBalances.length > 0 ? (
          leaveBalances.map((leave, index) => {
            const progress = calculateProgress(leave.used, leave.total);
            const remaining = leave.total - leave.used;

            return (
              <View key={index} style={styles.leaveItem}>
                <View style={styles.leaveHeader}>
                  <View style={styles.leaveTypeContainer}>
                    {React.createElement(getIconComponent(leave.icon), {
                      size: 20,
                      color: leave.color
                    })}
                    <Text variant="titleMedium" style={styles.leaveType}>
                      {leave.type}
                    </Text>
                  </View>
                  <View style={styles.balanceContainer}>
                    <Text variant="headlineSmall" style={[styles.balance, { color: leave.color }]}>
                      {remaining}
                    </Text>
                    <Text variant="bodySmall" style={styles.balanceLabel}>
                      remaining
                    </Text>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressLabels}>
                    <Text variant="bodySmall" style={styles.progressText}>
                      Used: {leave.used}
                    </Text>
                    <Text variant="bodySmall" style={styles.progressText}>
                      Total: {leave.total}
                    </Text>
                  </View>
                  <ProgressBar
                    progress={progress}
                    color={leave.color}
                    style={styles.progressBar}
                  />
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            {React.createElement(getIconComponent("calendar-remove"), {
              size: 48,
              color: colors.onSurfaceVariant
            })}
            <Text variant="bodyMedium" style={styles.emptyText}>
              No leave balance information available
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const getStyles = (colors) => StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    marginLeft: 8,
    color: colors.onSurface,
  },
  leaveItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leaveTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaveType: {
    marginLeft: 8,
    color: colors.onSurface,
    fontWeight: '600',
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balance: {
    fontWeight: 'bold',
    lineHeight: 24,
  },
  balanceLabel: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: colors.onSurfaceVariant,
    marginTop: 8,
    textAlign: 'center',
  },
}); 