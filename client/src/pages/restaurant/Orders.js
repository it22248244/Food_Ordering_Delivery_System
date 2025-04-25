import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaFilter, FaClock, FaCheck, FaTimes, FaUtensils } from 'react-icons/fa';
import apiService from '../../utils/api';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import './Orders.css';

const Orders = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialStatusFilter = queryParams.get('status') || 'all';
  
  // State variables
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [dateFilter, setDateFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be fetched from the API
        // For now, we'll use dummy data
        const dummyOrders = [
          {
            _id: 'order1',
            orderNumber: '123456',
            customer: {
              name: 'John Doe',
              phone: '123-456-7890'
            },
            status: 'pending',
            items: [
              { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
              { name: 'Pasta Carbonara', quantity: 1, price: 11.50 }
            ],
            totalAmount: 24.49,
            paymentMethod: 'card',
            paymentStatus: 'paid',
            createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
            specialInstructions: 'Extra cheese please'
          },
          {
            _id: 'order2',
            orderNumber: '123455',
            customer: {
              name: 'Jane Smith',
              phone: '123-456-7891'
            },
            status: 'confirmed',
            items: [
              { name: 'Tiramisu', quantity: 2, price: 7.00 },
              { name: 'Italian Wine (Glass)', quantity: 2, price: 5.50 }
            ],
            totalAmount: 25.00,
            paymentMethod: 'cash',
            paymentStatus: 'pending',
            createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
            specialInstructions: ''
          },
          {
            _id: 'order3',
            orderNumber: '123454',
            customer: {
              name: 'Bob Johnson',
              phone: '123-456-7892'
            },
            status: 'preparing',
            items: [
              { name: 'Bruschetta', quantity: 1, price: 6.50 },
              { name: 'Pasta Carbonara', quantity: 1, price: 11.50 },
              { name: 'Tiramisu', quantity: 1, price: 7.00 }
            ],
            totalAmount: 25.00,
            paymentMethod: 'card',
            paymentStatus: 'paid',
            createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
            specialInstructions: 'No garlic in the bruschetta'
          },
          {
            _id: 'order4',
            orderNumber: '123453',
            customer: {
              name: 'Alice Williams',
              phone: '123-456-7893'
            },
            status: 'ready_for_pickup',
            items: [
              { name: 'Margherita Pizza', quantity: 2, price: 12.99 }
            ],
            totalAmount: 25.98,
            paymentMethod: 'card',
            paymentStatus: 'paid',
            createdAt: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
            specialInstructions: ''
          },
          {
            _id: 'order5',
            orderNumber: '123452',
            customer: {
              name: 'Charlie Brown',
              phone: '123-456-7894'
            },
            status: 'out_for_delivery',
            items: [
              { name: 'Pasta Carbonara', quantity: 1, price: 11.50 },
              { name: 'Italian Wine (Glass)', quantity: 1, price: 5.50 }
            ],
            totalAmount: 17.00,
            paymentMethod: 'cash',
            paymentStatus: 'pending',
            createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
            specialInstructions: ''
          },
          {
            _id: 'order6',
            orderNumber: '123451',
            customer: {
              name: 'David Miller',
              phone: '123-456-7895'
            },
            status: 'delivered',
            items: [
              { name: 'Bruschetta', quantity: 1, price: 6.50 },
              { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
              { name: 'Tiramisu', quantity: 1, price: 7.00 }
            ],
            totalAmount: 26.49,
            paymentMethod: 'card',
            paymentStatus: 'paid',
            createdAt: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
            specialInstructions: ''
          },
          {
            _id: 'order7',
            orderNumber: '123450',
            customer: {
              name: 'Eva Garcia',
              phone: '123-456-7896'
            },
            status: 'cancelled',
            items: [
              { name: 'Pasta Carbonara', quantity: 2, price: 11.50 }
            ],
            totalAmount: 23.00,
            paymentMethod: 'card',
            paymentStatus: 'refunded',
            createdAt: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
            specialInstructions: '',
            cancellationReason: 'Customer requested cancellation'
          }
        ];
        
        setOrders(dummyOrders);
      } catch (err) {
        setError(err.message || 'Failed to load orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Function to filter orders by date
  const filterOrdersByDate = (order) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'today') {
      return orderDate.getTime() === today.getTime();
    } else if (dateFilter === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return orderDate.getTime() === yesterday.getTime();
    } else if (dateFilter === 'last7days') {
      const last7Days = new Date(today);
      last7Days.setDate(last7Days.getDate() - 7);
      return orderDate >= last7Days;
    } else if (dateFilter === 'last30days') {
      const last30Days = new Date(today);
      last30Days.setDate(last30Days.getDate() - 30);
      return orderDate >= last30Days;
    }
    
    return true; // 'all' filter
  };
  
  // Filter orders based on filters and search
  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Filter by date
    if (!filterOrdersByDate(order)) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.customer.phone.includes(searchTerm)
      );
    }
    
    return true;
  });
  
  // Sort orders by date (newest first)
  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
  };
  
  // Status labels for display
  const statusLabels = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'preparing': 'Preparing',
    'ready_for_pickup': 'Ready for Pickup',
    'out_for_delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  
  // Get status class for styling
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
      case 'preparing':
        return 'info';
      case 'ready_for_pickup':
      case 'out_for_delivery':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return '';
    }
  };
  
  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // In a real app, this would be an API call
      const updatedOrders = orders.map(order => {
        if (order._id === orderId) {
          return {
            ...order,
            status: newStatus
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      toast.success(`Order status updated to ${statusLabels[newStatus]}`);
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };
  
  // Get next status for the order
  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'pending': 'confirmed',
      'confirmed': 'preparing',
      'preparing': 'ready_for_pickup',
      'ready_for_pickup': 'out_for_delivery',
      'out_for_delivery': 'delivered'
    };
    
    return statusFlow[currentStatus] || null;
  };
  
  // Cancel order
  const cancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        // In a real app, this would be an API call
        const updatedOrders = orders.map(order => {
          if (order._id === orderId) {
            return {
              ...order,
              status: 'cancelled',
              cancellationReason: 'Cancelled by restaurant'
            };
          }
          return order;
        });
        
        setOrders(updatedOrders);
        toast.success('Order cancelled successfully');
      } catch (error) {
        toast.error('Failed to cancel order');
        console.error('Error cancelling order:', error);
      }
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="restaurant-orders-page">
        <div className="loading-spinner">Loading orders...</div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="restaurant-orders-page">
        <div className="error-message">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="reload-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  const filters = [
    { id: 'all', label: 'All Orders' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'ready', label: 'Ready' },
    { id: 'delivered', label: 'Delivered' }
  ];
  
  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Order Management</h1>
      </div>
      
      <div className="orders-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search orders by number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-tabs">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="orders-list">
        {sortedOrders.length > 0 ? (
          sortedOrders.map(order => {
            const { date, time } = formatDateTime(order.createdAt);
            const nextStatus = getNextStatus(order.status);
            
            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <span className="order-time">
                      <FaClock /> {time}
                    </span>
                  </div>
                  <div className={`status-badge ${getStatusClass(order.status)}`}>
                    {statusLabels[order.status]}
                  </div>
                </div>
                
                <div className="customer-info">
                  <h4>{order.customer.name}</h4>
                  <p>{order.customer.phone}</p>
                </div>
                
                <div className="order-items">
                  <h4>Items</h4>
                  <ul className="items-list">
                    {order.items.map((item, index) => (
                      <li key={index} className="item">
                        <span className="quantity">{item.quantity}x</span>
                        <span className="name">{item.name}</span>
                        <span className="price">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="order-total">
                    Total: <strong>Rs. {order.totalAmount.toFixed(2)}</strong>
                  </div>
                  
                  <div className="payment-info">
                    <span className="payment-method">
                      {order.paymentMethod === 'card' ? 'Card Payment' : 'Cash on Delivery'}
                    </span>
                    <span className={`payment-status ${order.paymentStatus}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
                
                {order.specialInstructions && (
                  <div className="special-instructions">
                    <h4>Special Instructions</h4>
                    <p>{order.specialInstructions}</p>
                  </div>
                )}
                
                {order.status === 'cancelled' && order.cancellationReason && (
                  <div className="cancellation-reason">
                    <h4>Cancellation Reason</h4>
                    <p>{order.cancellationReason}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-orders-message">
            <h3>No orders found</h3>
            <p>
              {searchTerm
                ? "No orders match your search criteria."
                : activeFilter !== 'all'
                ? `No ${activeFilter} orders found.`
                : "No orders found for the selected date range."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;