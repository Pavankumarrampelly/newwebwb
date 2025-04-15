import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import EventList from '../components/events/EventList';
import EventsCalendar from '../components/calendar/EventsCalendar';
import eventService from '../services/eventService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { useToast } from '../hooks/use-toast';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await eventService.getAllEvents();
        // Make sure we're always setting an array, even if the API returns something else
        setEvents(Array.isArray(allEvents) ? allEvents : []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        toast({
          title: 'Error',
          description: 'Failed to load events. Please try again.',
          variant: 'destructive'
        });
        // If there's an error, set events to an empty array
        setEvents([]);
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [toast]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Events</h1>
        
        <Tabs defaultValue="list" className="mb-6">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-64 bg-gray-200 rounded-md animate-pulse"></div>
                ))}
              </div>
            ) : (
              <EventList events={events} />
            )}
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-4">
            {loading ? (
              <div className="h-96 bg-gray-200 rounded-md animate-pulse"></div>
            ) : (
              <EventsCalendar events={events} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Events;