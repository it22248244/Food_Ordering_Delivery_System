const paymentService = require('../services/paymentService');

// Initiate payment
exports.initiatePayment = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;
    
    if (!orderId || !amount || !paymentMethod) {
      return res.status(400).json({
        status: 'fail',
        message: 'Order ID, amount, and payment method are required'
      });
    }
    
    const paymentData = {
      orderId,
      userId: req.user.id,
      amount,
      paymentMethod
    };
    
    const result = await paymentService.initiatePayment(paymentData);
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, gatewayReference } = req.body;
    
    if (!paymentId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Payment ID is required'
      });
    }
    
    const result = await paymentService.verifyPayment(paymentId, {
      reference: gatewayReference
    });
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Process refund
exports.processRefund = async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;
    
    if (!paymentId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Payment ID is required'
      });
    }
    
    const result = await paymentService.processRefund(paymentId, {
      amount,
      reason
    });
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get payment details
exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const result = await paymentService.getPaymentDetails(paymentId);
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
};