const db = require('../../db');

/**
 * Create a notification for a user. Called by other services.
 * @param {object} params
 * @param {string|number} params.userId
 * @param {string} params.type
 * @param {string} params.title
 * @param {string} params.body
 * @param {object} [params.metadata]
 * @returns {Promise<object>} Created notification record
 */
async function createNotification({ userId, type, title, body, metadata = null }) {
  const result = await db.query(
    `INSERT INTO notifications (user_id, type, title, body, metadata, is_read, created_at)
     VALUES ($1, $2, $3, $4, $5, false, NOW())
     RETURNING *`,
    [userId, type, title, body, metadata ? JSON.stringify(metadata) : null]
  );
  return result.rows[0];
}

/**
 * Get paginated notifications for a user.
 * @param {string|number} userId
 * @param {object} options
 * @param {number} options.page
 * @param {number} options.limit
 * @param {boolean} options.unreadOnly
 * @returns {Promise<object>}
 */
async function getNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
  const offset = (page - 1) * limit;
  const conditions = ['user_id = $1'];
  const params = [userId];

  if (unreadOnly) {
    conditions.push('is_read = false');
  }

  const where = conditions.join(' AND ');

  const countResult = await db.query(
    `SELECT COUNT(*) FROM notifications WHERE ${where}`,
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  const dataResult = await db.query(
    `SELECT * FROM notifications WHERE ${where} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );

  const unreadCountResult = await db.query(
    `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
  const unreadCount = parseInt(unreadCountResult.rows[0].count, 10);

  return {
    data: dataResult.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    unreadCount,
  };
}

/**
 * Get a single notification by ID, scoped to a user.
 * @param {string|number} userId
 * @param {string|number} notificationId
 * @returns {Promise<object|null>}
 */
async function getNotificationById(userId, notificationId) {
  const result = await db.query(
    `SELECT * FROM notifications WHERE id = $1 AND user_id = $2`,
    [notificationId, userId]
  );
  return result.rows[0] || null;
}

/**
 * Get the unread notification count for a user.
 * @param {string|number} userId
 * @returns {Promise<number>}
 */
async function getUnreadCount(userId) {
  const result = await db.query(
    `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
  return parseInt(result.rows[0].count, 10);
}

/**
 * Mark all notifications as read for a user.
 * @param {string|number} userId
 * @returns {Promise<void>}
 */
async function markAllRead(userId) {
  await db.query(
    `UPDATE notifications SET is_read = true, read_at = NOW() WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
}

/**
 * Mark a single notification as read for a user.
 * @param {string|number} userId
 * @param {string|number} notificationId
 * @returns {Promise<object|null>}
 */
async function markOneRead(userId, notificationId) {
  const result = await db.query(
    `UPDATE notifications SET is_read = true, read_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [notificationId, userId]
  );
  return result.rows[0] || null;
}

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  getUnreadCount,
  markAllRead,
  markOneRead,
};
