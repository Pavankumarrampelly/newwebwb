import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Label } from '../components/ui/Label';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';
import axios from 'axios';

const HostLogin = () => {
  const [hostId, setHostId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hostId.trim()) {
      toast.error('Please enter a Host ID');
      return;
    }
    
    setLoading(true);
    
    try {
      // Verify host ID with backend
      const response = await axios.post('/api/auth/verify-host', { hostId });
      
      if (response.data.success) {
        // Store host authentication status in localStorage
        localStorage.setItem('isHost', 'true');
        localStorage.setItem('hostId', hostId);
        
        toast.success('Host access granted');
        navigate('/host-dashboard');
      } else {
        toast.error('Invalid Host ID');
      }
    } catch (error) {
      console.error('Host verification failed:', error);
      toast.error(error.response?.data?.msg || 'Failed to verify Host ID');
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Host Login</CardTitle>
          <CardDescription className="text-center">
            Enter your Host ID to access the management dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hostId">Host ID</Label>
              <Input
                id="hostId"
                placeholder="Enter your host ID"
                value={hostId}
                onChange={(e) => setHostId(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-college-primary hover:bg-college-primary/90" 
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Access Host Dashboard'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default HostLogin;