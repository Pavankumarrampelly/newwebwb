import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card";

//import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
//import { useAuth } from '../../hooks/useAuth';
//import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
//import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "../../hooks/use-toast";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    collegeId: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { name, email, password, confirmPassword, role, collegeId } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };
  
  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
    if (errors.role) {
      setErrors({ ...errors, role: null });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Invalid email format';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!collegeId.trim()) newErrors.collegeId = 'College ID is required';
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting registration form with data:', {
        name,
        email,
        password,
        role,
        collegeId
      });
      
      await register({
        name,
        email,
        password,
        role,
        collegeId
      });
      
      toast({
        title: "Success!",
        description: "Registration completed successfully",
      });
      
      navigate('/role-selection');
    } catch (error) {
      console.error('Registration error in form submission:', error);
      setErrors({ 
        form: error.msg || 'Registration failed. Please try again.' 
      });
      
      toast({
        title: "Registration Failed",
        description: error.msg || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Register</CardTitle>
        <CardDescription>
          Create an account to access college events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={handleChange}
              className={errors.password ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={handleRoleChange} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="collegeId">College ID</Label>
            <Input
              id="collegeId"
              name="collegeId"
              type="text"
              placeholder="Enter your college ID"
              value={collegeId}
              onChange={handleChange}
              className={errors.collegeId ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.collegeId && (
              <p className="text-sm text-red-500">{errors.collegeId}</p>
            )}
          </div>
          
          {errors.form && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.form}
            </div>
          )}
          
          <Button type="submit" className="w-full bg-college-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-college-primary hover:underline">
            Login
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;