const promotionsService = require('./promotions.service');

const applyPromoCode = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { code } = req.body;
    const userId = req.user.id;
    const result = await promotionsService.applyPromoCode({ cartId, code, userId });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const listPromoCodes = async (req, res, next) => {
  try {
    const { page, limit, active } = req.query;
    const result = await promotionsService.listPromoCodes({ page, limit, active });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const createPromoCode = async (req, res, next) => {
  try {
    const promoCode = await promotionsService.createPromoCode(req.body);
    return res.status(201).json({ success: true, data: promoCode });
  } catch (err) {
    next(err);
  }
};

const getPromoCode = async (req, res, next) => {
  try {
    const { promoCodeId } = req.params;
    const promoCode = await promotionsService.getPromoCode(promoCodeId);
    return res.status(200).json({ success: true, data: promoCode });
  } catch (err) {
    next(err);
  }
};

const updatePromoCode = async (req, res, next) => {
  try {
    const { promoCodeId } = req.params;
    const promoCode = await promotionsService.updatePromoCode(promoCodeId, req.body);
    return res.status(200).json({ success: true, data: promoCode });
  } catch (err) {
    next(err);
  }
};

const deletePromoCode = async (req, res, next) => {
  try {
    const { promoCodeId } = req.params;
    await promotionsService.deletePromoCode(promoCodeId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  applyPromoCode,
  listPromoCodes,
  createPromoCode,
  getPromoCode,
  updatePromoCode,
  deletePromoCode,
};
