const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller');
const { validateAdvanceOrder, validateCancelOrder, validateReturnRequest } = require('./orders.validator');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// Customer routes
router.get('/', authenticate, ordersController.listOrders);
router.get('/:orderId', authenticate, ordersController.getOrder);
router.get('/:orderId/timeline', authenticate, ordersController.getOrderTimeline);
router.get('/:orderId/tracking', authenticate, ordersController.getOrderTracking);
router.get('/:orderId/refunds', authenticate, ordersController.getOrderRefunds);
router.post('/:orderId/cancel', authenticate, validateCancelOrder, ordersController.cancelOrder);
router.post('/:orderId/return-requests', authenticate, validateReturnRequest, ordersController.createReturnRequest);

// Admin routes
router.post('/:orderId/advance', authenticate, authorize('admin'), validateAdvanceOrder, ordersController.advanceOrder);

module.exports = router;
