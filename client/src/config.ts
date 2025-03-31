// Configuration for environment-specific settings

// API base URL - uses relative paths in production, absolute in development
export const API_BASE_URL = 
  import.meta.env.PROD 
    ? '/api' // In production, use relative paths
    : 'http://localhost:3000/api'; // In development, use absolute URL with localhost 