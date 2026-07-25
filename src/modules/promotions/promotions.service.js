const { AppError } = require('../../utils/errors');
const db = require('../../db');

const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
};

/**
 * Validates promo code eligibility and applies discount to cart.
 */
const applyPromoCode = async ({ cartId, code, userId }) => {
  // Fetch promo code record
  const promoCode = await db('promo_codes')
    .where({ code: code.toUpperCase(), is_active: true })
    .first();

  if (!promoCode) {
    throw new AppError('Invalid or inactive promo code.', 400);
  }

  const now = new Date();

  // Check validity dates
  if (promoCode.valid_from && new Date(promoCode.valid_from) > now) {
    throw new AppError('Promo code is not yet valid.', 400);
  }
  if (promoCode.valid_until && new Date(promoCode.valid_until) < now) {
    throw new AppError('Promo code has expired.', 400);
  }

  // Check global usage limit
  if (promoCode.usage_limit !== null && promoCode.usage_count >= promoCode.usage_limit) {
    throw new AppError('Promo code usage limit has been reached.', 400);
  }

  // Check per-user usage limit
  if (promoCode.per_user_limit !== null) {
    const userUsage = await db('promo_code_usages')
      .where({ promo_code_id: promoCode.id, user_id: userId })
      .count('id as count')
      .first();
    if (parseInt(userUsage.count, 10) >= promoCode.per_user_limit) {
      throw new AppError('You have already used this promo code the maximum number of times.', 400);
    }
  }

  // Fetch cart
  const cart = await db('carts').where({ id: cartId, user_id: userId }).first();
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  // Fetch cart items with subtotal
  const items = await db('cart_items')
    .where({ cart_id: cartId })
    .select('id', 'quantity', 'unit_price');

  const cartSubtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.unit_price) * item.quantity,
    0
  );

  // Check minimum order value
  if (
    promoCode.minimum_order_value !== null &&
    cartSubtotal < parseFloat(promoCode.minimum_order_value)
  ) {
    throw new AppError(
      `Minimum order value of ${promoCode.minimum_order_value} is required to use this promo code.`,
      400
    );
  }

  // Calculate discount
  const discountAmount = calculateDiscount({
    discountType: promoCode.discount_type,
    discountValue: parseFloat(promoCode.discount_value),
    maxDiscountAmount: promoCode.max_discount_amount
      ? parseFloat(promoCode.max_discount_amount)
      : null,
    cartSubtotal,
  });

  // Apply promo code to cart (upsert)
  await db('carts').where({ id: cartId }).update({
    promo_code_id: promoCode.id,
    discount_amount: discountAmount,
    updated_at: db.fn.now(),
  });

  return {
    promoCodeId: promoCode.id,
    code: promoCode.code,
    discountType: promoCode.discount_type,
    discountValue: promoCode.discount_value,
    discountAmount,
    cartSubtotal,
    total: Math.max(0, cartSubtotal - discountAmount),
  };
};

/**
 * Calculates the discount amount based on type and constraints.
 */
const calculateDiscount = ({ discountType, discountValue, maxDiscountAmount, cartSubtotal }) => {
  let discount = 0;

  if (discountType === DISCOUNT_TYPES.PERCENTAGE) {
    discount = (discountValue / 100) * cartSubtotal;
    if (maxDiscountAmount !== null) {
      discount = Math.min(discount, maxDiscountAmount);
    }
  } else if (discountType === DISCOUNT_TYPES.FIXED) {
    discount = Math.min(discountValue, cartSubtotal);
  } else {
    throw new AppError('Unknown discount type.', 500);
  }

  return parseFloat(discount.toFixed(2));
};

/**
 * Records promo code usage after order placement.
 */
const recordPromoUsage = async ({ promoCodeId, userId, orderId }, trx) => {
  const queryBuilder = trx || db;
  await queryBuilder('promo_code_usages').insert({
    promo_code_id: promoCodeId,
    user_id: userId,
    order_id: orderId,
    used_at: db.fn.now(),
  });
  await queryBuilder('promo_codes')
    .where({ id: promoCodeId })
    .increment('usage_count', 1);
};

