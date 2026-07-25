const db = require('../../config/db');

async function getAddresses(userId) {
  const result = await db.query(
    'SELECT * FROM addresses WHERE user_id = $1 AND deleted_at IS NULL ORDER BY is_default DESC, created_at DESC',
    [userId]
  );
  return result.rows;
}

async function getAddress(userId, addressId) {
  const result = await db.query(
    'SELECT * FROM addresses WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
    [addressId, userId]
  );
  if (result.rows.length === 0) {
    const err = new Error('Address not found');
    err.statusCode = 404;
    throw err;
  }
  return result.rows[0];
}

async function checkServiceability(pinCode) {
  const result = await db.query(
    'SELECT id FROM serviceable_pin_codes WHERE pin_code = $1 AND is_active = true',
    [pinCode]
  );
  return result.rows.length > 0;
}

async function setDefaultAddress(userId, addressId, client) {
  const conn = client || db;
  await conn.query(
    'UPDATE addresses SET is_default = false WHERE user_id = $1 AND deleted_at IS NULL',
    [userId]
  );
  await conn.query(
    'UPDATE addresses SET is_default = true WHERE id = $1 AND user_id = $2',
    [addressId, userId]
  );
}

async function createAddress(userId, payload) {
  const {
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    pin_code,
    country,
    is_default,
    address_type,
  } = payload;

  const isServiceable = await checkServiceability(pin_code);
  if (!isServiceable) {
    const err = new Error('Delivery is not available at this pin code');
    err.statusCode = 422;
    throw err;
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const existingResult = await client.query(
      'SELECT COUNT(*) FROM addresses WHERE user_id = $1 AND deleted_at IS NULL',
      [userId]
    );
    const existingCount = parseInt(existingResult.rows[0].count, 10);
    const shouldBeDefault = is_default || existingCount === 0;

    if (shouldBeDefault) {
      await client.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1 AND deleted_at IS NULL',
        [userId]
      );
    }

    const insertResult = await client.query(
      `INSERT INTO addresses
        (user_id, full_name, phone, address_line1, address_line2, city, state, pin_code, country, is_default, address_type, is_serviceable, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
       RETURNING *`,
      [
        userId,
        full_name,
        phone,
        address_line1,
        address_line2 || null,
        city,
        state,
        pin_code,
        country || 'India',
        shouldBeDefault,
        address_type || 'home',
        isServiceable,
      ]
    );

    await client.query('COMMIT');
    return insertResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updateAddress(userId, addressId, payload) {
  const existing = await getAddress(userId, addressId);

  const {
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    pin_code,
    country,
    is_default,
    address_type,
  } = payload;

  const newPinCode = pin_code !== undefined ? pin_code : existing.pin_code;

  let isServiceable = existing.is_serviceable;
  if (pin_code && pin_code !== existing.pin_code) {
    isServiceable = await checkServiceability(pin_code);
    if (!isServiceable) {
      const err = new Error('Delivery is not available at this pin code');
      err.statusCode = 422;
      throw err;
    }
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const shouldBeDefault = is_default === true;
    if (shouldBeDefault) {
      await client.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1 AND deleted_at IS NULL',
        [userId]
      );
    }

    const updateResult = await client.query(
      `UPDATE addresses SET
        full_name     = COALESCE($1, full_name),
        phone         = COALESCE($2, phone),
        address_line1 = COALESCE($3, address_line1),
        address_line2 = $4,
        city          = COALESCE($5, city),
        state         = COALESCE($6, state),
        pin_code      = COALESCE($7, pin_code),
        country       = COALESCE($8, country),
        is_default    = $9,
        address_type  = COALESCE($10, address_type),
        is_serviceable = $11,
        updated_at    = NOW()
       WHERE id = $12 AND user_id = $13 AND deleted_at IS NULL
       RETURNING *`,
      [
        full_name || null,
        phone || null,
        address_line1 || null,
        address_line2 !== undefined ? address_line2 : existing.address_line2,
        city || null,
        state || null,
        newPinCode,
        country || null,
        shouldBeDefault ? true : existing.is_default,
        address_type || null,
        isServiceable,
        addressId,
        userId,
      ]
    );

    if (updateResult.rows.length === 0) {
      await client.query('ROLLBACK');
      const err = new Error('Address not found');
      err.statusCode = 404;
      throw err;
    }

    await client.query('COMMIT');
    return updateResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function deleteAddress(userId, addressId) {
  const existing = await getAddress(userId, addressId);

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      'UPDATE addresses SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND user_id = $2',
      [addressId, userId]
    );

    if (existing.is_default) {
      const nextResult = await client.query(
        'SELECT id FROM addresses WHERE user_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 1',
        [userId]
      );
      if (nextResult.rows.length > 0) {
        await client.query(
          'UPDATE addresses SET is_default = true WHERE id = $1',
          [nextResult.rows[0].id]
        );
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  checkServiceability,
};
