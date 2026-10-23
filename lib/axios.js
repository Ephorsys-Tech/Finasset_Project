import axios from 'axios';

/**
 * Global Axios Instance for Finasset API
 * Configured with base settings, credentials for authentication, and robust error handling.
 */
const axiosInstance = axios.create({
  baseURL: typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // If sending FormData, let the browser set the boundary header automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';
    
    // Create an enriched error object
    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    customError.isAxiosError = true;
    
    return Promise.reject(customError);
  }
);

export { axiosInstance, axiosInstance as apiClient };
export default axiosInstance;
