import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { Link } from 'react-router-dom';
import EventList from '../components/events/EventList';
import EventsCalendar from '../components/calendar/EventsCalendar';
import eventService from '../services/eventService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';
import { toast as sonnerToast } from "sonner";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const allEvents = await eventService.getAllEvents();
        setEvents(Array.isArray(allEvents) ? allEvents : []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        sonnerToast.error('Failed to load events', {
          description: 'Please try again or check your connection'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          
          <Button asChild className="bg-college-primary hover:bg-college-primary/90">
            <Link to="/create-event">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>
        
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
