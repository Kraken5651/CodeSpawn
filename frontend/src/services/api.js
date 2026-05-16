import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Add a request interceptor for JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const apiError = error.response?.data?.error;

    if (status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new CustomEvent('codespawn:auth-expired'));
    }

    const message = apiError?.message || error.message || 'Request failed';
    return Promise.reject(new ApiError(message, {
      status,
      code: apiError?.code || 'REQUEST_FAILED',
      details: apiError?.details,
    }));
  }
);

export default api;
