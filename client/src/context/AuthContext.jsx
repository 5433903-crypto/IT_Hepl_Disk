import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, seedDatabase } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('campus_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await getCurrentUser();
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.error('Failed to load user profile with existing token', err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (identifier, password) => {
    try {
      const res = await loginUser({ identifier, password });
      if (res.data.success) {
        localStorage.setItem('campus_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid credentials',
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerUser(userData);
      if (res.data.success) {
        return { success: true, user: res.data.user };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('campus_token');
    setToken(null);
    setUser(null);
  };

  // Quick Switcher for College Demo Presentation
  const demoLogin = async (roleType) => {
    if (roleType === 'admin') {
      return await login('admin@campus.edu', 'Admin@123');
    } else if (roleType === 'tech') {
      return await login('tech@campus.edu', 'Tech@123');
    } else if (roleType === 'student2') {
      return await login('CS-2022-018', 'Student@123');
    } else {
      // Default student Aarav
      return await login('CS-2022-042', 'Student@123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        demoLogin,
        isAdmin: user?.role === 'admin' || user?.role === 'technician',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
