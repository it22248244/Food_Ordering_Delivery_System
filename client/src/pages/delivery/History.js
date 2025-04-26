import React, { useState, useEffect } from 'react';
import { FaHistory, FaStar, FaMapMarkerAlt, FaClock, FaMotorcycle, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './History.css';

const History = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    status: 'all',
    rating: 'all'
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDeliveries([
        {
          id: 1,
          orderNumber: 'ORD-12345',
          date: '2024-03-15',
          time: '10:30 AM',
          customer: {
            name: 'John Doe',
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
          status: 'Delivered',
          rating: 5,
          review: 'Great service! Very punctual and friendly.',
          earnings: 5.99
        },
        {
          id: 2,
          orderNumber: 'ORD-12346',
          date: '2024-03-14',
          time: '11:15 AM',
          customer: {
            name: 'Jane Smith',
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
          status: 'Delivered',
          rating: 4,
          review: 'Good delivery, but slightly late.',
          earnings: 3.99
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    if (filters.status !== 'all' && delivery.status !== filters.status) return false;
    if (filters.rating !== 'all' && delivery.rating !== parseInt(filters.rating)) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="history-page">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Delivery History</h1>
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="dateRange">
              <FaClock /> Date Range
            </label>
            <select
              id="dateRange"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="status">
              <FaMotorcycle /> Status
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="rating">
              <FaStar /> Rating
            </label>
            <select
              id="rating"
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      <div className="deliveries-list">
        {filteredDeliveries.length > 0 ? (
          filteredDeliveries.map(delivery => (
            <div key={delivery.id} className="delivery-card">
              <div className="delivery-header">
                <div className="delivery-info">
                  <h3>Order #{delivery.orderNumber}</h3>
                  <div className="delivery-meta">
                    <span className="date">{delivery.date}</span>
                    <span className="time">{delivery.time}</span>
                  </div>
                </div>
                <div className="delivery-status">
                  <span className={`status-badge ${delivery.status.toLowerCase()}`}>
                    {delivery.status}
                  </span>
                  <div className="rating">
                    <FaStar className="star-icon" />
                    <span>{delivery.rating}</span>
                  </div>
                </div>
              </div>

              <div className="delivery-timeline">
                <div className="timeline-item">
                  <FaMapMarkerAlt className="timeline-icon" />
                  <div className="timeline-content">
                    <h4>Pickup Location</h4>
                    <p>{delivery.restaurant.name}</p>
                    <p className="address">{delivery.restaurant.address}</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <FaMapMarkerAlt className="timeline-icon" />
                  <div className="timeline-content">
                    <h4>Delivery Location</h4>
                    <p>{delivery.customer.name}</p>
                    <p className="address">{delivery.customer.address}</p>
                  </div>
                </div>
              </div>

              <div className="delivery-items">
                <h4>Order Items</h4>
                <ul>
                  {delivery.items.map((item, index) => (
                    <li key={index}>
                      <span className="quantity">{item.quantity}x</span>
                      <span className="item-name">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="delivery-footer">
                <div className="earnings">
                  <span className="label">Earnings:</span>
                  <span className="amount">${delivery.earnings}</span>
                </div>
                {delivery.review && (
                  <div className="review">
                    <p className="review-text">{delivery.review}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-deliveries">
            <FaHistory className="no-deliveries-icon" />
            <h3>No Deliveries Found</h3>
            <p>No deliveries match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
