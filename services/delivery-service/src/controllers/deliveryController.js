const Delivery = require('../models/Delivery');
const DeliveryPersonnel = require('../models/DeliveryPersonnel');
const axios = require('axios');
const config = require('../config/config');

// Assign delivery person to an order
exports.assignDelivery = async (req, res) => {
  try {
    const { orderId, restaurantId, deliveryAddress } = req.body;
    
    // Get restaurant information to get coordinates
    let restaurantData;
    try {
      const response = await axios.get(
        `${config.servicesEndpoints.restaurantService}/api/v1/restaurants/${restaurantId}`
      );
      restaurantData = response.data.data.restaurant;
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      return res.status(404).json({
        status: 'fail',
        message: 'Restaurant not found'
      });
    }
    
    // Find nearest available delivery person
    const availableDeliveryPerson = await DeliveryPersonnel.findOne({
      isAvailable: true
    }).sort('deliveryCount'); // Assign to person with least deliveries
    
    if (!availableDeliveryPerson) {
      return res.status(404).json({
        status: 'fail',
        message: 'No delivery personnel available at the moment'
      });
    }
    
    // Create delivery record
    const deliveryData = {
      orderId,
      userId: req.body.userId,
      restaurantId,
      deliveryPersonId: availableDeliveryPerson._id,
      deliveryAddress,
      restaurantAddress: restaurantData.address,
      currentLocation: availableDeliveryPerson.currentLocation,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60000) // 45 minutes from now
    };
    
    const delivery = await Delivery.create(deliveryData);
    
    // Update delivery person status
    availableDeliveryPerson.isAvailable = false;
    availableDeliveryPerson.deliveryCount += 1;
    await availableDeliveryPerson.save();
    
    // Notify delivery person
    try {
      await axios.post(
        `${config.servicesEndpoints.notificationService}/api/v1/notifications/delivery-assignment`,
        {
          deliveryId: delivery._id,
          deliveryPersonId: availableDeliveryPerson._id,
          orderId
        }
      );
    } catch (error) {
      console.error('Error sending delivery assignment notification:', error);
      // Continue even if notification fails
    }
    
    res.status(201).json({
      status: 'success',
      data: {
        delivery,
        deliveryPersonId: availableDeliveryPerson._id
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update delivery status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status, currentLocation } = req.body;
    
    if (!status) {
      return res.status(400).json({
        status: 'fail',
        message: 'Status is required'
      });
    }
    
    const delivery = await Delivery.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({
        status: 'fail',
        message: 'No delivery found with that ID'
      });
    }
    
    // Check if user is the assigned delivery person
    if (delivery.deliveryPersonId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to update this delivery'
      });
    }
    
    // Update delivery status
    delivery.status = status;
    
    // Update current location if provided
    if (currentLocation) {
      delivery.currentLocation = {
        type: 'Point',
        coordinates: [currentLocation.longitude, currentLocation.latitude]
      };
    }
    
    // Update timestamps based on status
    if (status === 'picked_up') {
      delivery.pickedUpAt = Date.now();
    } else if (status === 'delivered') {
      delivery.deliveredAt = Date.now();
      delivery.actualDeliveryTime = Date.now();
      
      // Update delivery person status
      await DeliveryPersonnel.findByIdAndUpdate(
        delivery.deliveryPersonId,
        { isAvailable: true }
      );
      
      // Update order status to delivered
      try {
        await axios.patch(
          `${config.servicesEndpoints.orderService}/api/v1/orders/${delivery.orderId}/status`,
          { status: 'delivered' },
          { headers: { Authorization: req.headers.authorization } }
        );
      } catch (error) {
        console.error('Error updating order status:', error);
        // Continue even if order update fails
      }
    }
    
    await delivery.save();
    
    // Send notification about delivery status update
    try {
      await axios.post(
        `${config.servicesEndpoints.notificationService}/api/v1/notifications/delivery-status`,
        {
          deliveryId: delivery._id,
          orderId: delivery.orderId,
          userId: delivery.userId,
          status: delivery.status,
          currentLocation: delivery.currentLocation
        }
      );
    } catch (error) {
      console.error('Error sending delivery status notification:', error);
      // Continue even if notification fails
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        delivery
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get delivery status for an order
exports.getDeliveryByOrder = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ orderId: req.params.orderId });
    
    if (!delivery) {
      return res.status(404).json({
        status: 'fail',
        message: 'No delivery found for this order'
      });
    }
    
    // Get delivery person details
    const deliveryPerson = await DeliveryPersonnel.findById(delivery.deliveryPersonId);
    
    res.status(200).json({
      status: 'success',
      data: {
        delivery,
        deliveryPerson: {
          name: deliveryPerson.name,
          phone: deliveryPerson.phone,
          vehicleType: deliveryPerson.vehicleType,
          vehicleNumber: deliveryPerson.vehicleNumber,
          rating: deliveryPerson.rating
        }
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get all deliveries for a delivery person
exports.getMyDeliveries = async (req, res) => {
  try {
    // Find delivery personnel record for the user
    const deliveryPersonnel = await DeliveryPersonnel.findOne({ userId: req.user.id });
    
    if (!deliveryPersonnel) {
      return res.status(404).json({
        status: 'fail',
        message: 'Delivery personnel profile not found'
      });
    }
    
    // Get all deliveries assigned to this delivery person
    const deliveries = await Delivery.find({
      deliveryPersonId: deliveryPersonnel._id,
      status: { $ne: 'cancelled' }
    }).sort('-assignedAt');
    
    res.status(200).json({
      status: 'success',
      results: deliveries.length,
      data: {
        deliveries
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update delivery person's current location
exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        status: 'fail',
        message: 'Latitude and longitude are required'
      });
    }
    
    // Find delivery personnel record for the user
    const deliveryPersonnel = await DeliveryPersonnel.findOne({ userId: req.user.id });
    
    if (!deliveryPersonnel) {
      return res.status(404).json({
        status: 'fail',
        message: 'Delivery personnel profile not found'
      });
    }
    
    // Update location
    deliveryPersonnel.currentLocation = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };
    
    await deliveryPersonnel.save();
    
    // Update location for active deliveries
    await Delivery.updateMany(
      { 
        deliveryPersonId: deliveryPersonnel._id,
        status: { $in: ['assigned', 'picked_up', 'in_transit'] }
      },
      {
        currentLocation: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        currentLocation: deliveryPersonnel.currentLocation
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};