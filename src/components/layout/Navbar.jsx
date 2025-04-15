import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
import { Calendar, Ticket, Car, User, LogOut, Bell, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-college-primary">CollegeEventVerse</span>
            </Link>
            
            {user && (
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                <Link
                  to="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-college-primary"
                >
                  <Home className="inline-block mr-1 h-4 w-4" /> Dashboard
                </Link>
                <Link
                  to="/events"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-college-primary"
                >
                  <Calendar className="inline-block mr-1 h-4 w-4" /> Events
                </Link>
                <Link
                  to="/my-tickets"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-college-primary"
                >
                  <Ticket className="inline-block mr-1 h-4 w-4" /> My Tickets
                </Link>
                <Link
                  to="/parking"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-college-primary"
                >
                  <Car className="inline-block mr-1 h-4 w-4" /> Parking
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/notifications" className="text-gray-500 hover:text-college-primary">
                  <Bell size={20} />
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full cursor-pointer">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-tickets" className="w-full cursor-pointer">My Tickets</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/host-event" className="w-full cursor-pointer">Host Event</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/interested-in" className="w-full cursor-pointer">Skills & Interests</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')} className="bg-college-primary">
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {user && (
        <div className="md:hidden border-t border-gray-200 py-2 px-4">
          <div className="flex justify-between space-x-2">
            <Link
              to="/dashboard"
              className="flex-1 text-center px-2 py-1 rounded-md text-xs font-medium text-gray-700 hover:text-college-primary"
            >
              <Home className="mx-auto h-5 w-5 mb-1" />
              Home
            </Link>
            <Link
              to="/events"
              className="flex-1 text-center px-2 py-1 rounded-md text-xs font-medium text-gray-700 hover:text-college-primary"
            >
              <Calendar className="mx-auto h-5 w-5 mb-1" />
              Events
            </Link>
            <Link
              to="/my-tickets"
              className="flex-1 text-center px-2 py-1 rounded-md text-xs font-medium text-gray-700 hover:text-college-primary"
            >
              <Ticket className="mx-auto h-5 w-5 mb-1" />
              Tickets
            </Link>
            <Link
              to="/parking"
              className="flex-1 text-center px-2 py-1 rounded-md text-xs font-medium text-gray-700 hover:text-college-primary"
            >
              <Car className="mx-auto h-5 w-5 mb-1" />
              Parking
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;