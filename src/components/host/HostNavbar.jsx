import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const HostNavbar = () => {
  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-college-primary mr-2" />
            <span className="font-bold text-xl">Host Management Portal</span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <Link
                to="/host-dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                to="/create-event"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800"
              >
                Create Event
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HostNavbar;