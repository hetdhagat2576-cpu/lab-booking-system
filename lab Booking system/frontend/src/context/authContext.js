import React, { createContext, useContext, useState, useEffect } from 'react';

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
        } else {
          // Clear unverified user data
          localStorage.removeItem('lab_user');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('lab_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log('AuthContext - Login called with userData:', userData);
    console.log('Token present in userData:', !!userData?.token);
    localStorage.setItem('lab_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('lab_user');
    setUser(null);
  };

  const updateUser = (userData) => {
    localStorage.setItem('lab_user', JSON.stringify(userData));
    setUser(userData);
  };

  const value = {
    user,
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

