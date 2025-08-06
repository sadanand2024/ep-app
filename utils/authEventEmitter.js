// Simple event emitter for React Native (no Node.js dependencies)
class AuthEventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(eventType, callback) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
  }

  off(eventType, callback) {
    if (this.listeners[eventType]) {
      this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
    }
  }

  emit(eventType, data = {}) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in auth event callback:', error);
        }
      });
    }
  }

  removeAllListeners(eventType) {
    if (eventType) {
      delete this.listeners[eventType];
    } else {
      this.listeners = {};
    }
  }
}

const authEventEmitter = new AuthEventEmitter();

// Event types
export const AUTH_EVENTS = {
  TOKEN_REMOVED: 'token_removed',
  TOKEN_ADDED: 'token_added',
  USER_LOGOUT: 'user_logout',
  USER_LOGIN: 'user_login'
};

// Emit auth events
export const emitAuthEvent = (eventType, data = {}) => {
  authEventEmitter.emit(eventType, data);
};

// Listen to auth events
export const onAuthEvent = (eventType, callback) => {
  authEventEmitter.on(eventType, callback);
  
  // Return unsubscribe function
  return () => {
    authEventEmitter.off(eventType, callback);
  };
};

// Remove specific listener
export const offAuthEvent = (eventType, callback) => {
  authEventEmitter.off(eventType, callback);
};

export default authEventEmitter; 