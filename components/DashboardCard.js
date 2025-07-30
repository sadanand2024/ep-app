import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { 
  Clock, 
  Calendar, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react-native';

export default function DashboardCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  iconColor, 
  status, 
  onPress 
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const getStatusColor = () => {
    switch (status) {
      case 'success': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'error': return '#f44336';
      case 'info': return '#2196f3';
      default: return colors.primary;
    }
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      'clock': Clock,
      'calendar': Calendar,
      'user-check': UserCheck,
      'user-x': UserX,
      'trending-up': TrendingUp,
      'alert-circle': AlertCircle,
      'check-circle': CheckCircle,
      'x-circle': XCircle,
      'info': Info,
      'account-check': UserCheck,
      'calendar-clock': Clock,
      'calendar-star': Calendar
    };
    return iconMap[iconName] || Info;
  };

  return (
    <Card 
      style={[styles.card, { borderLeftColor: getStatusColor() }]} 
      onPress={onPress}
      mode="outlined"
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.iconContainer}>
          {React.createElement(getIconComponent(icon), {
            size: 24,
            color: iconColor || getStatusColor()
          })}
        </View>
        <View style={styles.textContainer}>
          <Text variant="titleMedium" style={styles.title}>
            {title}
          </Text>
          <Text variant="headlineSmall" style={styles.value}>
            {value}
          </Text>
          {subtitle && (
            <Text variant="bodySmall" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const getStyles = (colors) => StyleSheet.create({
  card: {
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 40,
  },
  title: {
    color: colors.onSurface,
    marginBottom: 4,
  },
  value: {
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    color: colors.onSurfaceVariant,
  },
}); 