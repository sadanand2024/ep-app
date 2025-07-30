// API Configuration
export const API_CONFIG = {
  // Replace with your actual backend API URL
  BASE_URL: 'https://your-backend-api.com/api',
  

  
  // Attendance endpoints
  ATTENDANCE: {
    PUNCH_IN: '/attendance/punch-in',
    PUNCH_OUT: '/attendance/punch-out',
    HISTORY: '/attendance/history',
  },
  
  // User endpoints
  USER: {
    PROFILE: '/users',
  },
  
  // Timeout settings
  TIMEOUT: 30000, // 30 seconds
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// AWS Rekognition Configuration (for backend reference)
export const AWS_CONFIG = {
  REGION: 'us-east-1', // Replace with your AWS region
  COLLECTION_ID: 'employee-faces', // Replace with your Rekognition collection ID
  SIMILARITY_THRESHOLD: 90, // Minimum similarity percentage (0-100)
  MAX_FACES: 1, // Maximum number of faces to detect
};

// App Configuration
export const APP_CONFIG = {
  // Location settings
  LOCATION: {
    UPDATE_INTERVAL: 10000, // 10 seconds
    ACCURACY: 'high',
    DISTANCE_FILTER: 10, // meters
  },
  
  // Camera settings
  CAMERA: {
    QUALITY: 0.8,
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
  },
  

  
  // Demo mode settings
  DEMO: {
    ENABLED: true, // Set to false in production
    SUCCESS_RATE: 0.9, // 90% success rate in demo mode
  },
};

// Environment Configuration
export const ENV_CONFIG = {
  // Set this to 'development', 'staging', or 'production'
  ENVIRONMENT: 'development',
  
  // Enable/disable features based on environment
  FEATURES: {
    LOCATION_VERIFICATION: true,
    REAL_TIME_UPDATES: true,
    PUSH_NOTIFICATIONS: true,
  },
  
  // Logging configuration
  LOGGING: {
    LEVEL: 'debug', // 'debug', 'info', 'warn', 'error'
    ENABLE_CONSOLE: true,
    ENABLE_REMOTE: false,
  },
};

// Helper function to get API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to check if demo mode is enabled
export const isDemoMode = () => {
  return APP_CONFIG.DEMO.ENABLED && ENV_CONFIG.ENVIRONMENT === 'development';
};

// Helper function to get environment-specific configuration
export const getEnvConfig = () => {
  return {
    ...API_CONFIG,
    ...APP_CONFIG,
    ...ENV_CONFIG,
  };
}; 