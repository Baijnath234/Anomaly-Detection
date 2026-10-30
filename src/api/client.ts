import axios from 'axios';

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected server error occurred.';
    return Promise.reject(new Error(Array.isArray(message) ? message.join(', ') : message));
  },
);

