const express = require('express');
const router = express.Router();
const checkoutController = require('./checkout.controller');
const { validateCheckoutStart, validateCheckoutAddress, validateCheckoutPlaceOrder } = require('./checkout.validator');
const { authenticate, optionalAuthenticate } = require('../../middleware/auth.middleware');

// POST /checkout/start — begin checkout session (supports guest checkout)
router.post('/start', optionalAuthenticate, validateCheckoutStart, checkoutController.startCheckout);

// POST /checkout/address — submit / update shipping address
router.post('/address', optionalAuthenticate, validateCheckoutAddress, checkoutController.submitAddress);

// GET /checkout/review — retrieve order summary for review step
router.get('/review', optionalAuthenticate, checkoutController.reviewCheckout);

// POST /checkout/place-order — finalise order and trigger payment intent
router.post('/place-order', optionalAuthenticate, validateCheckoutPlaceOrder, checkoutController.placeOrder);

module.exports = router;
