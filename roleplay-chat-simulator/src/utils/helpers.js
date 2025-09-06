import { STORAGE_KEYS } from './constants.js';

// Generate unique IDs for messages
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format timestamp for display
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Local storage utilities
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  }
};

// Chat history utilities
export const chatHistory = {
  save: (characterId, messages) => {
    const allHistory = storage.get(STORAGE_KEYS.CHAT_HISTORY) || {};
    allHistory[characterId] = {
      messages,
      lastUpdated: new Date().toISOString()
    };
    storage.set(STORAGE_KEYS.CHAT_HISTORY, allHistory);
  },

  load: (characterId) => {
    const allHistory = storage.get(STORAGE_KEYS.CHAT_HISTORY) || {};
    return allHistory[characterId]?.messages || [];
  },

  clear: (characterId) => {
    const allHistory = storage.get(STORAGE_KEYS.CHAT_HISTORY) || {};
    delete allHistory[characterId];
    storage.set(STORAGE_KEYS.CHAT_HISTORY, allHistory);
  }
};

// Debounce utility for API calls
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Scroll to bottom utility
export const scrollToBottom = (element, smooth = true) => {
  if (element) {
    element.scrollTo({
      top: element.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }
};

// Text processing utilities
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const sanitizeText = (text) => {
  return text.replace(/<[^>]*>/g, '').trim();
};

// Theme utilities
export const getThemeClasses = (character) => {
  if (!character) return {};
  
  return {
    background: character.backgroundColor,
    text: character.textColor,
    border: character.borderColor,
    primary: character.themeColor
  };
};