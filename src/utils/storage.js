// Storage utility for centralized localStorage management
export const storage = {
  // Auth related storage
  getUser() {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  setUser(userData) {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  },

  getAccessToken() {
    return localStorage.getItem('accessToken');
  },

  setAccessToken(token) {
    localStorage.setItem('accessToken', token);
  },

  getApiKey() {
    return localStorage.getItem('apiKey');
  },

  setApiKey(key) {
    localStorage.setItem('apiKey', key);
  },

  // Auth session helpers
  getAuthData() {
    return {
      user: this.getUser(),
      accessToken: this.getAccessToken(),
      apiKey: this.getApiKey()
    };
  },

  hasCompleteAuth() {
    const { user, accessToken, apiKey } = this.getAuthData();
    return !!(user && accessToken && apiKey);
  },

  // Clear all auth data
  clearAuth() {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('apiKey');
  },

  // Generic storage methods
  get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage:`, error);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error storing ${key} to localStorage:`, error);
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  }
}; 