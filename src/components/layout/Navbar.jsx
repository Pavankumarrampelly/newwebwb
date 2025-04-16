import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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

import {
  Menu,
  X,
  User,
  LogOut,
  Ticket,
  Calendar,
  Home,
  Car,
  ShoppingBag,
  ShieldCheck,
  Bell
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-college-primary font-bold text-2xl">
              CollegeEventVerse
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  <Home className="h-4 w-4 mr-1 inline-block" /> Dashboard
                </Link>
                <Link to="/events" className="nav-link">
                  <Calendar className="h-4 w-4 mr-1 inline-block" /> Events
                </Link>
                <Link to="/my-tickets" className="nav-link">
                  <Ticket className="h-4 w-4 mr-1 inline-block" /> My Tickets
                </Link>
                <Link to="/parking" className="nav-link">
                  <Car className="h-4 w-4 mr-1 inline-block" /> Parking
                </Link>
                <Link to="/food" className="nav-link">
                  <ShoppingBag className="h-4 w-4 mr-1 inline-block" /> Food
                </Link>
                <Link to="/notifications" className="text-gray-500 hover:text-college-primary">
                  <Bell size={20} />
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full text-gray-500 hover:text-college-primary">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full cursor-pointer">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/host-login" className="w-full cursor-pointer">
                        <ShieldCheck className="h-4 w-4 mr-2" /> Host Portal
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
                <Button className="bg-college-primary" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-college-primary hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-3 px-4 space-y-2">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="mobile-nav-link">
                <Home className="h-5 w-5 mr-2" /> Dashboard
              </Link>
              <Link to="/events" onClick={() => setIsOpen(false)} className="mobile-nav-link">
                <Calendar className="h-5 w-5 mr-2" /> Events
              </Link>
              <Link to="/my-tickets" onClick={() => setIsOpen(false)} className="mobile-nav-link">
                <Ticket className="h-5 w-5 mr-2" /> My Tickets
              </Link>
              <Link to="/parking" onClick={() => setIsOpen(false)} className="mobile-nav-link">
                <Car className="h-5 w-5 mr-2" /> Parking
              </Link>
              <Link to="/food" onClick={() => setIsOpen(false)} className="mobile-nav-link">
                <ShoppingBag className="h-5 w-5 mr-2" /> Food
              </Link>
              <Link to="/host-login" onClick={() => setIsOpen(false)} className="mobile-nav-link">
                <ShieldCheck className="h-5 w-5 mr-2" /> Host Portal
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="mobile-nav-link text-red-500"
              >
                <LogOut className="h-5 w-5 mr-2" /> Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="mobile-nav-link">
                Login
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="mobile-nav-link">
                Sign Up
              </Link>
              <Link to="/host-login" onClick={() => setIsOpen(false)} className="mobile-nav-link">
                <ShieldCheck className="h-5 w-5 mr-2" /> Host Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
