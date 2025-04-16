import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { toast as sonnerToast } from "sonner";
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Tag,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import eventService from '../services/eventService';
import { useAuth } from '../hooks/useAuth';
import { Skeleton } from '../components/ui/skeleton';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(id);
        setEvent(eventData);
        
        // Check if current user is already registered
        if (eventData.attendees && user) {
          setIsRegistered(eventData.attendees.some(
            attendeeId => attendeeId === user.id || attendeeId._id === user.id
          ));
        }
      } catch (error) {
        console.error('Failed to fetch event details:', error);
        sonnerToast.error('Failed to load event details', {
          description: 'Please try again or check your connection'
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id, user]);

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await eventService.registerForEvent(id);
      setIsRegistered(true);
      
      sonnerToast.success('Registration successful', {
        description: `You have been registered for ${event.title}`
      });
    } catch (error) {
      console.error('Registration failed:', error);
      sonnerToast.error('Registration failed', {
        description: error.msg || 'Please try again later'
      });
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      setRegistering(true);
      await eventService.cancelEventRegistration(id);
      setIsRegistered(false);
      
      sonnerToast.success('Registration cancelled', {
        description: `Your registration for ${event.title} has been cancelled`
      });
    } catch (error) {
      console.error('Failed to cancel registration:', error);
      sonnerToast.error('Failed to cancel registration', {
        description: error.msg || 'Please try again later'
      });
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-100 text-blue-800';
      case 'non-technical':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>
          
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : event ? (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className={getCategoryColor(event.category)}>
                  {event.category}
                </Badge>
                <Badge variant="outline" className="font-medium">
                  {event.price > 0 ? `₹${event.price}` : 'Free'}
                </Badge>
                {event.attendees && (
                  <Badge variant="outline" className="font-medium">
                    <Users className="mr-1 h-3 w-3" />
                    {event.attendees.length} / {event.capacity}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Tag className="h-4 w-4 mr-1" />
                <span>{event.subcategory}</span>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Description</h2>
                    <p className="text-gray-600 whitespace-pre-line">
                      {event.description}
                    </p>
                  </div>
                  
                  {event.skills && event.skills.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {event.skills.map((skill, index) => (
                          <Badge variant="secondary" key={index}>
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg mb-4">Event Details</h3>
                    
                    <div className="space-y-4">
                      <div className="flex">
                        <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium">Date</p>
                          <p className="text-gray-600">
                            {formatDate(event.date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <Clock className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium">Time</p>
                          <p className="text-gray-600">{event.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-gray-600">{event.location}</p>
                        </div>
                      </div>
                      
                      {event.host && (
                        <div className="flex">
                          <User className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="font-medium">Hosted by</p>
                            <p className="text-gray-600">
                              {event.host.name || 'Unknown host'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6">
                      {isRegistered ? (
                        <Button 
                          variant="outline" 
                          className="w-full border-red-200 text-red-600 hover:bg-red-50"
                          onClick={handleCancelRegistration}
                          disabled={registering}
                        >
                          {registering ? 'Processing...' : 'Cancel Registration'}
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-college-primary hover:bg-college-primary/90"
                          onClick={handleRegister}
                          disabled={
                            registering || 
                            (event.attendees && event.attendees.length >= event.capacity)
                          }
                        >
                          {registering ? (
                            'Processing...'
                          ) : event.attendees && event.attendees.length >= event.capacity ? (
                            'Event Full'
                          ) : (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Register Now
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700">
                Event not found
              </h2>
              <p className="mt-2 text-gray-500">
                The event you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild className="mt-4">
                <Link to="/events">Back to Events</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventDetails;