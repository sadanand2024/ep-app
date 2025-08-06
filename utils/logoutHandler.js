import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthLogout } from './auth';
import { emitAuthEvent, AUTH_EVENTS } from './authEventEmitter';

// Global logout handler that can be called from anywhere
export const handleGlobalLogout = async () => {
    try {
        // Clear all auth-related data
        await AuthLogout();
        
        // Clear any additional app data that should be removed on logout
        await AsyncStorage.removeItem('attendanceRecords');
        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('lastAttendanceDate');
        await AsyncStorage.removeItem('cameraPermissions');
        
        console.log('Global logout completed - all data cleared');
        
        // The AuthContext will automatically detect the token removal
        // and switch to the login screen via its useEffect
        return true;
    } catch (error) {
        console.error('Error during global logout:', error);
        return false;
    }
};

// Specific logout for API token invalidation
export const handleApiLogout = async () => {
    try {
        // Clear auth token and user data
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        
        console.log('API logout completed - auth data cleared');
        
        // Emit event to notify AuthContext about token removal
        emitAuthEvent(AUTH_EVENTS.TOKEN_REMOVED, { source: 'api' });
        
        return true;
    } catch (error) {
        console.error('Error during API logout:', error);
        return false;
    }
}; 