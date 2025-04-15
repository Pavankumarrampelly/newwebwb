import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
//import { Button } from '../ui/Button';
import { Button } from '../components/ui/Button';


import { Calendar, Users, Award, Ticket, ArrowRight } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // If user is already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-college-primary to-college-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2 text-white">
              <h1 className="text-4xl md:text-5xl font-bold">
                College Event Verse
              </h1>
              <p className="mt-4 text-xl text-blue-100">
                Your one-stop platform for discovering, participating in, and hosting college events.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button onClick={() => navigate('/register')} size="lg" className="bg-white text-college-primary hover:bg-blue-50">
                  Get Started
                </Button>
                <Button onClick={() => navigate('/login')} size="lg" variant="outline" className="border-white text-white hover:bg-blue-800">
                  Sign In
                </Button>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2">
              <div className="relative mx-auto w-full max-w-md">
                <div className="rounded-lg bg-white shadow-lg p-6">
                  <div className="bg-blue-100 rounded-lg p-4 mb-4">
                    <Calendar className="h-8 w-8 text-college-primary mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-center">Hackathon 2023</h3>
                  <p className="text-gray-500 text-center mb-4">Tech innovation competition</p>
                  <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700 mb-3">
                    <p>Date: June 15, 2023</p>
                    <p>Location: Main Campus, Building B</p>
                  </div>
                  <Button className="w-full bg-college-primary">Register Now</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">
              Everything you need for college events
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              From hackathons to cultural festivals, we make it easy to discover, 
              participate in, and organize all types of campus events.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-college-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Events</h3>
              <p className="text-gray-600">
                Browse and filter events by category, date, and more to find what interests you.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Ticket className="h-6 w-6 text-college-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Register & Attend</h3>
              <p className="text-gray-600">
                Easily register for events and get QR codes for quick check-in.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-cyan-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-college-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Host Events</h3>
              <p className="text-gray-600">
                Create and manage your own events, track registrations, and find teammates.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of students and faculty members using College Event Verse to enhance their campus experience.
          </p>
          <Button onClick={() => navigate('/register')} size="lg" className="bg-college-primary">
            Create an Account <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">College Event Verse</h3>
              <p className="text-gray-400">
                Making campus events more accessible and enjoyable for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/login" className="text-gray-400 hover:text-white">Login</a></li>
                <li><a href="/register" className="text-gray-400 hover:text-white">Register</a></li>
                <li><a href="/events" className="text-gray-400 hover:text-white">Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">
                Have questions? Email us at:<br />
                support@collegeeventverse.com
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} College Event Verse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;