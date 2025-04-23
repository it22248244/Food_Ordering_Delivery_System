import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaTruck, FaClock } from 'react-icons/fa';
import useApi from '../../hooks/useApi';
import './OrderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = useApi();
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
      setLoading(true);
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch order details');
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
        fetchOrderDetails();
    }
  }, [orderId, user, api]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          className: 'status-pending',
          icon: <FaClock />,
          text: 'Pending'
        };
      case 'confirmed':
        return {
          className: 'status-confirmed',
          icon: <FaCheckCircle />,
          text: 'Confirmed'
        };
      case 'delivered':
        return {
          className: 'status-delivered',
          icon: <FaTruck />,
          text: 'Delivered'
        };
      case 'cancelled':
        return {
          className: 'status-cancelled',
          icon: <FaTimesCircle />,
          text: 'Cancelled'
  };
      default:
        return {
          className: 'status-pending',
          icon: <FaClock />,
          text: 'Unknown'
        };
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (!user) {
    return (
      <div className="order-detail-page">
        <div className="login-prompt">
          <h2>Please log in to view order details</h2>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="loading-spinner">Loading order details...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="order-detail-page">
        <div className="error-message">
          <h2>{error}</h2>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="not-found">
          <h2>Order not found</h2>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }
  
  const statusInfo = getStatusInfo(order.status);
  
  return (
    <div className="order-detail-page">
      <div className="order-detail-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Orders
        </button>

        <div className="order-header">
          <div className="order-info">
            <h1>Order #{order.orderNumber}</h1>
            <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                    </div>
          <div className={`status-badge ${statusInfo.className}`}>
            {statusInfo.icon}
            <span>{statusInfo.text}</span>
                  </div>
                </div>
                
        <div className="order-content">
          <div className="order-section">
            <h2>Order Summary</h2>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Subtotal</span>
                <span className="value">Rs. {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span className="label">Delivery Fee</span>
                <span className="value">Rs. {order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span className="label">Tax</span>
                <span className="value">Rs. {order.tax.toFixed(2)}</span>
              </div>
              <div className="summary-item total">
                <span className="label">Total</span>
                <span className="value">Rs. {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="order-section">
            <h2>Items</h2>
            <div className="items-list">
              {order.items.map((item) => (
                <div key={item._id} className="item-card">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="item-price">Rs. {item.price.toFixed(2)}</p>
                  </div>
                  <div className="item-quantity">
                    <span>Quantity: {item.quantity}</span>
                    <span className="item-subtotal">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
                </div>
                
          <div className="order-section">
            <h2>Delivery Information</h2>
            <div className="delivery-info">
              <div className="info-item">
                <span className="label">Delivery Address</span>
                <span className="value">{order.deliveryAddress}</span>
              </div>
              <div className="info-item">
                <span className="label">Contact Number</span>
                <span className="value">{order.contactNumber}</span>
                </div>
              <div className="info-item">
                <span className="label">Delivery Instructions</span>
                <span className="value">{order.deliveryInstructions || 'None'}</span>
              </div>
            </div>
                </div>
                
          <div className="order-section">
            <h2>Payment Information</h2>
            <div className="payment-info">
              <div className="info-item">
                <span className="label">Payment Method</span>
                <span className="value">{order.paymentMethod}</span>
              </div>
              <div className="info-item">
                <span className="label">Payment Status</span>
                <span className={`value ${order.paymentStatus === 'paid' ? 'paid' : 'unpaid'}`}>
                  {order.paymentStatus}
                  </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

  export default OrderDetail;