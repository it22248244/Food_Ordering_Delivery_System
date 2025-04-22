import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft, FaMapMarkerAlt, FaCreditCard, FaCheck } from 'react-icons/fa';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items, total } = useSelector((state) => state.cart);
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { id: 1, title: 'Delivery Address' },
    { id: 2, title: 'Payment Method' },
    { id: 3, title: 'Review Order' }
  ];

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // Your existing order placement logic here
      setIsProcessing(false);
      navigate('/orders');
    } catch (error) {
      setIsProcessing(false);
      // Handle error
    }
  };

  if (!user) {
    return (
      <div className="checkout-page">
        <div className="login-prompt">
          <h2>Please log in to checkout</h2>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
    );
    }
  
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Cart
        </button>

        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="steps">
            {steps.map((step) => (
                  <div 
                key={step.id}
                className={`step ${currentStep === step.id ? 'active' : ''} ${
                  currentStep > step.id ? 'completed' : ''
                }`}
                  >
                <div className="step-number">
                  {currentStep > step.id ? <FaCheck /> : step.id}
                </div>
                <div className="step-title">{step.title}</div>
              </div>
            ))}
          </div>
                    </div>
                    
        <div className="checkout-content">
          {currentStep === 1 && (
            <div className="step-content">
              <h2>Delivery Address</h2>
              <div className="address-form">
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                  />
                      </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" placeholder="Enter your city" />
                    </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input type="text" placeholder="Enter your postal code" />
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="step-content">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              <div 
                  className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('card')}
              >
                  <FaCreditCard />
                  <span>Credit/Debit Card</span>
                </div>
                <div
                  className={`payment-method ${paymentMethod === 'cash' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('cash')}
              >
                  <FaMapMarkerAlt />
                  <span>Cash on Delivery</span>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="step-content">
              <h2>Review Order</h2>
          <div className="order-summary">
                <div className="items-list">
                  {items.map((item) => (
                    <div key={item._id} className="item">
                      <div className="item-info">
                        <h3>{item.name}</h3>
                        <p>Quantity: {item.quantity}</p>
            </div>
                    <div className="item-price">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
                <div className="order-total">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
              </div>
              </div>
            </div>
          )}
            </div>
            
        <div className="checkout-actions">
          {currentStep > 1 && (
            <button
              className="secondary-button"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </button>
          )}
          {currentStep < 3 ? (
            <button
              className="primary-button"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </button>
          ) : (
            <button
              className="primary-button"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;