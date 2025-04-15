import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../services/eventService';
import Navbar from '../components/layout/Navbar';
import EventCard from '../components/events/EventCard';
import { Button } from '../components/ui/Button';
import { Calendar, Ticket, Utensils, Car, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { useToast } from '../hooks/use-toast';

const Dashboard = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [allEvents, userRegisteredEvents] = await Promise.all([
          eventService.getAllEvents(),
          eventService.getUserRegisteredEvents()
        ]);
        
        // Filter for upcoming events (today and future)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcoming = allEvents
          .filter(event => new Date(event.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3); // Only show 3 upcoming events
        
        setUpcomingEvents(upcoming);
        setRegisteredEvents(userRegisteredEvents.slice(0, 2)); // Only show 2 registered events
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        toast({
          title: 'Error',
          description: 'Failed to load events. Please try again.',
          variant: 'destructive'
        });
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [toast]);
  
  const QuickActionCard = ({ title, icon, description, link, color }) => (
    <Card className="h-full">
      <CardHeader>
        <div className={`p-2 rounded-lg w-12 h-12 flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <CardTitle className="mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to={link}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to College Event Verse</h1>
            <p className="mt-1 text-gray-600">
              Discover, register, and manage college events all in one place
            </p>
          </div>
          <div className="flex justify-end">
            <Button asChild className="bg-college-primary">
              <Link to="/host-event">
                <PlusCircle className="mr-2 h-4 w-4" /> Host New Event
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              title="Browse Events"
              icon={<Calendar className="h-6 w-6 text-blue-600" />}
              description="Explore upcoming events"
              link="/events"
              color="bg-blue-100"
            />
            <QuickActionCard
              title="My Tickets"
              icon={<Ticket className="h-6 w-6 text-purple-600" />}
              description="View your registrations"
              link="/my-tickets"
              color="bg-purple-100"
            />
            <QuickActionCard
              title="Food Orders"
              icon={<Utensils className="h-6 w-6 text-yellow-600" />}
              description="Order food for events"
              link="/food"
              color="bg-yellow-100"
            />
            <QuickActionCard
              title="Parking"
              icon={<Car className="h-6 w-6 text-green-600" />}
              description="Book parking slots"
              link="/parking"
              color="bg-green-100"
            />
          </div>
        </section>
        
        {/* Upcoming Events */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <Button asChild variant="link" className="text-college-primary">
              <Link to="/events">View All</Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="h-64 animate-pulse">
                  <div className="h-full bg-gray-200 rounded-md"></div>
                </Card>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <Card className="py-12">
              <div className="text-center">
                <p className="text-gray-500">No upcoming events</p>
                <Button asChild variant="link" className="text-college-primary mt-2">
                  <Link to="/host-event">Host an Event</Link>
                </Button>
              </div>
            </Card>
          )}
        </section>
        
        {/* Your Registrations */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Registrations</h2>
            <Button asChild variant="link" className="text-college-primary">
              <Link to="/my-tickets">View All</Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, index) => (
                <Card key={index} className="h-64 animate-pulse">
                  <div className="h-full bg-gray-200 rounded-md"></div>
                </Card>
              ))}
            </div>
          ) : registeredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {registeredEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <Card className="py-12">
              <div className="text-center">
                <p className="text-gray-500">You haven't registered for any events yet</p>
                <Button asChild variant="link" className="text-college-primary mt-2">
                  <Link to="/events">Browse Events</Link>
                </Button>
              </div>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;