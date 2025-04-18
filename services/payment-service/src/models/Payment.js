const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'A payment must be associated with an order']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'A payment must be associated with a user']
  },
  amount: {
    type: Number,
    required: [true, 'A payment must have an amount']
  },
  currency: {
    type: String,
    default: 'LKR'  // Sri Lankan Rupee
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'payhere', 'frimi', 'dialog_genie', 'cash'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: String,
  paymentGatewayReference: String,
  refundAmount: Number,
  refundReason: String,
  refundedAt: Date,
  metadata: {
    type: Map,
    of: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for faster queries
paymentSchema.index({ orderId: 1 }, { unique: true });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;