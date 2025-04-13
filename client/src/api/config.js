// src/api/config.js
import axios from 'axios';

// Base URLs from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';
const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:3001/api/v1';
const RESTAURANT_SERVICE_URL = process.env.REACT_APP_RESTAURANT_SERVICE_URL || 'http://localhost:3002/api/v1';
const ORDER_SERVICE_URL = process.env.REACT_APP_ORDER_SERVICE_URL || 'http://localhost:3003/api/v1';
const DELIVERY_SERVICE_URL = process.env.REACT_APP_DELIVERY_SERVICE_URL || 'http://localhost:3004/api/v1';
const PAYMENT_SERVICE_URL = process.env.REACT_APP_PAYMENT_SERVICE_URL || 'http://localhost:3005/api/v1';
const NOTIFICATION_SERVICE_URL = process.env.REACT_APP_NOTIFICATION_SERVICE_URL || 'http://localhost:3006/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a separate instance for user service
const userApi = axios.create({
  baseURL: USER_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in requests
const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
userApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

// Add a response interceptor to handle token expiry
const handleResponseError = (error) => {
  if (error.response && error.response.status === 401) {
    // Handle unauthorized access
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error.response?.data || error);
};

api.interceptors.response.use((response) => response, handleResponseError);
userApi.interceptors.response.use((response) => response, handleResponseError);

// Export both named and default exports for backward compatibility
export { api, userApi };
export default api;

// For mock implementation
export const mockApi = {
  // Auth API
  login: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock response
    if (credentials.email === 'customer@example.com' && credentials.password === 'password') {
      return {
        token: 'mock-token-customer-123',
        data: {
          user: {
            _id: 'user1',
            name: 'John Customer',
            email: 'customer@example.com',
            role: 'customer',
            phone: '1234567890'
          }
        }
      };
    } else if (credentials.email === 'restaurant@example.com' && credentials.password === 'password') {
      return {
        token: 'mock-token-restaurant-123',
        data: {
          user: {
            _id: 'user2',
            name: 'Restaurant Owner',
            email: 'restaurant@example.com',
            role: 'restaurant',
            phone: '1234567890'
          }
        }
      };
    } else if (credentials.email === 'delivery@example.com' && credentials.password === 'password') {
      return {
        token: 'mock-token-delivery-123',
        data: {
          user: {
            _id: 'user3',
            name: 'Delivery Person',
            email: 'delivery@example.com',
            role: 'delivery',
            phone: '1234567890'
          }
        }
      };
    }
    
    throw { message: 'Invalid email or password' };
  },
  
  register: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response
    return {
      token: 'mock-token-new-user-123',
      data: {
        user: {
          _id: 'user-new',
          name: userData.name,
          email: userData.email,
          role: userData.role,
          phone: userData.phone
        }
      }
    };
  },
  
  // Restaurant API
  getRestaurants: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock response
    return {
      data: {
        restaurants: [
          {
            _id: 'rest1',
            name: 'Pizza Palace',
            cuisine: 'Italian',
            description: 'Best pizza in town with authentic Italian recipes',
            rating: 4.5,
            isOpen: true,
            address: {
              street: '123 Main St',
              city: 'Food City',
              state: 'FC',
              zipCode: '12345'
            },
            phone: '123-456-7890',
            email: 'info@pizzapalace.com',
            menu: [
              {
                _id: 'item1',
                name: 'Margherita Pizza',
                description: 'Classic tomato sauce, mozzarella, and basil',
                price: 12.99,
                category: 'Pizza',
                isAvailable: true,
                isVegetarian: true,
                image: 'https://images.unsplash.com/photo-1604917621956-10dfa7cce2e7'
              },
              {
                _id: 'item2',
                name: 'Pepperoni Pizza',
                description: 'Tomato sauce, mozzarella, and pepperoni',
                price: 14.99,
                category: 'Pizza',
                isAvailable: true,
                isVegetarian: false,
                image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e'
              }
            ]
          },
          {
            _id: 'rest2',
            name: 'Burger Joint',
            cuisine: 'American',
            description: 'Juicy burgers made with 100% Angus beef',
            rating: 4.2,
            isOpen: true,
            address: {
              street: '456 Oak Ave',
              city: 'Food City',
              state: 'FC',
              zipCode: '12345'
            },
            phone: '123-456-7891',
            email: 'info@burgerjoint.com',
            menu: [
              {
                _id: 'item3',
                name: 'Classic Burger',
                description: 'Beef patty with lettuce, tomato, and special sauce',
                price: 9.99,
                category: 'Burgers',
                isAvailable: true,
                isVegetarian: false,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'
              },
              {
                _id: 'item4',
                name: 'Veggie Burger',
                description: 'Plant-based patty with avocado and sprouts',
                price: 10.99,
                category: 'Burgers',
                isAvailable: true,
                isVegetarian: true,
                image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360'
              }
            ]
          }
        ]
      }
    };
  },
  
  getRestaurantById: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock response
    if (id === 'rest1') {
      return {
        data: {
          restaurant: {
            _id: 'rest1',
            name: 'Pizza Palace',
            cuisine: 'Italian',
            description: 'Best pizza in town with authentic Italian recipes',
            rating: 4.5,
            isOpen: true,
            address: {
              street: '123 Main St',
              city: 'Food City',
              state: 'FC',
              zipCode: '12345'
            },
            phone: '123-456-7890',
            email: 'info@pizzapalace.com',
            menu: [
              {
                _id: 'item1',
                name: 'Margherita Pizza',
                description: 'Classic tomato sauce, mozzarella, and basil',
                price: 12.99,
                category: 'Pizza',
                isAvailable: true,
                isVegetarian: true,
                image: 'https://images.unsplash.com/photo-1604917621956-10dfa7cce2e7'
              },
              {
                _id: 'item2',
                name: 'Pepperoni Pizza',
                description: 'Tomato sauce, mozzarella, and pepperoni',
                price: 14.99,
                category: 'Pizza',
                isAvailable: true,
                isVegetarian: false,
                image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e'
              }
            ]
          }
        }
      };
    }
    
    throw { message: 'Restaurant not found' };
  },
  
  // Order API
  createOrder: async (orderData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response
    return {
      data: {
        order: {
          _id: 'order' + Date.now(),
          ...orderData,
          status: 'pending',
          createdAt: new Date().toISOString(),
          paymentStatus: orderData.paymentMethod === 'card' ? 'paid' : 'pending'
        }
      }
    };
  },
  
  getUserOrders: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock response
    return {
      data: {
        orders: [
          {
            _id: 'order1',
            restaurantId: 'rest1',
            restaurantName: 'Pizza Palace',
            items: [
              {
                _id: 'item1',
                name: 'Margherita Pizza',
                price: 12.99,
                quantity: 2
              }
            ],
            totalAmount: 25.98,
            deliveryFee: 2.99,
            status: 'delivered',
            deliveryAddress: {
              street: '789 Pine St',
              city: 'Food City',
              state: 'FC',
              zipCode: '12345'
            },
            paymentMethod: 'card',
            paymentStatus: 'paid',
            createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          },
          {
            _id: 'order2',
            restaurantId: 'rest2',
            restaurantName: 'Burger Joint',
            items: [
              {
                _id: 'item3',
                name: 'Classic Burger',
                price: 9.99,
                quantity: 1
              },
              {
                _id: 'item4',
                name: 'Veggie Burger',
                price: 10.99,
                quantity: 1
              }
            ],
            totalAmount: 20.98,
            deliveryFee: 2.99,
            status: 'preparing',
            deliveryAddress: {
              street: '789 Pine St',
              city: 'Food City',
              state: 'FC',
              zipCode: '12345'
            },
            paymentMethod: 'cash',
            paymentStatus: 'pending',
            createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
          }
        ]
      }
    };
  }
};