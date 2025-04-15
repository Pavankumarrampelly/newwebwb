import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { useToast } from '../hooks/use-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if we have a token
        if (localStorage.getItem('token')) {
          authService.setAuthToken(localStorage.getItem('token'));
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        setError(err.message);
        toast({
          title: "Authentication Error",
          description: "Session expired. Please login again.",
          variant: "destructive",
        });
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('Registering with data:', userData);
      const response = await authService.register(userData);
      setUser(await authService.getCurrentUser() || {
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
      });
      return response;
    } catch (err) {
      console.error('Registration error in context:', err);
      const errorMessage = err.msg || "An error occurred during registration.";
      setError(errorMessage);
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.login(userData);
      setUser(await authService.getCurrentUser());
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      return response;
    } catch (err) {
      setError(err.msg || "Login failed");
      toast({
        title: "Login Failed",
        description: err.msg || "Invalid credentials.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyId = async (collegeId) => {
    try {
      setLoading(true);
      const response = await authService.verifyId(collegeId);
      toast({
        title: "ID Verified",
        description: "Your college ID has been verified.",
      });
      return response;
    } catch (err) {
      setError(err.msg || "ID verification failed");
      toast({
        title: "Verification Failed",
        description: err.msg || "Invalid college ID.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSkills = async (skills) => {
    try {
      setLoading(true);
      const updatedUser = await authService.updateSkills(skills);
      setUser(updatedUser);
      toast({
        title: "Skills Updated",
        description: "Your skills have been updated successfully.",
      });
      return updatedUser;
    } catch (err) {
      setError(err.msg || "Failed to update skills");
      toast({
        title: "Update Failed",
        description: err.msg || "Failed to update skills.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        verifyId,
        logout,
        updateSkills,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;