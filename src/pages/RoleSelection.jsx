import React from 'react';
import { Navigate } from 'react-router-dom';
import RoleSelectionForm from '../components/auth/RoleSelectionForm';
import { useAuth } from '../hooks/useAuth';

const RoleSelection = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Verify Your Identity
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Select your role and enter your college ID to continue
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <RoleSelectionForm />
      </div>
    </div>
  );
};

export default RoleSelection;