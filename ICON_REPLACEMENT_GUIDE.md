# Icon Replacement Guide: react-native-vector-icons → Lucide React Native

## Overview
This guide helps you replace all `react-native-vector-icons/MaterialCommunityIcons` with `lucide-react-native` icons.

## Files Already Updated ✅
- `navigation/MainStack.js` - Tab navigation icons
- `components/DashboardCard.js` - Dashboard card icons
- `components/AttendanceButton.js` - Attendance button icons
- `components/NotificationBell.js` - Notification icons
- `components/ProfileHeader.js` - Header menu icon
- `components/LeaveRequestForm.js` - Form icons (calendar, send)
- `components/LeaveBalance.js` - Leave balance icons
- `components/VisionFaceRegistrationWizard.js` - Face registration icons (using react-native-vision-camera)
- `components/VisionCamera.js` - Camera interface icons (using react-native-vision-camera)

## Remaining Files to Update
- `components/StatusExample.js`
- `components/CalendarView.js`
- `components/AttendanceHistory.js`
- `screens/AttendanceScreen.js`
- `screens/CalendarScreen.js`
- `screens/LeaveScreen.js`
- `screens/DashboardScreen.js`
- `screens/ProfileScreen.js`

## Common Icon Mappings

### Navigation & UI Icons
| MaterialCommunityIcons | Lucide React Native |
|----------------------|-------------------|
| `arrow-left` | `ArrowLeft` |
| `arrow-right` | `ArrowRight` |
| `arrow-up` | `ArrowUp` |
| `arrow-down` | `ArrowDown` |
| `chevron-left` | `ChevronLeft` |
| `chevron-right` | `ChevronRight` |
| `chevron-up` | `ChevronUp` |
| `chevron-down` | `ChevronDown` |
| `close` | `X` |
| `menu` | `Menu` |
| `dots-vertical` | `MoreVertical` |
| `dots-horizontal` | `MoreHorizontal` |

### Time & Calendar Icons
| MaterialCommunityIcons | Lucide React Native |
|----------------------|-------------------|
| `clock` | `Clock` |
| `clock-out` | `Clock3` |
| `clock-in` | `Clock` |
| `calendar` | `Calendar` |
| `calendar-today` | `CalendarDays` |
| `calendar-clock` | `CalendarClock` |
| `calendar-star` | `Calendar` + `Star` |
| `timer` | `Timer` |

### User & Profile Icons
| MaterialCommunityIcons | Lucide React Native |
|----------------------|-------------------|
| `account` | `User` |
| `account-circle` | `UserCircle` |
| `account-plus` | `UserPlus` |
| `account-check` | `UserCheck` |
| `account-remove` | `UserX` |
| `face-recognition` | `Camera` |
| `camera` | `Camera` |
| `camera-outline` | `Camera` |

### Status & Feedback Icons
| MaterialCommunityIcons | Lucide React Native |
|----------------------|-------------------|
| `check-circle` | `CheckCircle` |
| `check-circle-outline` | `CheckCircle` |
| `alert-circle` | `AlertCircle` |
| `alert-circle-outline` | `AlertCircle` |
| `information` | `Info` |
| `information-outline` | `Info` |
| `exclamation` | `AlertTriangle` |
| `exclamation-thick` | `AlertTriangle` |

### Business & Work Icons
| MaterialCommunityIcons | Lucide React Native |
|----------------------|-------------------|
| `briefcase` | `Briefcase` |
| `briefcase-outline` | `Briefcase` |
| `office-building` | `Building` |
| `office-building-outline` | `Building` |
| `map-marker` | `MapPin` |
| `map-marker-outline` | `MapPin` |
| `home` | `Home` |
| `home-outline` | `Home` |

### Notification Icons
| MaterialCommunityIcons | Lucide React Native |
|----------------------|-------------------|
| `bell` | `Bell` |
| `bell-outline` | `Bell` |
| `bell-ring` | `BellRing` |
| `bell-off` | `BellOff` |
| `bell-off-outline` | `BellOff` |

### Data & Charts Icons
| MaterialCommunityIcons | Lucide React Native |
|----------------------|-------------------|
| `chart-line` | `TrendingUp` |
| `chart-bar` | `BarChart3` |
| `chart-pie` | `PieChart` |
| `trending-up` | `TrendingUp` |
| `trending-down` | `TrendingDown` |

## Implementation Pattern

### 1. Update Import Statement
```javascript
// OLD
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// NEW
import { 
  Clock, 
  Calendar, 
  User, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react-native';
```

### 2. Create Icon Mapping Function
```javascript
const getIconComponent = (iconName) => {
  const iconMap = {
    'clock': Clock,
    'calendar': Calendar,
    'user': User,
    'check-circle': CheckCircle,
    'alert-circle': AlertCircle
  };
  return iconMap[iconName] || Clock; // Default fallback
};
```

### 3. Replace Icon Usage
```javascript
// OLD
<Icon name="clock" size={24} color={colors.primary} />

// NEW
{React.createElement(getIconComponent("clock"), {
  size: 24,
  color: colors.primary
})}
```

### 4. For Button Icons
```javascript
// OLD
<Button icon="clock" />

// NEW
<Button 
  icon={({ size, color }) => (
    React.createElement(getIconComponent("clock"), {
      size: size,
      color: color
    })
  )}
/>
```

## Quick Replacement Script

You can use this pattern for each file:

1. **Find all Icon imports** and replace with Lucide imports
2. **Create getIconComponent function** with mappings for that file
3. **Replace all `<Icon name="..." />`** with `React.createElement(getIconComponent("..."), {...})`
4. **Update icon names** to match Lucide equivalents

## Testing
After each file update, test the build to ensure no errors:
```bash
cd android && ./gradlew assembleDebug
```

## Benefits of Lucide Icons
- ✅ Better performance (SVG-based)
- ✅ Consistent design language
- ✅ Smaller bundle size
- ✅ Better accessibility
- ✅ Modern, clean aesthetic
- ✅ Active maintenance 