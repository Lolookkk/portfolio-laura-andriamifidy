import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
  gfm: true, // tableaux, listes de tâches, etc.
  breaks: true, // un simple retour à la ligne devient un <br>
});

/**
 * Convertit du Markdown en HTML sécurisé pour l'affichage.
 * DOMPurify nettoie tout script malveillant avant injection dans le DOM.
 * @param {string} text
 * @returns {string}
 */
export function renderMarkdown(text) {
  if (!text) return '';
  const rawHtml = marked.parse(String(text));
  return DOMPurify.sanitize(rawHtml);
}
