/**
 * Decodes the payload of a JWT without verifying its signature.
 * Signature verification MUST be performed server-side.
 *
 * @param {string} token - A JWT string (header.payload.signature).
 * @returns {object|null} The decoded payload object, or null if decoding fails.
 */
export function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const jsonPayload = atob(padded);
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Checks whether a JWT has expired based on its `exp` claim.
 * Does NOT verify the token signature.
 *
 * @param {string} token - A JWT string.
 * @returns {boolean} True if the token is expired or invalid, false if still valid.
 */
export function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;

  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp < nowSeconds;
}

/**
 * Extracts the user role(s) from the JWT payload.
 *
 * @param {string} token - A JWT string.
 * @returns {string[]|null} Array of role strings, or null if unavailable.
 */
export function getTokenRoles(token) {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  if (Array.isArray(payload.roles)) return payload.roles;
  if (typeof payload.role === 'string') return [payload.role];
  return null;
}

/**
 * Extracts the user ID from the JWT payload.
 *
 * @param {string} token - A JWT string.
 * @returns {string|number|null} The user ID from the `sub` or `userId` claim, or null.
 */
export function getTokenUserId(token) {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  return payload.sub ?? payload.userId ?? null;
}

/**
 * Returns the number of seconds until the token expires.
 * Returns 0 if the token is already expired or invalid.
 *
 * @param {string} token - A JWT string.
 * @returns {number} Seconds remaining until expiry.
 */
export function tokenExpiresInSeconds(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return 0;

  const nowSeconds = Math.floor(Date.now() / 1000);
  const remaining = payload.exp - nowSeconds;
  return remaining > 0 ? remaining : 0;
}
