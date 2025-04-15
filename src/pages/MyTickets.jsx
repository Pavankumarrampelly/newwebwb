import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/Button';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Ticket, Calendar, MapPin, Clock, Users, Download, TicketX } from 'lucide-react';
import eventService from '../services/eventService';

const MyTickets = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const events = await eventService.getUserRegisteredEvents();
        setRegisteredEvents(events);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch registered events:', error);
        toast({
          title: "Error",
          description: "Failed to load your tickets. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    fetchRegisteredEvents();
  }, [toast]);
  
  const handleCancelRegistration = async (eventId) => {
    try {
      // In production this would use the actual API
      // await eventService.cancelEventRegistration(eventId);
      
      // For development we'll just update the UI
      setRegisteredEvents(registeredEvents.filter(event => event._id !== eventId));
      
      toast({
        title: "Registration Cancelled",
        description: "Your event registration has been cancelled successfully.",
      });
    } catch (error) {
      console.error('Failed to cancel registration:', error);
      toast({
        title: "Error",
        description: "Failed to cancel registration. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDownloadTicket = (eventId) => {
    toast({
      title: "Ticket Downloaded",
      description: "Your ticket has been downloaded successfully.",
    });
  };
  
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Ticket className="mr-2 h-6 w-6 text-college-primary" />
            My Tickets
          </h1>
          <p className="mt-1 text-gray-600">
            Manage your event registrations and tickets
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-md"></div>
              </Card>
            ))}
          </div>
        ) : registeredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {registeredEvents.map(event => (
              <Card key={event._id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gray-100 p-6 flex items-center justify-center">
                    <div className="text-center">
                      <Ticket className="h-16 w-16 text-college-primary mx-auto" />
                      <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>
                      <Badge className="mt-2">
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-grow">
                        <div className="space-y-3">
                          <p className="flex items-center text-sm text-gray-600">
                            <Calendar className="mr-2 h-4 w-4" />
                            {formatEventDate(event.date)}
                          </p>
                          <p className="flex items-center text-sm text-gray-600">
                            <Clock className="mr-2 h-4 w-4" />
                            {event.time}
                          </p>
                          <p className="flex items-center text-sm text-gray-600">
                            <MapPin className="mr-2 h-4 w-4" />
                            {event.location}
                          </p>
                          <p className="flex items-center text-sm text-gray-600">
                            <Users className="mr-2 h-4 w-4" />
                            Registration #{Math.floor(Math.random() * 1000) + 1000}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <Button 
                          variant="outline" 
                          onClick={() => handleDownloadTicket(event._id)}
                          className="text-college-primary"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Ticket
                        </Button>
                        
                        <Button 
                          variant="outline"
                          onClick={() => handleCancelRegistration(event._id)}
                          className="text-red-500"
                        >
                          <TicketX className="mr-2 h-4 w-4" />
                          Cancel Registration
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Ticket className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No tickets found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't registered for any events yet.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/events">Browse Events</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default MyTickets;