const paymentsService = require('./payments.service');

/**
 * POST /payments/initiate
 */
async function initiatePayment(req, res, next) {
  try {
    const result = await paymentsService.initiatePayment(req.body, req.user);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /payments/callback
 */
async function handleCallback(req, res, next) {
  try {
    const result = await paymentsService.handleCallback(req.body, req.headers);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /payments/:paymentId
 */
async function getPayment(req, res, next) {
  try {
    const { paymentId } = req.params;
    const result = await paymentsService.getPayment(paymentId, req.user);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /payments/:paymentId/retry
 */
async function retryPayment(req, res, next) {
  try {
    const { paymentId } = req.params;
    const result = await paymentsService.retryPayment(paymentId, req.body, req.user);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  initiatePayment,
  handleCallback,
  getPayment,
  retryPayment,
};
