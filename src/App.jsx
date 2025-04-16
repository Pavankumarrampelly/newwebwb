import React from "react";
import { Toaster } from "./components/ui/Toaster";
import { SonnerToaster } from "./components/ui/Sonner";
import { TooltipProvider } from "./components/ui/Tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FoodCartProvider } from "./hooks/useFoodCart";
import ProtectedRoute from "./components/auth/ProtectedRoute";





import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import MyTickets from "./pages/MyTickets";
import Parking from "./pages/Parking";
import Food from "./pages/Food";
import NotFound from "./pages/NotFound";

// Host Pages
import HostLogin from "./pages/HostLogin";
import HostDashboard from "./pages/HostDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster />
      <AuthProvider>
        <FoodCartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
              <Route path="/events/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
              <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
              <Route path="/my-tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />
              <Route path="/parking" element={<ProtectedRoute><Parking /></ProtectedRoute>} />
              <Route path="/food" element={<ProtectedRoute><Food /></ProtectedRoute>} />
              
              {/* Host Routes */}
              <Route path="/host-login" element={<HostLogin />} />
              <Route path="/host-dashboard" element={<HostDashboard />} />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FoodCartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;