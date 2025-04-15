import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { RadioGroup, RadioGroupItem } from "../ui/RadioGroup";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card";

const RoleSelectionForm = () => {
  const [formData, setFormData] = useState({
    role: 'student',
    collegeId: '',
  });
  
  const [errors, setErrors] = useState({});
  const { verifyId } = useAuth();
  const navigate = useNavigate();
  
  const { role, collegeId } = formData;
  
  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
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
    
    try {
      await verifyId(collegeId);
      navigate('/dashboard');
    } catch (error) {
      console.error('ID verification error:', error);
      if (error.msg) {
        setErrors({ form: error.msg });
      } else {
        setErrors({ form: 'ID verification failed. Please try again.' });
      }
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Role Selection</CardTitle>
        <CardDescription>
          Select your role and verify your college ID
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base">Select your role</Label>
            <RadioGroup value={role} onValueChange={handleRoleChange} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student" className="font-normal cursor-pointer">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="faculty" id="faculty" />
                <Label htmlFor="faculty" className="font-normal cursor-pointer">Faculty</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="font-normal cursor-pointer">Other</Label>
              </div>
            </RadioGroup>
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
            />
            {errors.collegeId && <p className="text-sm text-red-500">{errors.collegeId}</p>}
          </div>
          
          {errors.form && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.form}
            </div>
          )}
          
          <Button type="submit" className="w-full bg-college-primary">
            Continue
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          <Button
            variant="link"
            className="text-college-primary p-0 h-auto font-normal"
            onClick={() => navigate('/login')}
          >
            Go back to login
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RoleSelectionForm;