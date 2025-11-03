import axios from 'axios';
import React from 'react';
// For Vite projects, use this instead:
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 


axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true; // Good for cookie handling

axios.interceptors.request.use((config) => {
  // No need to manually set token - cookies are automatic
  return config;
});

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Handle 401s only for authenticated routes
    if (error.response?.status === 401 && 
        !originalRequest._retry &&
        originalRequest.url !== '/auth/login') {
      originalRequest._retry = true;
      
      try {
        // Add CSRF protection for refresh requests
        await axios.get('/auth/csrf-token'); 
        const { data } = await axios.post('/auth/refresh');
        
        // Update Authorization header if using Bearer tokens
        if(data.accessToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        }
        
        return axios(originalRequest);
      } catch (refreshError) {
        // Handle specific error cases
        if(refreshError.response?.status === 401) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
export { API_BASE_URL }; 

