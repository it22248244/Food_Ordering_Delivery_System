const Payment = require('../models/Payment');
const PayHereGateway = require('./paymentGateways/payhere');
const StripeGateway = require('./paymentGateways/stripe');
const axios = require('axios');
const config = require('../config/config');

class PaymentService {
  constructor() {
    this.paymentGateways = {
      payhere: new PayHereGateway(),
      stripe: new StripeGateway(),
      // Add other payment gateways as needed
    };
  }
  
  getGatewayForMethod(method) {
    switch (method) {
      case 'payhere':
        return this.paymentGateways.payhere;
      case 'credit_card':
        return this.paymentGateways.stripe;
      case 'frimi':
      case 'dialog_genie':
        // Use PayHere as default for these methods for demo
        return this.paymentGateways.payhere;
      default:
        throw new Error(`Unsupported payment method: ${method}`);
    }
  }
  
  async initiatePayment(paymentData) {
    try {
      // Create payment record
      const payment = await Payment.create({
        orderId: paymentData.orderId,
        userId: paymentData.userId,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        status: 'pending'
      });
      
      // For cash payments, no need to process through gateway
      if (paymentData.paymentMethod === 'cash') {
        return {
          success: true,
          paymentId: payment._id,
          status: 'pending',
          paymentMethod: 'cash'
        };
      }
      
      // Get the appropriate payment gateway
      const gateway = this.getGatewayForMethod(paymentData.paymentMethod);
      
      // Initiate payment with the gateway
      const gatewayResponse = await gateway.initiatePayment({
        amount: paymentData.amount,
        orderId: paymentData.orderId,
        userId: paymentData.userId,
        currency: 'LKR'
      });
      
      // Update payment record with gateway response
      payment.transactionId = gatewayResponse.transactionId;
      payment.paymentGatewayReference = gatewayResponse.gatewayReference;
      await payment.save();
      
      // Notify order service about payment initiation
      try {
        await axios.post(`${config.servicesEndpoints.orderService}/api/v1/orders/payment-update`, {
          orderId: paymentData.orderId,
          paymentId: payment._id,
          status: 'pending'
        });
      } catch (error) {
        console.error('Error notifying order service about payment:', error);
        // Continue even if notification fails
      }
      
      return {
        success: true,
        paymentId: payment._id,
        transactionId: gatewayResponse.transactionId,
        status: payment.status,
        paymentMethod: paymentData.paymentMethod,
        // Include any gateway-specific data needed by the client
        clientData: gatewayResponse.clientSecret || gatewayResponse.redirectUrl
      };
    } catch (error) {
      console.error('Payment initiation error:', error);
      
      // Create failed payment record if one doesn't exist yet
      if (!error.paymentId) {
        const failedPayment = await Payment.create({
          orderId: paymentData.orderId,
          userId: paymentData.userId,
          amount: paymentData.amount,
          paymentMethod: paymentData.paymentMethod,
          status: 'failed'
        });
        
        // Notify order service about payment failure
        try {
          await axios.post(`${config.servicesEndpoints.orderService}/api/v1/orders/payment-update`, {
            orderId: paymentData.orderId,
            paymentId: failedPayment._id,
            status: 'failed'
          });
        } catch (notifyError) {
          console.error('Error notifying order service about failed payment:', notifyError);
        }
        
        return {
          success: false,
          paymentId: failedPayment._id,
          status: 'failed',
          error: error.message
        };
      }
      
      throw error;
    }
  }
  
  async verifyPayment(paymentId, gatewayData) {
    try {
      const payment = await Payment.findById(paymentId);
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      // For cash payments, simply mark as completed
      if (payment.paymentMethod === 'cash') {
        payment.status = 'completed';
        await payment.save();
        
        // Notify order service about payment completion
        try {
          await axios.post(`${config.servicesEndpoints.orderService}/api/v1/orders/payment-update`, {
            orderId: payment.orderId,
            paymentId: payment._id,
            status: 'completed'
          });
        } catch (error) {
          console.error('Error notifying order service about completed payment:', error);
        }
        
        return {
          success: true,
          paymentId: payment._id,
          status: payment.status
        };
      }
      
      // Get the appropriate payment gateway
      const gateway = this.getGatewayForMethod(payment.paymentMethod);
      
      // Verify payment with the gateway
      const verificationResult = await gateway.verifyPayment(
        gatewayData.reference || payment.paymentGatewayReference
      );
      
      if (verificationResult.success) {
        payment.status = 'completed';
        await payment.save();
        
        // Notify order service about payment completion
        try {
          await axios.post(`${config.servicesEndpoints.orderService}/api/v1/orders/payment-update`, {
            orderId: payment.orderId,
            paymentId: payment._id,
            status: 'completed'
          });
        } catch (error) {
          console.error('Error notifying order service about completed payment:', error);
        }
      }
      
      return {
        success: verificationResult.success,
        paymentId: payment._id,
        status: payment.status
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }
  
  async processRefund(paymentId, refundData) {
    try {
      const payment = await Payment.findById(paymentId);
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      if (payment.status !== 'completed') {
        throw new Error('Only completed payments can be refunded');
      }
      
      // For cash payments, simply mark as refunded
      if (payment.paymentMethod === 'cash') {
        payment.status = 'refunded';
        payment.refundAmount = payment.amount;
        payment.refundReason = refundData.reason || 'Order cancelled';
        payment.refundedAt = Date.now();
        await payment.save();
        
        return {
          success: true,
          paymentId: payment._id,
          status: payment.status
        };
      }
      
      // Get the appropriate payment gateway
      const gateway = this.getGatewayForMethod(payment.paymentMethod);
      
      // Process refund with the gateway
      const refundResult = await gateway.processRefund({
        paymentId: payment._id,
        transactionId: payment.transactionId,
        paymentGatewayReference: payment.paymentGatewayReference,
        amount: refundData.amount || payment.amount
      });
      
      if (refundResult.success) {
        payment.status = 'refunded';
        payment.refundAmount = refundData.amount || payment.amount;
        payment.refundReason = refundData.reason || 'Order cancelled';
        payment.refundedAt = Date.now();
        await payment.save();
      }
      
      return {
        success: refundResult.success,
        paymentId: payment._id,
        status: payment.status
      };
    } catch (error) {
      console.error('Refund processing error:', error);
      throw error;
    }
  }
  
  async getPaymentDetails(paymentId) {
    try {
      const payment = await Payment.findById(paymentId);
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      return {
        success: true,
        payment
      };
    } catch (error) {
      console.error('Get payment details error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();