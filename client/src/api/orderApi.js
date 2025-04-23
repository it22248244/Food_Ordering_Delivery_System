// src/api/orderApi.js
import api from './config';

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create order' };
  }
};

export const getUserOrders = async () => {
  try {
    const response = await api.get('/orders/my-orders');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user orders' };
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch order details' };
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update order status' };
  }
};

export const cancelOrder = async (id) => {
  try {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to cancel order' };
  }
};

export const getRestaurantOrders = async (restaurantId) => {
  try {
    const response = await api.get(`/orders/restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch restaurant orders' };
  }
};