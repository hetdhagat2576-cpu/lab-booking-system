import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('lab_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Only set user if email is verified or if it's a registration flow
        if (userData.emailVerified || userData.isEmailVerified) {
          setUser(userData);
          // Ensure token is also stored separately
          if (userData.token) {
            localStorage.setItem('token', userData.token);
          }
        } else {
          // Clear unverified user data
          localStorage.removeItem('lab_user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('lab_user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData) => {
    console.log('AuthContext - Login called with userData:', userData);
    console.log('Token present in userData:', !!userData?.token);
    localStorage.setItem('lab_user', JSON.stringify(userData));
    
    // Also store token separately for easy access in payment and other components
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('lab_user');
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const updateUser = useCallback((userData) => {
    localStorage.setItem('lab_user', JSON.stringify(userData));
    
    // Also update token if present
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    
    setUser(userData);
  }, []);

  const value = {
    user,
    setUser,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user && (user.emailVerified || user.isEmailVerified),
    isAdmin: user?.role === 'admin',
    isLabTechnician: user?.role === 'labtechnician',
    isUser: !user?.role || user?.role === 'user',
    isEmailVerified: user?.emailVerified || user?.isEmailVerified || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

