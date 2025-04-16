
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardContent } from '../ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Plus, Trash2, Car } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const ManageParking = () => {
  const [parkingSlots, setParkingSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('slots');
  
  const [newSlot, setNewSlot] = useState({
    slotNumber: '',
    area: '',
    vehicleType: 'car'
  });
  
  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        setLoading(true);
        // Fetch all parking slots
        const slotsResponse = await axios.get('/api/parking/all');
        setParkingSlots(slotsResponse.data);
        
        // Fetch all bookings
        const bookingsResponse = await axios.get('/api/parking/bookings');
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error('Failed to fetch parking data:', error);
        toast.error('Failed to load parking management data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchParkingData();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSlot(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleVehicleTypeChange = (value) => {
    setNewSlot(prev => ({
      ...prev,
      vehicleType: value
    }));
  };
  
  const handleAddSlot = async (e) => {
    e.preventDefault();
    
    if (!newSlot.slotNumber || !newSlot.area) {
      toast.error('Slot number and area are required');
      return;
    }
    
    try {
      // Add new parking slot
      const response = await axios.post('/api/parking/slots', newSlot);
      setParkingSlots(prev => [...prev, response.data]);
      toast.success('Parking slot added successfully');
      
      // Reset form
      setNewSlot({
        slotNumber: '',
        area: '',
        vehicleType: 'car'
      });
    } catch (error) {
      console.error('Failed to add parking slot:', error);
      toast.error(error.response?.data?.msg || 'Failed to add parking slot');
    }
  };
  
  const handleDeleteSlot = async (id) => {
    if (window.confirm('Are you sure you want to delete this parking slot?')) {
      try {
        await axios.delete(`/api/parking/slots/${id}`);
        setParkingSlots(prev => prev.filter(slot => slot._id !== id));
        toast.success('Parking slot deleted successfully');
      } catch (error) {
        console.error('Failed to delete parking slot:', error);
        toast.error('Failed to delete parking slot');
      }
    }
  };
  
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`/api/parking/bookings/${bookingId}`);
        setBookings(prev => prev.filter(booking => booking._id !== bookingId));
        
        // Update slot status
        setParkingSlots(prev => prev.map(slot => {
          const booking = bookings.find(b => b._id === bookingId);
          if (booking && slot._id === booking.slotId) {
            return { ...slot, isBooked: false, bookedBy: null };
          }
          return slot;
        }));
        
        toast.success('Booking cancelled successfully');
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        toast.error('Failed to cancel booking');
      }
    }
  };
  
  const getVehicleTypeLabel = (type) => {
    switch (type) {
      case 'car': return 'Car';
      case 'bike': return 'Bike';
      case 'bus': return 'Bus';
      default: return 'Other';
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="slots">Parking Slots</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="slots">
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Add New Parking Slot</h3>
              <form onSubmit={handleAddSlot}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slotNumber">Slot Number</Label>
                    <Input
                      id="slotNumber"
                      name="slotNumber"
                      value={newSlot.slotNumber}
                      onChange={handleInputChange}
                      placeholder="A-123"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      name="area"
                      value={newSlot.area}
                      onChange={handleInputChange}
                      placeholder="North Building"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Select
                      value={newSlot.vehicleType}
                      onValueChange={handleVehicleTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button type="submit" className="mt-4 bg-college-primary hover:bg-college-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Parking Slot
                </Button>
              </form>
            </Card>
            
            <h3 className="text-lg font-medium mt-8">Parking Slots</h3>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="p-4">
                    <div className="animate-pulse space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {parkingSlots.length === 0 ? (
                  <p className="text-muted-foreground col-span-3">No parking slots found. Add your first slot above.</p>
                ) : (
                  parkingSlots.map(slot => (
                    <Card key={slot._id} className="overflow-hidden">
                      <CardContent className="p-4 flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4" />
                            <h4 className="font-semibold">{slot.slotNumber}</h4>
                            {slot.isBooked ? (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                Booked
                              </span>
                            ) : (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Available
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">Area: {slot.area}</p>
                          <p className="text-sm">Vehicle: {getVehicleTypeLabel(slot.vehicleType)}</p>
                          
                          {slot.isBooked && (
                            <div className="mt-2 text-sm">
                              <p>Booked for: {formatDate(slot.bookingDate)}</p>
                              {slot.vehicleNumber && (
                                <p>Vehicle #: {slot.vehicleNumber}</p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {!slot.isBooked && (
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleDeleteSlot(slot._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="bookings">
          <h3 className="text-lg font-medium mb-4">Parking Bookings</h3>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-20 bg-gray-100 rounded"></div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-muted-foreground">No parking bookings found.</p>
          ) : (
            <div className="border rounded-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slot</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map(booking => {
                    const slot = parkingSlots.find(s => s._id === booking.slotId);
                    
                    return (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {booking.user?.name || 'Unknown User'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {slot ? `${slot.slotNumber} (${slot.area})` : 'Unknown Slot'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getVehicleTypeLabel(booking.vehicleType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {booking.vehicleNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {booking.event?.title || 'No Event'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(booking.bookingDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-500"
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            Cancel Booking
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageParking;