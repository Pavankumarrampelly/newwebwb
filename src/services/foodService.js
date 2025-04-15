import axios from 'axios';

const API_URL = '/api/food';

// Get all food items
const getAllFoodItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/items`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get food items by category
const getFoodItemsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/items/${category}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Place food order
const placeFoodOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/order`, orderData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get user's orders
const getUserOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get order by ID
const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Cancel order
const cancelOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${API_URL}/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const foodService = {
  getAllFoodItems,
  getFoodItemsByCategory,
  placeFoodOrder,
  getUserOrders,
  getOrderById,
  cancelOrder
};

export default foodService;