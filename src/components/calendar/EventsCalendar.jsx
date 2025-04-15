import React, { useState, useEffect } from 'react';
import { Calendar } from '../ui/Calendar';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventsCalendar = ({ events }) => {
  const [selected, setSelected] = useState(new Date());
  const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState([]);
  
  // Create a map of dates to event counts for highlighting dates
  const eventDates = events.reduce((acc, event) => {
    const dateKey = new Date(event.date).toISOString().split('T')[0];
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});
  
  useEffect(() => {
    // Filter events for the selected date
    const selectedDateStr = selected.toISOString().split('T')[0];
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === selectedDateStr;
    });
    
    setEventsOnSelectedDate(filteredEvents);
  }, [selected, events]);
  
  const renderDayContent = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    const count = eventDates[dateKey] || 0;
    
    return count > 0 ? (
      <div className="relative">
        {date.getDate()}
        <Badge 
          className="absolute -bottom-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-college-primary text-[10px]"
        >
          {count}
        </Badge>
      </div>
    ) : (
      date.getDate()
    );
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="p-4 md:w-1/2">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          className="rounded-md border shadow-sm"
          renderDayContent={renderDayContent}
        />
      </Card>
      
      <Card className="p-6 md:w-1/2">
        <h3 className="text-lg font-semibold mb-4">
          Events on {selected.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </h3>
        
        {eventsOnSelectedDate.length > 0 ? (
          <div className="space-y-4">
            {eventsOnSelectedDate.map((event) => (
              <Link 
                to={`/events/${event._id}`}
                key={event._id}
                className="block"
              >
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{event.title}</h4>
                    <Badge className={event.category === 'technical' 
                      ? 'bg-blue-100 text-blue-800' 
                      : event.category === 'non-technical' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'}
                    >
                      {event.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{event.time}</span>
                  </div>
                  
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No events scheduled for this date
          </div>
        )}
      </Card>
    </div>
  );
};

export default EventsCalendar;