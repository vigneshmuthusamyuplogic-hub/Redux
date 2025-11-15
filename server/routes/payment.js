const express = require('express');
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/verify-payment', paymentController.verifyPayment);

module.exports = router;