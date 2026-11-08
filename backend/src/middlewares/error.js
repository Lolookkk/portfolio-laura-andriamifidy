/**
 * Handler 404 : capture toute route non résolue.
 */
export function notFound(req, res) {
  res.status(404).json({ message: 'Ressource introuvable.' });
}

/**
 * Handler d'erreur global (4 arguments obligatoires pour Express).
 * Renvoie uniquement un message, jamais de détail technique sensible.
 */
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Erreur serveur.' });
}
