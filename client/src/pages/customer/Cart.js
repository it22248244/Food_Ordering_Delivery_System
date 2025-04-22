import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaTrash, FaMinus, FaPlus, FaInfoCircle } from 'react-icons/fa';
import { removeItem, updateQuantity } from '../../redux/slices/cartSlice';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    setIsLoading(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsLoading(false);
    navigate('/checkout');
    }, 1000);
  };
  
  // Return to previous page
  const handleBackClick = () => {
      navigate('/restaurants');
  };
  
  // Render empty cart state
  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <h1>Your Cart</h1>
        </div>
        
        <div className="empty-cart">
          <div className="empty-cart-icon">
            🛒
          </div>
          <h2>Your cart is empty</h2>
          <p>Add items from a restaurant to get started</p>
          <Link to="/restaurants" className="browse-link">
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="back-button" onClick={handleBackClick}>
          <FaChevronLeft />
          <span>Back to Restaurants</span>
        </button>
        <h1>Your Cart</h1>
      </div>
      
      <div className="cart-container">
        <div className="cart-items-container">
          <div className="restaurant-info">
            <h2>Restaurant Name</h2>
            <p>Delivery time: 30-45 min</p>
          </div>
          
          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="no-image-placeholder">
                      No Image
                    </div>
                  )}
                </div>
                
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="restaurant-name">{item.restaurantName}</p>
                  <p className="price">Rs. {item.price.toFixed(2)}</p>
                </div>
                
                <div className="item-quantity">
                    <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="quantity-button"
                    >
                      <FaMinus />
                    </button>
                  <span>{item.quantity}</span>
                    <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="quantity-button"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  
                <div className="item-total">
                  <p>Rs. {(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="remove-button"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="special-instructions">
            <label htmlFor="instructions">Special Instructions</label>
            <textarea 
              id="instructions" 
              placeholder="Add notes for the restaurant (allergies, dietary restrictions, etc.)"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div className="cart-summary-container">
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>Rs. 2.99</span>
            </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs. {(total + 2.99).toFixed(2)}</span>
            </div>
            
            <Button 
              variant="primary" 
              fullWidth
              onClick={handleCheckout}
              className="checkout-button"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Proceed to Checkout'}
            </Button>
            
            <div className="cart-note">
              <FaInfoCircle className="info-icon" />
              <p>
                You can modify your order until the restaurant begins preparing it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;