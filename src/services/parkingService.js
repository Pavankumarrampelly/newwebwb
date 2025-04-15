import axios from 'axios';

const API_URL = '/api/parking';

// Get all parking slots
const getAllParkingSlots = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get available parking slots
const getAvailableParkingSlots = async () => {
  try {
    const response = await axios.get(`${API_URL}/available`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get user's booked parking slots
const getUserBookedSlots = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Book parking slot
const bookParkingSlot = async (slotId, bookingData) => {
  try {
    const response = await axios.post(`${API_URL}/book/${slotId}`, bookingData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Cancel parking slot booking
const cancelParkingBooking = async (slotId) => {
  try {
    const response = await axios.delete(`${API_URL}/cancel/${slotId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const parkingService = {
  getAllParkingSlots,
  getAvailableParkingSlots,
  getUserBookedSlots,
  bookParkingSlot,
  cancelParkingBooking
};

export default parkingService;