/**
 * Crée une erreur HTTP portant un statut, destinée au handler d'erreur Express.
 * @param {number} status
 * @param {string} message
 * @returns {Error & { status: number }}
 */
export function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
