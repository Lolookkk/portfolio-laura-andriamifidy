// Conversions entre les champs texte des formulaires admin
// et les valeurs stockées en base.

/** "Rust, Axum" -> ["Rust", "Axum"] */
export function textToList(text) {
  return String(text || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

/** ["Rust", "Axum"] -> "Rust, Axum" */
export function listToText(list) {
  return (Array.isArray(list) ? list : []).join(', ');
}

function nonEmptyLines(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

/** "img.png | Légende" (une ligne par image) -> [{ url, alt }] */
export function parseGallery(text) {
  return nonEmptyLines(text).map((line) => {
    const [url, alt] = line.split('|').map((part) => part.trim());
    return { url, alt: alt || '' };
  });
}

/** [{ url, alt }] -> "img.png | Légende" */
export function galleryToText(gallery) {
  return (Array.isArray(gallery) ? gallery : [])
    .map((image) => (image.alt ? `${image.url} | ${image.alt}` : image.url))
    .join('\n');
}
