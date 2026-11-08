import jwt from 'jsonwebtoken';
import { httpError } from '../utils/httpError.js';

/**
 * Vérifie le jeton Bearer et injecte req.user = { id, role }.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(httpError(401, 'Authentification requise.'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (err) {
    return next(httpError(403, 'Token invalide ou expiré.'));
  }
}

/**
 * Vérifie que l'utilisateur authentifié a le rôle administrateur.
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(httpError(403, 'Accès réservé aux administrateurs.'));
  }
  return next();
}
