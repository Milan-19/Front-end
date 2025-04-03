import { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if we're authenticated on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData.data || userData.user);
        } catch (error) {
          console.error('Authentication failed:', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await apiLogin(email, password);
      
      // Store token
      if (response.token) {
        localStorage.setItem('token', response.token);
      } else {
        throw new Error('No token received from server');
      }
      
      // Determine the user data structure and set it
      let userData = null;
      if (response.user) {
        userData = response.user;
      } else if (response.data && response.data.user) {
        userData = response.data.user;
      } else {
        // If no user data in response, fetch it separately
        const userDataResponse = await getCurrentUser();
        userData = userDataResponse.data;
      }
      
      // Set user and redirect
      setUser(userData);
      setLoading(false);
      
      // Explicitly navigate to home page
      navigate('/', { replace: true });
      
      return response;
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await apiRegister(name, email, password);
      
      // Store token
      if (response.token) {
        localStorage.setItem('token', response.token);
      } else {
        throw new Error('No token received from server');
      }
      
      // Determine the user data structure and set it
      let userData = null;
      if (response.user) {
        userData = response.user;
      } else if (response.data && response.data.user) {
        userData = response.data.user;
      } else {
        // If no user data in response, fetch it separately
        const userDataResponse = await getCurrentUser();
        userData = userDataResponse.data;
      }
      
      // Set user and redirect
      setUser(userData);
      setLoading(false);
      
      // Explicitly navigate to home page
      navigate('/', { replace: true });
      
      return response;
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 