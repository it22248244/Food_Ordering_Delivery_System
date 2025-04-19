const express = require('express');
const deliveryController = require('../controllers/deliveryController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.protect);

// Assign delivery person to an order
router.post('/assign', 
  authMiddleware.restrictTo('restaurant', 'admin'),
  deliveryController.assignDelivery
);

// Get delivery status for an order (for customers and restaurants)
router.get('/order/:orderId', deliveryController.getDeliveryByOrder);

// Routes for delivery personnel
router.get('/my-deliveries', 
  authMiddleware.restrictTo('delivery'),
  deliveryController.getMyDeliveries
);

router.patch('/location', 
  authMiddleware.restrictTo('delivery'),
  deliveryController.updateLocation
);

router.patch('/:id/status',
  authMiddleware.restrictTo('delivery', 'admin'),
  deliveryController.updateDeliveryStatus
);

module.exports = router;