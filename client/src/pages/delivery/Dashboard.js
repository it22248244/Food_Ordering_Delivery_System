import React, { useState, useEffect } from 'react';
import { FaMotorcycle, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedToday: 0,
    averageRating: 0,
    earningsToday: 0
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setActiveOrders([
        {
          id: 1,
          orderNumber: 'ORD-12345',
          customer: {
            name: 'John Doe',
            phone: '+1 234-567-8901',
            address: '123 Main St, Apt 4B, New York, NY 10001'
          },
          restaurant: {
            name: 'Pizza Palace',
            address: '456 Food Ave, New York, NY 10002'
          },
          items: [
            { name: 'Margherita Pizza', quantity: 2 },
            { name: 'Coca Cola', quantity: 1 }
          ],
          total: 29.98,
          status: 'Picked Up',
          pickupTime: '10:30 AM',
          estimatedDelivery: '11:00 AM'
        },
        {
          id: 2,
          orderNumber: 'ORD-12346',
          customer: {
            name: 'Jane Smith',
            phone: '+1 234-567-8902',
            address: '789 Oak St, New York, NY 10003'
          },
          restaurant: {
            name: 'Burger Joint',
            address: '321 Fast Food St, New York, NY 10004'
          },
          items: [
            { name: 'Cheeseburger', quantity: 1 },
            { name: 'French Fries', quantity: 1 }
          ],
          total: 15.99,
          status: 'Ready for Pickup',
          pickupTime: '11:15 AM',
          estimatedDelivery: '11:45 AM'
        }
      ]);

      setStats({
        totalDeliveries: 150,
        completedToday: 8,
        averageRating: 4.8,
        earningsToday: 120.50
      });

      setLoading(false);
    }, 1000);
  }, []);

  const handleStatusUpdate = (orderId, newStatus) => {
    // Add status update logic here
    console.log(`Updating order ${orderId} to ${newStatus}`);
    toast.success(`Order status updated to ${newStatus}`);
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Delivery Dashboard</h1>
        <div className="delivery-stats">
          <div className="stat-card">
            <FaMotorcycle className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{stats.totalDeliveries}</span>
              <span className="stat-label">Total Deliveries</span>
            </div>
          </div>
          <div className="stat-card">
            <FaClock className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{stats.completedToday}</span>
              <span className="stat-label">Completed Today</span>
            </div>
          </div>
          <div className="stat-card">
            <FaStar className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{stats.averageRating}</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-currency">$</span>
            <div className="stat-info">
              <span className="stat-value">{stats.earningsToday}</span>
              <span className="stat-label">Earnings Today</span>
            </div>
          </div>
        </div>
      </div>

      <div className="active-orders">
        <h2>Active Orders</h2>
        {activeOrders.length > 0 ? (
          <div className="orders-grid">
            {activeOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.orderNumber}</h3>
                  <div className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </div>
                </div>

                <div className="order-timeline">
                  <div className="timeline-item">
                    <FaMapMarkerAlt className="timeline-icon" />
                    <div className="timeline-content">
                      <h4>Pickup Location</h4>
                      <p>{order.restaurant.name}</p>
                      <p className="address">{order.restaurant.address}</p>
                      <p className="time">Pickup by: {order.pickupTime}</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <FaMapMarkerAlt className="timeline-icon" />
                    <div className="timeline-content">
                      <h4>Delivery Location</h4>
                      <p>{order.customer.name}</p>
                      <p className="address">{order.customer.address}</p>
                      <p className="time">Deliver by: {order.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Order Items</h4>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        <span className="quantity">{item.quantity}x</span>
                        <span className="item-name">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-footer">
                  <div className="customer-contact">
                    <a href={`tel:${order.customer.phone}`} className="contact-button">
                      <FaPhone /> Call Customer
                    </a>
                    <a href={`mailto:${order.customer.email}`} className="contact-button">
                      <FaEnvelope /> Message
                    </a>
                  </div>
                  <div className="order-actions">
                    {order.status === 'Ready for Pickup' && (
                      <button
                        className="action-button"
                        onClick={() => handleStatusUpdate(order.id, 'Picked Up')}
                      >
                        Mark as Picked Up
                      </button>
                    )}
                    {order.status === 'Picked Up' && (
                      <button
                        className="action-button"
                        onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-orders">
            <FaMotorcycle className="no-orders-icon" />
            <h3>No Active Orders</h3>
            <p>You don't have any active orders at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;