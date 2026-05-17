import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) return Promise.reject(error);
        const { data } = await axios.post(`${BASE_URL}/users/login/refresh/`, { refresh });
        localStorage.setItem('access_token', data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return axiosInstance(originalRequest);
      } catch {
        // Token expired — just clear storage, do NOT redirect.
        // The UI handles the unauthenticated state via Redux.
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
