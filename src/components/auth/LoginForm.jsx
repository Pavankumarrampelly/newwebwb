/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from "../ui/Button";  
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { email, password } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    try {
      await login({ email, password });
      navigate('/role-selection');
    } catch (error) {
      console.error('Login error:', error);
      if (error.msg) {
        setErrors({ form: error.msg });
      } else {
        setErrors({ form: 'Login failed. Please try again.' });
      }
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handleChange}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
          
          {errors.form && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.form}
            </div>
          )}
          
          <Button type="submit" className="w-full bg-college-primary">
            Login
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/register" className="text-college-primary hover:underline">
            Register
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;*/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from "../ui/Button";  
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card";
import { useToast } from '../../hooks/use-toast';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { email, password } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Attempting to login with:', { email, password });
      await login({ email, password });
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error in component:', error);
      toast({
        title: "Login Failed",
        description: error.msg || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      setErrors({ form: error.msg || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              disabled={loading}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handleChange}
              className={errors.password ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
          
          {errors.form && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.form}
            </div>
          )}
          
          <Button type="submit" className="w-full bg-college-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="mr-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/register" className="text-college-primary hover:underline">
            Register
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;