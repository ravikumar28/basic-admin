import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('user_name');
    
    if (token && userName) {
      setCurrentUser({ name: userName, token });
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      const { token, name } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user_name', name);
      
      setCurrentUser({ name, token });
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};