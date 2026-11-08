/**
 * Déplace un élément dans un tableau (sans le muter).
 * @param {Array} list
 * @param {number} index position actuelle de l'élément
 * @param {'up'|'down'} direction
 * @returns {Array|null} nouveau tableau, ou null si le déplacement est impossible
 */
export function moveInArray(list, index, direction) {
  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= list.length) return null;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/**
 * Réassigne les positions 0..n-1 selon l'ordre fourni et ne persiste
 * que les éléments dont la position change réellement.
 * @param {Array} ordered liste ordonnée (chaque entrée possède id + position)
 * @param {{ update: (id: number, data: object) => Promise<any> }} api
 */
export async function persistPositions(ordered, api) {
  await Promise.all(
    ordered.map((entry, index) =>
      entry.position === index ? null : api.update(entry.id, { position: index })
    )
  );
}
