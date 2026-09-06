const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const userRepository = require('../repositories/userRepository');
const generateToken = require('../utils/generateToken');

const SALT_ROUNDS = 10;

// POST /api/auth/signup
async function signup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, password, role } = req.body;

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Only allow OWNER or USER at signup; ADMIN is provisioned separately
    const safeRole = role === 'OWNER' ? 'OWNER' : 'USER';

    const user = await userRepository.createUser({
      name,
      email,
      phone,
      passwordHash,
      role: safeRole,
    });

    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[auth-service] signup error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await userRepository.findByEmail(email);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[auth-service] login error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /api/auth/me  (requires auth middleware)
async function getProfile(req, res) {
  try {
    const user = await userRepository.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error('[auth-service] getProfile error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { signup, login, getProfile };
