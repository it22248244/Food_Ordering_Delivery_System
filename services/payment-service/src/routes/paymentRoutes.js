const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.protect);

// Initiate payment
router.post('/initiate', paymentController.initiatePayment);

// Verify payment
router.post('/verify', paymentController.verifyPayment);

// Process refund (restricted to restaurant and admin roles)
router.post('/refund', 
  authMiddleware.restrictTo('restaurant', 'admin'),
  paymentController.processRefund
);

// Get payment details
router.get('/:paymentId', paymentController.getPaymentDetails);

module.exports = router;