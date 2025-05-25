/**
 * Security utilities for input validation and sanitization
 */

// Input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters and patterns
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/eval\s*\(/gi, '') // Remove eval calls
    .replace(/Function\s*\(/gi, '') // Remove Function constructor
    .replace(/setTimeout\s*\(/gi, '') // Remove setTimeout
    .replace(/setInterval\s*\(/gi, '') // Remove setInterval
    .trim();
};

// HTML encoding to prevent XSS
export const encodeHtml = (str) => {
  if (typeof str !== 'string') return str;
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

// URL validation
export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Email validation (more secure than regex)
export const isValidEmail = (email) => {
  const emailRegex = /^[^@\s]+@stud\.noroff\.no$/i;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
};

// Name validation - only allow safe characters
export const isValidName = (name) => {
  const nameRegex = /^[a-zA-Z0-9_\s-]+$/;
  return nameRegex.test(name) && name.length >= 2 && name.length <= 50;
};

// Search query validation
export const validateSearchQuery = (query) => {
  if (typeof query !== 'string') return false;
  
  // Prevent potential injection patterns
  const dangerousPatterns = [
    /[<>]/,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /Function\s*\(/i,
    /setTimeout\s*\(/i,
    /setInterval\s*\(/i,
    /document\./i,
    /window\./i,
    /\$\{/,
    /`/
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(query)) && query.length <= 100;
};

// Price validation
export const isValidPrice = (price) => {
  const numPrice = Number(price);
  return !isNaN(numPrice) && numPrice >= 0 && numPrice <= 10000;
};

// Guest count validation
export const isValidGuestCount = (count) => {
  const numCount = Number(count);
  return !isNaN(numCount) && numCount >= 1 && numCount <= 50;
};

// Content Security Policy helpers
export const createSecureHeaders = () => ({
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://v2.api.noroff.dev;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
});

// Rate limiting helper (client-side)
export const createRateLimiter = (maxRequests = 10, windowMs = 60000) => {
  const requests = new Map();
  
  return (key = 'default') => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old requests
    if (requests.has(key)) {
      requests.set(key, requests.get(key).filter(time => time > windowStart));
    } else {
      requests.set(key, []);
    }
    
    const currentRequests = requests.get(key);
    
    if (currentRequests.length >= maxRequests) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    currentRequests.push(now);
    return true;
  };
};

// Secure localStorage wrapper
export const secureStorage = {
  set(key, value) {
    try {
      const sanitizedKey = sanitizeInput(key);
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(sanitizedKey, serializedValue);
    } catch (error) {
      console.error('Secure storage set error:', error);
    }
  },
  
  get(key) {
    try {
      const sanitizedKey = sanitizeInput(key);
      const item = localStorage.getItem(sanitizedKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Secure storage get error:', error);
      return null;
    }
  },
  
  remove(key) {
    try {
      const sanitizedKey = sanitizeInput(key);
      localStorage.removeItem(sanitizedKey);
    } catch (error) {
      console.error('Secure storage remove error:', error);
    }
  }
};

// API request security wrapper
export const secureApiRequest = async (url, options = {}) => {
  // Validate URL
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL provided');
  }
  
  // Add security headers
  const secureOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };
  
  // Sanitize request body if present
  if (secureOptions.body && typeof secureOptions.body === 'string') {
    try {
      const parsedBody = JSON.parse(secureOptions.body);
      const sanitizedBody = sanitizeObjectInputs(parsedBody);
      secureOptions.body = JSON.stringify(sanitizedBody);
    } catch (error) {
      console.error('Error sanitizing request body:', error);
    }
  }
  
  return fetch(url, secureOptions);
};

// Recursively sanitize object inputs
const sanitizeObjectInputs = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeInput(obj) : obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObjectInputs);
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeInput(key);
    sanitized[sanitizedKey] = sanitizeObjectInputs(value);
  }
  
  return sanitized;
};

export default {
  sanitizeInput,
  encodeHtml,
  isValidUrl,
  isValidEmail,
  isValidName,
  validateSearchQuery,
  isValidPrice,
  isValidGuestCount,
  createSecureHeaders,
  createRateLimiter,
  secureStorage,
  secureApiRequest
}; 