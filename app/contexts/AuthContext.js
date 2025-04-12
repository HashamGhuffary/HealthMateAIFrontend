import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../api/apiService';

// Create the context
export const AuthContext = createContext();

// Custom hook to use the Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on app start
  useEffect(() => {
    loadUser();
  }, []);

  // Load user from secure storage
  const loadUser = async () => {
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        await fetchUserProfile();
      }
    } catch (error) {
      console.error('Failed to load user', error);
      setError('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user profile from API
  const fetchUserProfile = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      await logout();
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      const { user, tokens } = response.data;
      
      // Store tokens securely
      await SecureStore.setItemAsync('auth_token', tokens.access);
      await SecureStore.setItemAsync('refresh_token', tokens.refresh);
      
      setUser(user);
      return user;
    } catch (error) {
      console.error('Login failed', error);
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      const { user, tokens } = response.data;
      
      // Store tokens securely
      await SecureStore.setItemAsync('auth_token', tokens.access);
      await SecureStore.setItemAsync('refresh_token', tokens.refresh);
      
      // Make sure to set the user state
      setUser(user);
      return { user, tokens };
    } catch (error) {
      console.error('Registration failed', error);
      const errorMessages = error.response?.data || {};
      const formattedError = Object.keys(errorMessages)
        .map(key => `${key}: ${errorMessages[key].join(', ')}`)
        .join('\n');
      setError(formattedError || 'Registration failed. Please try again.');
      throw new Error(formattedError || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.updateProfile(userData);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Update profile failed', error);
      const errorMessages = error.response?.data || {};
      const formattedError = Object.keys(errorMessages)
        .map(key => `${key}: ${errorMessages[key].join(', ')}`)
        .join('\n');
      setError(formattedError || 'Profile update failed. Please try again.');
      throw new Error(formattedError || 'Profile update failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      // Clear secure storage
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('refresh_token');
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Context value to be provided
  const authContextValue = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    refreshUser: fetchUserProfile,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 