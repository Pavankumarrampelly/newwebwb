
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/skeleton';
import { Plus, Edit, Users, Calendar, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import eventService from '../../services/eventService';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchHostEvents = async () => {
      try {
        setLoading(true);
        const hostEvents = await eventService.getUserHostedEvents();
        setEvents(hostEvents);
        
        // Get all registrations for events hosted by this host
        const registrationPromises = hostEvents.map(event => 
          fetchEventRegistrations(event._id)
        );
        
        const registrationResults = await Promise.all(registrationPromises);
        const allRegistrations = registrationResults.flat();
        setRegistrations(allRegistrations);
        
      } catch (error) {
        console.error('Failed to fetch host events:', error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHostEvents();
  }, []);
  
  const fetchEventRegistrations = async (eventId) => {
    try {
      // This would be a new API endpoint to get registrations for a specific event
      const response = await fetch(`/api/events/${eventId}/registrations`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }
      
      const data = await response.json();
      return data.map(reg => ({...reg, eventId}));
    } catch (error) {
      console.error(`Failed to fetch registrations for event ${eventId}:`, error);
      return [];
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Events</h2>
        <Button onClick={() => navigate('/create-event')} className="bg-college-primary hover:bg-college-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create New Event
        </Button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Your Events</h3>
          {events.length === 0 ? (
            <p className="text-muted-foreground">You haven't created any events yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {events.map((event) => (
                <Card key={event._id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{event.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{event.attendees?.length || 0} / {event.capacity}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <h3 className="text-lg font-medium mt-8">Registrations</h3>
          {registrations.length === 0 ? (
            <p className="text-muted-foreground">No registrations for your events yet.</p>
          ) : (
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((reg) => (
                    <tr key={reg._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {reg.user?.name || "User"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {events.find(e => e._id === reg.eventId)?.title || "Event"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDate(reg.registeredAt || new Date())}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageEvents;