import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import HostNavbar from '../components/host/HostNavbar';
import ManageEvents from '../components/host/ManageEvents';
import ManageFood from '../components/host/ManageFood';
import ManageParking from '../components/host/ManageParking';

const HostDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  
  // Check if user is authenticated as host
  useEffect(() => {
    const isHost = localStorage.getItem('isHost') === 'true';
    if (!isHost) {
      toast.error('Host authentication required');
      navigate('/host-login');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('isHost');
    localStorage.removeItem('hostId');
    toast.success('Host logged out successfully');
    navigate('/host-login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <HostNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Host Dashboard</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="events">Manage Events</TabsTrigger>
            <TabsTrigger value="food">Manage Food</TabsTrigger>
            <TabsTrigger value="parking">Manage Parking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <ManageEvents />
          </TabsContent>
          
          <TabsContent value="food">
            <ManageFood />
          </TabsContent>
          
          <TabsContent value="parking">
            <ManageParking />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HostDashboard;