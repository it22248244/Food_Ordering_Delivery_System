import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaKey, FaTrash, FaLock, FaPlus } from 'react-icons/fa';
import Button from '../../components/common/Button';
import { updateProfile, logout, updatePassword } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import useApi from '../../hooks/useApi'; // Import the useApi hook
import { userApi } from '../../api/config';
import api from '../../api/config';
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const api = useApi(); // Use the API hook
  
  // Form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    type: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const tabs = [
    { id: 'personal', title: 'Personal Info', icon: <FaUser /> },
    { id: 'addresses', title: 'Addresses', icon: <FaMapMarkerAlt /> },
    { id: 'security', title: 'Security', icon: <FaLock /> },
  ];
  
  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get('/users/addresses');
        setAddresses(response.data.addresses);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Could not load your addresses');
      }
    };
    
    if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab]);
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle address form input change
  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData({
      ...addressFormData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate profile form
  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!profileData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!profileData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(profileData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone number must be 10 digits';
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!profileData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!profileData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (profileData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (profileData.newPassword !== profileData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate address form
  const validateAddressForm = () => {
    const errors = {};
    
    if (!addressFormData.type) {
      errors.type = 'Address type is required';
    }
    
    if (!addressFormData.street) {
      errors.street = 'Street address is required';
    }
    
    if (!addressFormData.city) {
      errors.city = 'City is required';
    }
    
    if (!addressFormData.state) {
      errors.state = 'State is required';
    }
    
    if (!addressFormData.postalCode) {
      errors.postalCode = 'Postal code is required';
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateProfileForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Use the API hook to make the request
      const response = await api.patch('/users/updateMe', {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone
      });
      
      // Update redux state with the updated user data
      dispatch(updateProfile(response.data.user));
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validatePasswordForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Dispatch the updatePassword action
      await dispatch(updatePassword({
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword
      })).unwrap();
      
      toast.success('Password changed successfully');
      setIsChangingPassword(false);
      
      // Reset password fields
      setProfileData({
        ...profileData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle address update
  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateAddressForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (isAddingAddress) {
        // Add new address
        const response = await api.post('/users/addresses', addressFormData);
        setAddresses(response.data.addresses);
        toast.success('Address added successfully');
      } else {
        // Update existing address
        const response = await api.patch(`/users/addresses/${currentAddress._id}`, addressFormData);
        setAddresses(response.data.addresses);
        toast.success('Address updated successfully');
      }
      
      setIsEditingAddress(false);
      setIsAddingAddress(false);
      setCurrentAddress(null);
    } catch (error) {
      toast.error(error.message || `Failed to ${isAddingAddress ? 'add' : 'update'} address`);
      console.error(`Error ${isAddingAddress ? 'adding' : 'updating'} address:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Handle address deletion
  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await api.delete(`/users/addresses/${addressId}`);
        setAddresses(response.data.addresses);
        toast.success('Address deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete address');
        console.error('Error deleting address:', error);
      }
    }
  };
  
  // Open edit address form
  const openEditAddressForm = (address) => {
    setCurrentAddress(address);
    setAddressFormData({
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      isDefault: address.isDefault
    });
    setErrors({});
    setIsEditingAddress(true);
    setIsAddingAddress(false);
  };

  // Open add address form
  const openAddAddressForm = () => {
    setAddressFormData({
      type: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      isDefault: false
    });
    setErrors({});
    setIsEditingAddress(true);
    setIsAddingAddress(true);
    setCurrentAddress(null);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      ...profileData,
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setErrors({});
  };
  
  // Cancel password change
  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setProfileData({
      ...profileData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  // Cancel address edit
  const handleCancelAddressEdit = () => {
    setIsEditingAddress(false);
    setIsAddingAddress(false);
    setCurrentAddress(null);
    setErrors({});
  };
  
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <div className="user-avatar">
            <span>{user?.name?.charAt(0)?.toUpperCase()}</span>
          </div>
        </div>
          
        <div className="profile-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.title}</span>
            </button>
          ))}
        </div>
        
        <div className="profile-content">
          {activeTab === 'personal' && (
            <div className="personal-info">
              <div className="section-header">
                <h2>Personal Information</h2>
                <button
                    className="edit-button"
                  onClick={() => setIsEditing(!isEditing)}
                  >
                  <FaEdit />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              <div className="info-form">
                  <div className="form-group">
                  <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                    disabled={!isEditing}
                      />
                    </div>
                  <div className="form-group">
                  <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                    disabled={!isEditing}
                      />
                    </div>
                  <div className="form-group">
                  <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <button className="save-button" onClick={handleUpdateProfile}>
                    Save Changes
                  </button>
              )}
              </div>
            </div>
          )}
          
          {activeTab === 'addresses' && (
            <div className="addresses">
              <div className="section-header">
                <h2>Saved Addresses</h2>
                <button className="add-button" onClick={openAddAddressForm}>
                  <FaPlus />
                  Add New Address
                </button>
              </div>
              
              {isEditingAddress ? (
                <div className="address-form-container">
                  <h2>{isAddingAddress ? 'Add New Address' : 'Edit Address'}</h2>
                  
                  <form onSubmit={handleUpdateAddress} className="address-form">
                    <div className="form-group">
                      <label htmlFor="type">Address Type *</label>
                      <select
                        id="type"
                        name="type"
                        value={addressFormData.type}
                        onChange={handleAddressInputChange}
                        className={errors.type ? 'error' : ''}
                      >
                        <option value="">Select Type</option>
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.type && <div className="error-message">{errors.type}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="street">Street Address *</label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={addressFormData.street}
                        onChange={handleAddressInputChange}
                        className={errors.street ? 'error' : ''}
                      />
                      {errors.street && <div className="error-message">{errors.street}</div>}
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="city">City *</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={addressFormData.city}
                          onChange={handleAddressInputChange}
                          className={errors.city ? 'error' : ''}
                        />
                        {errors.city && <div className="error-message">{errors.city}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="state">State *</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={addressFormData.state}
                          onChange={handleAddressInputChange}
                          className={errors.state ? 'error' : ''}
                        />
                        {errors.state && <div className="error-message">{errors.state}</div>}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="postalCode">Postal Code *</label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={addressFormData.postalCode}
                        onChange={handleAddressInputChange}
                        className={errors.postalCode ? 'error' : ''}
                      />
                      {errors.postalCode && <div className="error-message">{errors.postalCode}</div>}
                    </div>
                    
                    <div className="form-group checkbox-group">
                      <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={addressFormData.isDefault}
                        onChange={handleAddressInputChange}
                      />
                      <label htmlFor="isDefault">Set as default address</label>
                    </div>
                    
                    <div className="form-actions">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelAddressEdit}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : isAddingAddress ? 'Add Address' : 'Update Address'}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="addresses-list">
                  {addresses.length > 0 ? (
                    addresses.map(address => (
                      <div key={address._id} className="address-card">
                        <div className="address-header">
                          <h3>{address.type}</h3>
                          {address.isDefault && (
                            <span className="default-badge">Default</span>
                          )}
                        </div>
                        
                        <div className="address-content">
                          <p>{address.street}</p>
                          <p>{address.city}, {address.state} {address.postalCode}</p>
                        </div>
                        
                        <div className="address-actions">
                          <button 
                            className="edit-address-button"
                            onClick={() => openEditAddressForm(address)}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            className="delete-address-button"
                            onClick={() => handleDeleteAddress(address._id)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-addresses">
                      <p>You don't have any saved addresses.</p>
                      <Button 
                        variant="primary"
                        onClick={openAddAddressForm}
                      >
                        Add Your First Address
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="security">
              <div className="section-header">
                <h2>Security Settings</h2>
              </div>
              
              <div className="security-options">
                <div className="security-option">
                  <h3>Change Password</h3>
                  <p>Update your account password</p>
                  {!isChangingPassword ? (
                    <button className="update-button" onClick={() => setIsChangingPassword(true)}>
                      Update Password
                    </button>
                  ) : (
                    <div className="password-form">
                      <div className="form-group">
                        <label>Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={profileData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Enter current password"
                        />
                        {errors.currentPassword && (
                          <span className="error-message">{errors.currentPassword}</span>
                        )}
                      </div>
                      
                      <div className="form-group">
                        <label>New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={profileData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Enter new password"
                        />
                        {errors.newPassword && (
                          <span className="error-message">{errors.newPassword}</span>
                        )}
                      </div>
                      
                      <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={profileData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm new password"
                        />
                        {errors.confirmPassword && (
                          <span className="error-message">{errors.confirmPassword}</span>
                        )}
                      </div>
                      
                      <div className="form-actions">
                        <button
                          type="button"
                          className="cancel-button"
                          onClick={handleCancelPasswordChange}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="save-button"
                          onClick={handleChangePassword}
                          disabled={loading}
                        >
                          {loading ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="security-option">
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                  <button className="update-button">Enable 2FA</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;