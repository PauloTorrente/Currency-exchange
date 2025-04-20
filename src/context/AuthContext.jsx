import React, { createContext, useContext, useState, useEffect } from 'react';
import { login } from '../services/authService.jsx'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    isAuthenticated: false,
    role: null,
    user: null,
    isLoading: true
  });

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');

    if (token && userRole) {
      setAuthData({
        isAuthenticated: true,
        role: userRole,
        user: { email: userEmail, role: userRole },
        isLoading: false
      });
    } else {
      setAuthData(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  }, []);

  const loginUser = async (email, password) => {
    try {
      const { token, user } = await login(email, password);
      
      // Armazena os dados no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.email);
      
      setAuthData({
        isAuthenticated: true,
        role: user.role,
        user: user,
        isLoading: false
      });
      
      return user;
    } catch (error) {
      setAuthData({
        isAuthenticated: false,
        role: null,
        user: null,
        isLoading: false
      });
      throw error;
    }
  };

  const logoutUser = () => {
    // Remove os dados do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    setAuthData({
      isAuthenticated: false,
      role: null,
      user: null,
      isLoading: false
    });
  };

  return (
    <AuthContext.Provider value={{ 
      authData, 
      loginUser, 
      logoutUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
