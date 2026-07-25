const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

// In-memory stores — replace with DB repositories in production
const usersStore = new Map();
const resetTokensStore = new Map();
const blacklistedTokensStore = new Set();

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function register({ email, password, firstName, lastName }) {
  const existingUser = usersStore.get(email);
  if (existingUser) {
    const error = new Error('A user with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const userId = crypto.randomUUID();
  const user = {
    id: userId,
    email,
    password: hashedPassword,
    firstName: firstName || '',
    lastName: lastName || '',
    isGuest: false,
    createdAt: new Date().toISOString(),
  };
  usersStore.set(email, user);

  const token = generateToken({ sub: userId, email, isGuest: false });
  return { token, user: { id: userId, email, firstName: user.firstName, lastName: user.lastName, isGuest: false } };
}

async function login({ email, password }) {
  const user = usersStore.get(email);
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({ sub: user.id, email: user.email, isGuest: user.isGuest });
  return { token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, isGuest: user.isGuest } };
}

async function logout(token) {
  if (token) {
    blacklistedTokensStore.add(token);
  }
}

async function forgotPassword({ email }) {
  const user = usersStore.get(email);
  if (!user) {
    // Return silently to avoid user enumeration
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  resetTokensStore.set(hashedToken, {
    userId: user.id,
    email: user.email,
    expiresAt: Date.now() + RESET_TOKEN_EXPIRY_MS,
  });

  // In production, send resetToken via email. Here we log it.
  console.info(`[Auth] Password reset token for ${email}: ${resetToken}`);
}

async function resetPassword({ token, password }) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const record = resetTokensStore.get(hashedToken);

  if (!record) {
    const error = new Error('Invalid or expired password reset token.');
    error.statusCode = 400;
    throw error;
  }

  if (Date.now() > record.expiresAt) {
    resetTokensStore.delete(hashedToken);
    const error = new Error('Invalid or expired password reset token.');
    error.statusCode = 400;
    throw error;
  }

  const user = usersStore.get(record.email);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  user.password = hashedPassword;
  usersStore.set(record.email, user);
  resetTokensStore.delete(hashedToken);
}

async function guestRegister({ email }) {
  const guestId = crypto.randomUUID();
  const guestEmail = email || `guest_${guestId}@guest.local`;

  const guestUser = {
    id: guestId,
    email: guestEmail,
    password: null,
    firstName: 'Guest',
    lastName: '',
    isGuest: true,
    createdAt: new Date().toISOString(),
  };

  usersStore.set(guestEmail, guestUser);

  const token = generateToken({ sub: guestId, email: guestEmail, isGuest: true });
  return { token, user: { id: guestId, email: guestEmail, firstName: 'Guest', lastName: '', isGuest: true } };
}

function isTokenBlacklisted(token) {
  return blacklistedTokensStore.has(token);
}

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  guestRegister,
  isTokenBlacklisted,
  generateToken,
};
