const usersService = require('./users.service');

const getMe = async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.user.id);
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const user = await usersService.updateUser(req.user.id, req.body);
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await usersService.changePassword(req.user.id, req.body);
    return res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
};

const getMyAddresses = async (req, res, next) => {
  try {
    const addresses = await usersService.getAddressesByUserId(req.user.id);
    return res.status(200).json({ success: true, data: addresses });
  } catch (err) {
    next(err);
  }
};

const createAddress = async (req, res, next) => {
  try {
    const address = await usersService.createAddress(req.user.id, req.body);
    return res.status(201).json({ success: true, data: address });
  } catch (err) {
    next(err);
  }
};

const getAddressById = async (req, res, next) => {
  try {
    const address = await usersService.getAddressById(req.user.id, req.params.addressId);
    return res.status(200).json({ success: true, data: address });
  } catch (err) {
    next(err);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const address = await usersService.updateAddress(req.user.id, req.params.addressId, req.body);
    return res.status(200).json({ success: true, data: address });
  } catch (err) {
    next(err);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    await usersService.deleteAddress(req.user.id, req.params.addressId);
    return res.status(200).json({ success: true, message: 'Address deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, search, role } = req.query;
    const result = await usersService.getAllUsers({ page, limit, search, role });
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.params.userId);
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const adminUpdateUser = async (req, res, next) => {
  try {
    const user = await usersService.updateUser(req.params.userId, req.body);
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await usersService.deleteUser(req.params.userId);
    return res.status(200).json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMe,
  updateMe,
  changePassword,
  getMyAddresses,
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  getAllUsers,
  getUserById,
  adminUpdateUser,
  deleteUser,
};
