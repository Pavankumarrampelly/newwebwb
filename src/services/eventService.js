import axios from 'axios';

const API_URL = 'http://localhost:8000/api/events';

// Get all events
const getAllEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get event by ID
const getEventById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching event' };
  }
};

// Get events by category
const getEventsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/category/${category}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching events by category:', error);
    throw error;
  }
};

// Get events by date
const getEventsByDate = async (date) => {
  try {
    // Format date as YYYY-MM-DD
    const formattedDate = new Date(date).toISOString().split('T')[0];
    const response = await axios.get(`${API_URL}/date/${formattedDate}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching events by date:', error);
    throw error;
  }
};

// Create new event
const createEvent = async (eventData) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };
    const response = await axios.post(API_URL, eventData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error.response?.data || { msg: 'Error creating event' };
  }
};

// Register for event
const registerForEvent = async (eventId) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    const response = await axios.post(`${API_URL}/${eventId}/register`, {}, config);
    return response.data;
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error.response?.data || { msg: 'Error registering for event' };
  }
};

// Cancel event registration
const cancelEventRegistration = async (eventId) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    const response = await axios.delete(`${API_URL}/${eventId}/register`, config);
    return response.data;
  } catch (error) {
    console.error('Error cancelling registration:', error);
    throw error.response?.data || { msg: 'Error cancelling registration' };
  }
};

// Get user's registered events
const getUserRegisteredEvents = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    const response = await axios.get(`${API_URL}/user/registered`, config);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching registered events:', error);
    throw error;
  }
};

// Get user's hosted events
const getUserHostedEvents = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    const response = await axios.get(`${API_URL}/user/hosted`, config);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching hosted events:', error);
    throw error;
  }
};

const eventService = {
  getAllEvents,
  getEventById,
  getEventsByCategory,
  getEventsByDate,
  createEvent,
  registerForEvent,
  cancelEventRegistration,
  getUserRegisteredEvents,
  getUserHostedEvents
};

export default eventService;