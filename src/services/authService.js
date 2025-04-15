import axios from 'axios';

// Use a relative URL for local development or server-side environment
//const API_URL = "http://localhost:5000/api/auth";
//const API_URL = process.env.REACT_APP_API_URL;
const API_URL = "http://localhost:8000/api/auth";

// Set auth token for all requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

// Register user
const register = async (userData) => {
  try {
    console.log('Registering user with data:', userData);
    // For development purposes, use this mock response instead of the API call
    // to bypass backend requirements until it's fully set up
    /*const mockResponse = {
      data: {
        token: 'mock-jwt-token',
        user: {
          id: '123456',
          name: userData.name,
          email: userData.email,
          role: userData.role
        }
      }
    };*/
    
    // Uncomment below and remove mockResponse when backend is ready
    const response = await axios.post(`${API_URL}/register`, userData);
    //const response = mockResponse;
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', userData.role);
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error.response?.data || { msg: 'Server connection failed. Please try again.' };
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Verify college ID
const verifyId = async (collegeId) => {
  try {
    const response = await axios.post(`${API_URL}/verify-id`, { collegeId });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get current user
const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      const response = await axios.get(`${API_URL}/me`);
      return response.data;
    }
    return null;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuthToken(null);
    throw error.response?.data || { msg: 'Server Error' };
  }
};

// Update user skills
const updateSkills = async (skills) => {
  try {
    const response = await axios.put(`${API_URL}/skills`, { skills });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  setAuthToken(null);
};

// Check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

const authService = {
  register,
  login,
  verifyId,
  getCurrentUser,
  updateSkills,
  logout,
  isAuthenticated,
  setAuthToken
};

export default authService;
