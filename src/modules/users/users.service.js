const bcrypt = require('bcryptjs');
const { db } = require('../../config/database');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../../utils/errors');

const SALT_ROUNDS = 10;

const getUserById = async (userId) => {
  const user = await db('users')
    .where({ id: userId, deleted_at: null })
    .select(
      'id',
      'email',
      'first_name',
      'last_name',
      'phone',
      'role',
      'is_active',
      'created_at',
      'updated_at'
    )
    .first();

  if (!user) {
    throw new NotFoundError('User not found.');
  }

  return user;
};

const getUserByEmail = async (email) => {
  const user = await db('users')
    .where({ email, deleted_at: null })
    .first();
  return user || null;
};

const updateUser = async (userId, payload) => {
  const allowedFields = ['first_name', 'last_name', 'phone', 'role', 'is_active'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      updates[field] = payload[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    return getUserById(userId);
  }

  updates.updated_at = db.fn.now();

  const [updatedUser] = await db('users')
    .where({ id: userId, deleted_at: null })
    .update(updates)
    .returning([
      'id',
      'email',
      'first_name',
      'last_name',
      'phone',
      'role',
      'is_active',
      'created_at',
      'updated_at',
    ]);

  if (!updatedUser) {
    throw new NotFoundError('User not found.');
  }

  return updatedUser;
};

const changePassword = async (userId, { current_password, new_password }) => {
  const user = await db('users').where({ id: userId, deleted_at: null }).first();

  if (!user) {
    throw new NotFoundError('User not found.');
  }

  const isMatch = await bcrypt.compare(current_password, user.password_hash);
  if (!isMatch) {
    throw new UnauthorizedError('Current password is incorrect.');
  }

  const password_hash = await bcrypt.hash(new_password, SALT_ROUNDS);

  await db('users').where({ id: userId }).update({ password_hash, updated_at: db.fn.now() });
};

const getAllUsers = async ({ page = 1, limit = 20, search, role } = {}) => {
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  let query = db('users').where({ deleted_at: null });

  if (search) {
    query = query.where((builder) => {
      builder
        .whereILike('email', `%${search}%`)
        .orWhereILike('first_name', `%${search}%`)
        .orWhereILike('last_name', `%${search}%`)
        .orWhereILike('phone', `%${search}%`);
    });
  }

  if (role) {
    query = query.where({ role });
  }

  const totalQuery = query.clone().count('id as count').first();
  const total = await totalQuery;

  const users = await query
    .select(
      'id',
      'email',
      'first_name',
      'last_name',
      'phone',
      'role',
      'is_active',
      'created_at',
      'updated_at'
    )
    .orderBy('created_at', 'desc')
    .limit(parseInt(limit, 10))
    .offset(offset);

  return {
    data: users,
    pagination: {
      total: parseInt(total.count, 10),
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    },
  };
};

const deleteUser = async (userId) => {
  const user = await db('users').where({ id: userId, deleted_at: null }).first();

  if (!user) {
    throw new NotFoundError('User not found.');
  }

  await db('users').where({ id: userId }).update({ deleted_at: db.fn.now() });
};

const getAddressesByUserId = async (userId) => {
  const addresses = await db('addresses')
    .where({ user_id: userId, deleted_at: null })
    .orderBy('created_at', 'desc');
  return addresses;
};

const createAddress = async (userId, payload) => {
  const {
    label,
    recipient_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    is_default,
  } = payload;

  if (is_default) {
    await db('addresses')
      .where({ user_id: userId, deleted_at: null })
      .update({ is_default: false });
  }

  const [address] = await db('addresses')
    .insert({
      user_id: userId,
      label,
      recipient_name,
      phone,
      address_line1,
      address_line2: address_line2 || null,
      city,
      state,
      postal_code,
      country,
      is_default: is_default || false,
    })
    .returning('*');

  return address;
};

const getAddressById = async (userId, addressId) => {
  const address = await db('addresses')
    .where({ id: addressId, user_id: userId, deleted_at: null })
    .first();

  if (!address) {
    throw new NotFoundError('Address not found.');
  }

  return address;
};

const updateAddress = async (userId, addressId, payload) => {
  const existing = await db('addresses')
    .where({ id: addressId, user_id: userId, deleted_at: null })
    .first();

  if (!existing) {
    throw new NotFoundError('Address not found.');
  }

  if (payload.is_default) {
    await db('addresses')
      .where({ user_id: userId, deleted_at: null })
      .update({ is_default: false });
  }

  const allowedFields = [
    'label',
    'recipient_name',
    'phone',
    'address_line1',
    'address_line2',
    'city',
    'state',
    'postal_code',
    'country',
    'is_default',
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      updates[field] = payload[field];
    }
  });

  updates.updated_at = db.fn.now();

  const [updatedAddress] = await db('addresses')
    .where({ id: addressId, user_id: userId })
    .update(updates)
    .returning('*');

  return updatedAddress;
};

const deleteAddress = async (userId, addressId) => {
  const address = await db('addresses')
    .where({ id: addressId, user_id: userId, deleted_at: null })
    .first();

  if (!address) {
    throw new NotFoundError('Address not found.');
  }

  await db('addresses').where({ id: addressId }).update({ deleted_at: db.fn.now() });
};

module.exports = {
  getUserById,
  getUserByEmail,
  updateUser,
  changePassword,
  getAllUsers,
  deleteUser,
  getAddressesByUserId,
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
};