/**
 * Lists promo codes with optional pagination and active filter.
 */
const listPromoCodes = async ({ page = 1, limit = 20, active } = {}) => {
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  let query = db('promo_codes').orderBy('created_at', 'desc');

  if (active !== undefined) {
    query = query.where({ is_active: active === 'true' || active === true });
  }

  const [total, rows] = await Promise.all([
    query.clone().count('id as count').first(),
    query.clone().limit(parseInt(limit, 10)).offset(offset),
  ]);

  return {
    items: rows,
    pagination: {
      total: parseInt(total.count, 10),
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    },
  };
};

/**
 * Creates a new promo code.
 */
const createPromoCode = async (data) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    maxDiscountAmount,
    minimumOrderValue,
    usageLimit,
    perUserLimit,
    validFrom,
    validUntil,
    isActive,
  } = data;

  const existing = await db('promo_codes')
    .where({ code: code.toUpperCase() })
    .first();
  if (existing) {
    throw new AppError('A promo code with this code already exists.', 409);
  }

  const [promoCode] = await db('promo_codes')
    .insert({
      code: code.toUpperCase(),
      description: description || null,
      discount_type: discountType,
      discount_value: discountValue,
      max_discount_amount: maxDiscountAmount || null,
      minimum_order_value: minimumOrderValue || null,
      usage_limit: usageLimit || null,
      usage_count: 0,
      per_user_limit: perUserLimit || null,
      valid_from: validFrom || null,
      valid_until: validUntil || null,
      is_active: isActive !== undefined ? isActive : true,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning('*');

  return promoCode;
};

/**
 * Retrieves a single promo code by ID.
 */
const getPromoCode = async (promoCodeId) => {
  const promoCode = await db('promo_codes').where({ id: promoCodeId }).first();
  if (!promoCode) {
    throw new AppError('Promo code not found.', 404);
  }
  return promoCode;
};

/**
 * Updates an existing promo code.
 */
const updatePromoCode = async (promoCodeId, data) => {
  const existing = await db('promo_codes').where({ id: promoCodeId }).first();
  if (!existing) {
    throw new AppError('Promo code not found.', 404);
  }

  const updatePayload = {};
  if (data.code !== undefined) updatePayload.code = data.code.toUpperCase();
  if (data.description !== undefined) updatePayload.description = data.description;
  if (data.discountType !== undefined) updatePayload.discount_type = data.discountType;
  if (data.discountValue !== undefined) updatePayload.discount_value = data.discountValue;
  if (data.maxDiscountAmount !== undefined) updatePayload.max_discount_amount = data.maxDiscountAmount;
  if (data.minimumOrderValue !== undefined) updatePayload.minimum_order_value = data.minimumOrderValue;
  if (data.usageLimit !== undefined) updatePayload.usage_limit = data.usageLimit;
  if (data.perUserLimit !== undefined) updatePayload.per_user_limit = data.perUserLimit;
  if (data.validFrom !== undefined) updatePayload.valid_from = data.validFrom;
  if (data.validUntil !== undefined) updatePayload.valid_until = data.validUntil;
  if (data.isActive !== undefined) updatePayload.is_active = data.isActive;
  updatePayload.updated_at = db.fn.now();

  const [updated] = await db('promo_codes')
    .where({ id: promoCodeId })
    .update(updatePayload)
    .returning('*');

  return updated;
};

/**
 * Deletes a promo code by ID.
 */
const deletePromoCode = async (promoCodeId) => {
  const existing = await db('promo_codes').where({ id: promoCodeId }).first();
  if (!existing) {
    throw new AppError('Promo code not found.', 404);
  }
  await db('promo_codes').where({ id: promoCodeId }).delete();
};

module.exports = {
  applyPromoCode,
  calculateDiscount,
  recordPromoUsage,
  listPromoCodes,
  createPromoCode,
  getPromoCode,
  updatePromoCode,
  deletePromoCode,
};
