const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const razorpayController = require('../controllers/razorpayController');
const { createOrder } = require('../controllers/cashfreeController');

router.post('/create-order', razorpayController.createRazorpayOrderOld);
router.post('/razorpay/order', razorpayController.createRazorpayOrder);
router.post('/razorpay/verify', razorpayController.verifyRazorpayPayment);
router.get('/get', productController.getPaginatedProducts);
router.get('/', productController.getAllProducts);
router.get('/:identifier', productController.getProduct);

module.exports = router;