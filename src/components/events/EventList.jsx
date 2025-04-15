import React, { useState } from 'react';
import EventCard from './EventCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Input } from '../ui/Input';
import { Search } from 'lucide-react';

const EventList = ({ events = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Ensure events is an array before filtering
  const eventsArray = Array.isArray(events) ? events : [];
  
  const filteredEvents = eventsArray.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const technicalEvents = filteredEvents.filter(event => event.category === 'technical');
  const nonTechnicalEvents = filteredEvents.filter(event => event.category === 'non-technical');
  const otherEvents = filteredEvents.filter(event => event.category === 'other');
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search events..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="all" className="flex-1">
            All Events ({filteredEvents.length})
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex-1">
            Technical ({technicalEvents.length})
          </TabsTrigger>
          <TabsTrigger value="non-technical" className="flex-1">
            Non-Technical ({nonTechnicalEvents.length})
          </TabsTrigger>
          <TabsTrigger value="other" className="flex-1">
            Other ({otherEvents.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No events found</p>
          )}
        </TabsContent>
        
        <TabsContent value="technical">
          {technicalEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technicalEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No technical events found</p>
          )}
        </TabsContent>
        
        <TabsContent value="non-technical">
          {nonTechnicalEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nonTechnicalEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No non-technical events found</p>
          )}
        </TabsContent>
        
        <TabsContent value="other">
          {otherEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No other events found</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventList;