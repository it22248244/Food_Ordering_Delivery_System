import { useState, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

/**
 * Custom hook for making API calls with authentication and loading state management
 */
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useSelector(state => state.auth);

  // Create a configured axios instance
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add authorization header if token exists
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Intercept responses to handle common errors
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        // The request was made and the server responded with an error status
        if (error.response.status === 401) {
          // Unauthorized - handle token expiration
          console.log('Unauthorized request - token may be expired');
          // Clear the token from localStorage
          localStorage.removeItem('token');
          // Return a more detailed error object
          return Promise.reject({
            status: 401,
            message: 'Your session has expired. Please log in again.'
          });
        } else if (error.response.status === 403) {
          // Forbidden - permission denied
          return Promise.reject({
            status: 403,
            message: error.response.data.message || 'You do not have permission to perform this action'
          });
        }
        return Promise.reject(error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        return Promise.reject({ 
          status: 0,
          message: 'Network error. Please check your connection.' 
        });
      } else {
        // Something else caused the error
        return Promise.reject({ 
          status: 0,
          message: 'An error occurred. Please try again.' 
        });
      }
    }
  );

  // Generic request function
  const request = useCallback(async (method, url, data = null, customConfig = {}) => {
    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        url,
        ...customConfig,
      };

      if (data) {
        config.data = data;
      }

      const response = await api(config);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.message || 'An error occurred');
      setLoading(false);
      throw err;
    }
  }, [api]);

  // Convenience methods for common HTTP methods
  const get = useCallback((url, config = {}) => 
    request('get', url, null, config), [request]);
  
  const post = useCallback((url, data, config = {}) => 
    request('post', url, data, config), [request]);
  
  const put = useCallback((url, data, config = {}) => 
    request('put', url, data, config), [request]);
  
  const patch = useCallback((url, data, config = {}) => 
    request('patch', url, data, config), [request]);
  
  const del = useCallback((url, config = {}) => 
    request('delete', url, null, config), [request]);

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del, // 'delete' is a reserved keyword, so use 'del' as the function name
  };
};

export default useApi;