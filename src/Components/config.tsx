import axios from 'axios';
import React from 'react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true; 

axios.interceptors.request.use((config) => {
  // No need to manually set token - cookies are automatic
  return config;
});

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/login'
    ) {
      originalRequest._retry = true;

      try {
        await axios.post('/auth/refresh', {}, { withCredentials: true });
        // cookies are updated by the server; just retry
        return axios(originalRequest);
      } catch (refreshError) {
        if (refreshError.response?.status === 401) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { API_BASE_URL };

export const RECAPTCHA_SITE_KEY = "6Ldc3xQsAAAAAAgE9R3wUnKhMS1ByJD77yP8Vj6E";

