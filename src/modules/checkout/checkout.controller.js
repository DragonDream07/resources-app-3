const checkoutService = require('./checkout.service');
const { AppError } = require('../../utils/errors');

/**
 * POST /checkout/start
 * Initiates a checkout session for an authenticated or guest user.
 */
async function startCheckout(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const { cartId, guestToken } = req.body;
    const result = await checkoutService.startCheckout({ cartId, guestToken, userId });
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /checkout/address
 * Saves or updates the shipping address for the current checkout session.
 */
async function submitAddress(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const { checkoutToken, address } = req.body;
    const result = await checkoutService.submitAddress({ checkoutToken, address, userId });
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /checkout/review
 * Returns a full order summary (items, address, promos, totals) for the review step.
 */
async function reviewCheckout(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const { checkoutToken } = req.query;
    const result = await checkoutService.reviewCheckout({ checkoutToken, userId });
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /checkout/place-order
 * Confirms stock, finalises promo, creates the order, and delegates payment intent.
 */
async function placeOrder(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const { checkoutToken, paymentMethod, promoCode } = req.body;
    const result = await checkoutService.placeOrder({ checkoutToken, paymentMethod, promoCode, userId });
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  startCheckout,
  submitAddress,
  reviewCheckout,
  placeOrder,
};
