import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Car, CircleParking, CircleParkingOff } from 'lucide-react';
import parkingService from '../services/parkingService';
import eventService from '../services/eventService';

const Parking = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    eventId: '',
    vehicleNumber: '',
    vehicleType: 'car'
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For development, we'll use mock data instead of API calls
        // Later, these can be replaced with actual service calls
        
        // Mock available slots
        const mockAvailableSlots = [
          { _id: '1', slotNumber: 'A1', area: 'Block A', vehicleType: 'car' },
          { _id: '2', slotNumber: 'A2', area: 'Block A', vehicleType: 'car' },
          { _id: '3', slotNumber: 'B1', area: 'Block B', vehicleType: 'bike' },
          { _id: '4', slotNumber: 'B2', area: 'Block B', vehicleType: 'bike' },
          { _id: '5', slotNumber: 'C1', area: 'Block C', vehicleType: 'car' }
        ];
        
        // Mock user bookings
        const mockUserBookings = [
          { 
            _id: '6', 
            slotNumber: 'D1', 
            area: 'Block D', 
            vehicleType: 'car',
            vehicleNumber: 'ABC123',
            bookingDate: new Date().toISOString(),
            eventId: {
              _id: '101',
              title: 'Tech Conference'
            }
          }
        ];
        
        // Get events for dropdown
        const userEvents = await eventService.getUserRegisteredEvents();
        
        setAvailableSlots(mockAvailableSlots);
        setUserBookings(mockUserBookings);
        setEvents(userEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching parking data:', error);
        toast({
          title: "Error",
          description: "Failed to load parking data. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setBookingData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBookSlot = async (slotId) => {
    if (!bookingData.eventId) {
      toast({
        title: "Booking Error",
        description: "Please select an event for this parking slot.",
        variant: "destructive"
      });
      return;
    }
    
    if (!bookingData.vehicleNumber) {
      toast({
        title: "Booking Error",
        description: "Please enter your vehicle number.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // For development, we'll just show a success message
      // In production, this would call parkingService.bookParkingSlot
      
      toast({
        title: "Success",
        description: "Parking slot booked successfully!",
      });
      
      // Update the UI to reflect the booking
      const bookedSlot = availableSlots.find(slot => slot._id === slotId);
      if (bookedSlot) {
        setAvailableSlots(availableSlots.filter(slot => slot._id !== slotId));
        
        const newBooking = {
          ...bookedSlot,
          vehicleNumber: bookingData.vehicleNumber,
          bookingDate: new Date().toISOString(),
          eventId: {
            _id: bookingData.eventId,
            title: events.find(e => e._id === bookingData.eventId)?.title || 'Event'
          }
        };
        
        setUserBookings([...userBookings, newBooking]);
      }
      
      // Reset form
      setBookingData({
        eventId: '',
        vehicleNumber: '',
        vehicleType: 'car'
      });
    } catch (error) {
      console.error('Error booking slot:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to book parking slot. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleCancelBooking = async (slotId) => {
    try {
      // For development, we'll just show a success message
      // In production, this would call parkingService.cancelParkingBooking
      
      toast({
        title: "Success",
        description: "Booking cancelled successfully!",
      });
      
      // Update the UI to reflect the cancellation
      const cancelledBooking = userBookings.find(booking => booking._id === slotId);
      if (cancelledBooking) {
        setUserBookings(userBookings.filter(booking => booking._id !== slotId));
        
        // Add the slot back to available slots
        const newAvailableSlot = {
          _id: cancelledBooking._id,
          slotNumber: cancelledBooking.slotNumber,
          area: cancelledBooking.area,
          vehicleType: cancelledBooking.vehicleType
        };
        
        setAvailableSlots([...availableSlots, newAvailableSlot]);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Parking Management</h1>
          <p className="mt-1 text-gray-600">
            Book and manage parking slots for your events
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Parking Slots */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CircleParking className="mr-2 h-5 w-5 text-green-500" />
                  Available Parking Slots
                </CardTitle>
                <CardDescription>
                  Select a slot to book for your event
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-md"></div>
                    ))}
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="space-y-4">
                    {availableSlots.map(slot => (
                      <Card key={slot._id}>
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{slot.slotNumber} - {slot.area}</h3>
                            <p className="text-sm text-gray-500">
                              <Car className="inline mr-1 h-4 w-4" /> 
                              {slot.vehicleType === 'car' ? 'Car Parking' : 'Bike Parking'}
                            </p>
                          </div>
                          <Button 
                            onClick={() => handleBookSlot(slot._id)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Book Slot
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CircleParkingOff className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No available slots</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      All parking slots are currently booked.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Booking Form */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Booking Information</CardTitle>
                <CardDescription>
                  Enter details for your parking booking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventId">Select Event</Label>
                    <Select
                      value={bookingData.eventId}
                      onValueChange={(value) => handleSelectChange('eventId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map(event => (
                          <SelectItem key={event._id} value={event._id}>
                            {event.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                    <Input
                      id="vehicleNumber"
                      name="vehicleNumber"
                      value={bookingData.vehicleNumber}
                      onChange={handleInputChange}
                      placeholder="Enter vehicle number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Select
                      value={bookingData.vehicleType}
                      onValueChange={(value) => handleSelectChange('vehicleType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Your Bookings */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="mr-2 h-5 w-5 text-blue-500" />
                  Your Parking Bookings
                </CardTitle>
                <CardDescription>
                  Manage your current parking bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-md"></div>
                    ))}
                  </div>
                ) : userBookings.length > 0 ? (
                  <div className="space-y-4">
                    {userBookings.map(booking => (
                      <Card key={booking._id} className="border-l-4 border-blue-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{booking.slotNumber} - {booking.area}</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                <Car className="inline mr-1 h-4 w-4" />
                                {booking.vehicleType === 'car' ? 'Car Parking' : 'Bike Parking'}
                              </p>
                              <p className="text-sm mt-2">Vehicle: {booking.vehicleNumber}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Event: {booking.eventId?.title || 'N/A'}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500 border-red-200 hover:bg-red-50"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Car className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't booked any parking slots yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Parking;
