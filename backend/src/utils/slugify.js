/**
 * Transforme une chaîne en slug URL-safe.
 * Retire les accents, met en minuscules et remplace tout caractère
 * non alphanumérique par un tiret.
 * @param {string} input
 * @returns {string}
 */
export function slugify(input) {
  if (!input) return '';
  return String(input)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
