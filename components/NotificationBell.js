import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Badge, Menu, Divider, useTheme, TouchableRipple } from 'react-native-paper';
import { 
  Bell, 
  Clock, 
  Calendar, 
  Star, 
  BellRing, 
  BellOff,
  ChevronDown,
  CheckCircle
} from 'lucide-react-native';

export default function NotificationBell({ notifications = [], onNotificationPress }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  const [visible, setVisible] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'attendance': return 'check-circle';
      case 'leave': return 'calendar';
      case 'holiday': return 'star';
      case 'reminder': return 'bell-ring';
      default: return 'bell';
    }
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      'bell': Bell,
      'check-circle': CheckCircle,
      'calendar': Calendar,
      'star': Star,
      'bell-ring': BellRing,
      'bell-off': BellOff,
      'chevron-down': ChevronDown
    };
    return iconMap[iconName] || Bell;
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'attendance': return '#4caf50';
      case 'leave': return '#2196f3';
      case 'holiday': return '#ff9800';
      case 'reminder': return '#9c27b0';
      default: return colors.primary;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  const handleNotificationPress = (notification) => {
    setVisible(false);
    if (onNotificationPress) {
      onNotificationPress(notification);
    }
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <View style={styles.iconContainer}>
            <TouchableRipple
              onPress={() => setVisible(true)}
              style={styles.iconButton}
              borderless
            >
              <View style={styles.iconWrapper}>
                {React.createElement(getIconComponent("bell"), {
                  size: 24,
                  color: colors.onSurface
                })}
              </View>
            </TouchableRipple>
            {unreadCount > 0 && (
              <Badge
                size={16}
                style={styles.badge}
                contentStyle={styles.badgeContent}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </View>
        }
        contentStyle={styles.menu}
      >
        <View style={styles.menuHeader}>
          {React.createElement(getIconComponent("bell"), {
            size: 20,
            color: colors.primary
          })}
          <Text variant="titleMedium" style={styles.menuTitle}>
            Notifications
          </Text>
        </View>
        
        <Divider />
        
        {notifications.length > 0 ? (
          notifications.slice(0, 5).map((notification, index) => (
            <View key={notification.id || index}>
              <Menu.Item
                onPress={() => handleNotificationPress(notification)}
                title={notification.title}
                description={notification.message}
                leadingIcon={() => (
                  React.createElement(getIconComponent(getNotificationIcon(notification.type)), {
                    size: 20,
                    color: getNotificationColor(notification.type)
                  })
                )}
                trailingIcon={() => (
                  !notification.read && (
                    <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                  )
                )}
                style={[
                  styles.menuItem,
                  !notification.read && styles.unreadItem
                ]}
                titleStyle={[
                  styles.menuItemTitle,
                  !notification.read && styles.unreadTitle
                ]}
                descriptionStyle={styles.menuItemDescription}
              />
              {index < notifications.length - 1 && <Divider />}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            {React.createElement(getIconComponent("bell-off"), {
              size: 48,
              color: colors.onSurfaceVariant
            })}
            <Text variant="bodyMedium" style={styles.emptyText}>
              No notifications
            </Text>
          </View>
        )}
        
        {notifications.length > 5 && (
          <>
            <Divider />
            <Menu.Item
              onPress={() => {
                setVisible(false);
                // Navigate to full notifications screen
              }}
              title="View all notifications"
              leadingIcon={() => (
                React.createElement(getIconComponent("chevron-down"), {
                  size: 20,
                  color: colors.onSurfaceVariant
                })
              )}
              style={styles.viewAllItem}
            />
          </>
        )}
      </Menu>
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    position: 'relative',
  },
  iconContainer: {
    position: 'relative',
  },
  iconButton: {
    margin: 0,
    borderRadius: 20,
  },
  iconWrapper: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
  },
  badgeContent: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  menu: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginTop: 8,
    minWidth: 300,
    maxWidth: 350,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  menuTitle: {
    color: colors.onSurface,
    fontWeight: '600',
  },
  menuItem: {
    paddingVertical: 8,
  },
  unreadItem: {
    backgroundColor: colors.primaryContainer,
  },
  menuItemTitle: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: '500',
  },
  unreadTitle: {
    fontWeight: '600',
  },
  menuItemDescription: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    color: colors.onSurfaceVariant,
    marginTop: 8,
    textAlign: 'center',
  },
  viewAllItem: {
    paddingVertical: 8,
  },
}); 