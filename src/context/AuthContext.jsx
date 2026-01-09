import React, { createContext, useState, useEffect, useContext } from 'react';
import { hotelApi } from '../api/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await hotelApi.getProfile();
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      // Auto-logout if token is invalid
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await hotelApi.login({ email, password });
      console.log('Login response:', response); // Debug
      
      if (response.success && response.token) {
        // ✅ Store token
        localStorage.setItem('token', response.token);
        console.log('Token stored:', response.token.substring(0, 20) + '...');
        
        // ✅ Set user data
        setUser(response.data);
        setIsAuthenticated(true);
        
        return { 
          success: true, 
          message: 'Login successful',
          data: response.data 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Something went wrong' 
      };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      console.log('Registering:', { name, email }); // Debug
      
      const response = await hotelApi.register({ name, email, password, phone });
      console.log('Register response:', response); // Debug
      
      if (response.success) {
        // ✅ FIX: Store token if provided (backend returns token on register)
        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('Token stored from registration:', response.token.substring(0, 20) + '...');
          
          // ✅ Auto-login after registration
          setUser(response.data);
          setIsAuthenticated(true);
          
          return { 
            success: true, 
            message: 'Registration successful! You are now logged in.',
            autoLogin: true,
            data: response.data
          };
        } else {
          // If no token, ask to login manually
          return { 
            success: true, 
            message: 'Registration successful! Please login with your credentials.',
            autoLogin: false
          };
        }
      } else {
        return { 
          success: false, 
          message: response.message || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        message: error.message || 'Something went wrong' 
      };
    }
  };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};