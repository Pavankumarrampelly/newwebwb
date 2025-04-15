import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className={getCategoryColor(event.category)}>
            {event.category}
          </Badge>
          {event.price > 0 ? (
            <Badge variant="outline" className="font-semibold">
              ₹{event.price}
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              Free
            </Badge>
          )}
        </div>
        <h3 className="text-lg font-semibold mt-2">{event.title}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Tag className="h-4 w-4 mr-1" />
          <span>{event.subcategory}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <p className="text-sm text-gray-600 line-clamp-2">
          {event.description}
        </p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full bg-college-primary hover:bg-college-primary/90">
          <Link to={`/events/${event._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;