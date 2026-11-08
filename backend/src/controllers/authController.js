import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as users from '../models/users.js';
import { httpError } from '../utils/httpError.js';

/**
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      throw httpError(400, 'Email et mot de passe requis.');
    }

    const user = await users.findByEmail(email);
    if (!user) {
      throw httpError(401, 'Identifiants invalides.');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw httpError(401, 'Identifiants invalides.');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 */
export async function me(req, res, next) {
  try {
    const user = await users.findById(req.user.id);
    if (!user) {
      throw httpError(404, 'Utilisateur introuvable.');
    }
    res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
}
