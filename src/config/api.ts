// Environment configuration
const getApiBaseUrl = (): string => {
  // Vite exposes env variables through import.meta.env
  // Variables must be prefixed with VITE_ to be exposed
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('ecopick_auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};
