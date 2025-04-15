const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const userMiddleware = require('../middleware/user');

const router = express.Router();

// Protected routes
router.use(authMiddleware.protect);

// Password update route
router.patch(
  '/updatePassword',
  userMiddleware.validatePassword,
  userMiddleware.verifyCurrentPassword,
  userController.updatePassword
);

// Profile routes
router.get('/me', userController.getMe);
router.patch('/updateMe', userController.updateMe);

// Address routes
router.get('/addresses', userController.getAddresses);
router.post('/addresses', userMiddleware.validateAddress, userController.addAddress);
router.patch('/addresses/:addressId', userMiddleware.validateAddress, userMiddleware.checkAddressExists, userController.updateAddress);
router.delete('/addresses/:addressId', userMiddleware.checkAddressExists, userController.deleteAddress);

// Admin routes
const adminRouter = express.Router();
adminRouter.use(authMiddleware.restrictTo('admin'));
adminRouter.get('/', userController.getAllUsers);

// Mount admin routes
router.use('/admin', adminRouter);

module.exports = router;