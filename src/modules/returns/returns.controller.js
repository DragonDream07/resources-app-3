const returnsService = require('./returns.service');
const { validationResult } = require('express-validator');

/**
 * POST /orders/:orderId/return-requests
 * Initiate a return request for a given order.
 */
async function createReturnRequest(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { orderId } = req.params;
    const userId = req.user.id;
    const payload = req.body;
    const returnRequest = await returnsService.createReturnRequest(orderId, userId, payload);
    return res.status(201).json({ data: returnRequest });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /return-requests
 * Admin: list all return requests with optional filters.
 */
async function listReturnRequests(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      orderId: req.query.orderId,
      page: req.query.page ? parseInt(req.query.page, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit, 10) : 20,
    };
    const result = await returnsService.listReturnRequests(filters);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /return-requests/:returnRequestId
 * Get details of a single return request.
 */
async function getReturnRequest(req, res, next) {
  try {
    const { returnRequestId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const returnRequest = await returnsService.getReturnRequest(returnRequestId, userId, isAdmin);
    return res.status(200).json({ data: returnRequest });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /return-requests/:returnRequestId/review
 * Admin: approve or reject a return request.
 */
async function reviewReturnRequest(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { returnRequestId } = req.params;
    const adminId = req.user.id;
    const payload = req.body;
    const updated = await returnsService.reviewReturnRequest(returnRequestId, adminId, payload);
    return res.status(200).json({ data: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createReturnRequest,
  listReturnRequests,
  getReturnRequest,
  reviewReturnRequest,
};
