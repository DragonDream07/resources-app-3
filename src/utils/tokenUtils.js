const crypto = require('crypto');

const TOKEN_BYTE_LENGTH = 32;

/**
 * Generate a cryptographically secure random reset token.
 *
 * @returns {{ rawToken: string, hashedToken: string }}
 *   rawToken   - hex string to send to the user (not stored)
 *   hashedToken - SHA-256 hex digest to store in the database
 */
const generateResetToken = () => {
  const rawToken = crypto.randomBytes(TOKEN_BYTE_LENGTH).toString('hex');
  const hashedToken = hashToken(rawToken);
  return { rawToken, hashedToken };
};

/**
 * Hash a raw token using SHA-256.
 *
 * @param {string} rawToken - Hex string received from the user
 * @returns {string} SHA-256 hex digest
 */
const hashToken = (rawToken) =>
  crypto.createHash('sha256').update(rawToken).digest('hex');

/**
 * Verify a raw token against a stored hash in constant time.
 *
 * @param {string} rawToken    - Token provided by the user
 * @param {string} storedHash  - SHA-256 hex digest stored in DB
 * @returns {boolean}
 */
const verifyResetToken = (rawToken, storedHash) => {
  const candidateHash = hashToken(rawToken);
  const candidateBuf = Buffer.from(candidateHash, 'hex');
  const storedBuf = Buffer.from(storedHash, 'hex');

  if (candidateBuf.length !== storedBuf.length) return false;

  return crypto.timingSafeEqual(candidateBuf, storedBuf);
};

module.exports = {
  generateResetToken,
  hashToken,
  verifyResetToken,
};
