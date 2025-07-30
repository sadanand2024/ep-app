import { getToken } from './auth';
import { API_CONFIG, getApiUrl, isDemoMode } from './config';
import axios from 'axios';

// Retry configuration
const retryConfig = {
  retries: API_CONFIG.MAX_RETRIES,
  retryDelay: API_CONFIG.RETRY_DELAY,
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  },
};

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error);
    
    // Handle 401 errors by clearing token and redirecting to login
    if (error.response?.status === 401) {
      // You can add logout logic here if needed
      console.log('Unauthorized access, token may be expired');
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('Request timeout');
    }
    
    // Retry logic for network errors and 5xx server errors
    const config = error.config;
    if (config && !config._retry && retryConfig.retryCondition(error)) {
      config._retry = true;
      config._retryCount = (config._retryCount || 0) + 1;
      
      if (config._retryCount <= retryConfig.retries) {
        console.log(`Retrying request (${config._retryCount}/${retryConfig.retries})`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryConfig.retryDelay));
        
        return apiClient(config);
      }
    }
    
    return Promise.reject(error);
  }
);



// Attendance API
export const attendanceAPI = {
  // Punch in with face recognition
  punchIn: async (attendanceData) => {
    try {
      const response = await apiClient.post(API_CONFIG.ATTENDANCE.PUNCH_IN, attendanceData);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Punch in API error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Punch in failed',
      };
    }
  },

  // Punch out with face recognition
  punchOut: async (attendanceData) => {
    try {
      const response = await apiClient.post(API_CONFIG.ATTENDANCE.PUNCH_OUT, attendanceData);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Punch out API error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Punch out failed',
      };
    }
  },

  // Get attendance history
  getAttendanceHistory: async (userId, startDate, endDate) => {
    try {
      const response = await apiClient.get(API_CONFIG.ATTENDANCE.HISTORY, {
        params: {
          userId,
          startDate,
          endDate,
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Get attendance history API error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get attendance history',
      };
    }
  },
};

// User API
export const userAPI = {
  // Get user profile
  getProfile: async (userId) => {
    try {
      const response = await apiClient.get(`${API_CONFIG.USER.PROFILE}/${userId}`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Get user profile API error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get user profile',
      };
    }
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    try {
      const response = await apiClient.put(`${API_CONFIG.USER.PROFILE}/${userId}`, profileData);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Update user profile API error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update user profile',
      };
    }
  },
};

// Utility function to handle API errors
export const handleAPIError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || defaultMessage;
    
    switch (status) {
      case 401:
        return 'Authentication failed. Please login again.';
      case 403:
        return 'Access denied. You don\'t have permission for this action.';
      case 404:
        return 'Resource not found.';
      case 422:
        return 'Invalid data provided.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return message;
    }
  } else if (error.request) {
    // Network error (axios specific)
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return error.message || defaultMessage;
  }
}; 