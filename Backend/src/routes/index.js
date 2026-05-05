const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Import sub-routers
const routeRoutes = require('./routeRoutes');
const hazardRoutes = require('./hazardRoutes');
const bugRoutes = require('./bugRoutes');

// Auth rate limiter — keep it aligned with the shared rate-limit config so
// repeated local test runs do not get blocked by a stale hardcoded cap.
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, 10),
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || process.env.RATE_LIMIT_MAX || 100, 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many auth attempts, please try again later.' },
});

// --- Auth routes ---

/**
 * POST /api/auth/register
 */
router.post('/auth/register', authLimiter, validateRegister, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password_hash: password });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      data: { user: user.toSafeObject(), token },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 */
router.post('/auth/login', authLimiter, validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email, is_active: true } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    await user.update({ last_login: new Date() });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: { user: user.toSafeObject(), token },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 */
router.get('/auth/me', authenticate, (req, res) => {
  res.json({ success: true, data: req.user.toSafeObject() });
});

// --- Mount sub-routers ---
router.use('/route', routeRoutes);
router.use('/hazards', hazardRoutes);
router.use('/bugs', bugRoutes);

// --- Health check ---
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

module.exports = router;
