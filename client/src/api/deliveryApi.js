// src/api/deliveryApi.js
import api from './config';

export const getDeliveryByOrder = async (orderId) => {
  try {
    const response = await api.get(`/deliveries/order/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch delivery details' };
  }
};

export const getMyDeliveries = async () => {
  try {
    const response = await api.get('/deliveries/my-deliveries');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch delivery assignments' };
  }
};

export const updateDeliveryStatus = async (id, statusData) => {
  try {
    const response = await api.patch(`/deliveries/${id}/status`, statusData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update delivery status' };
  }
};

export const updateDeliveryLocation = async (locationData) => {
  try {
    const response = await api.patch('/deliveries/location', locationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update location' };
  }
};