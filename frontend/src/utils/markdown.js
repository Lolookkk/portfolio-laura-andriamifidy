import { marked } from 'marked';

marked.setOptions({
  gfm: true, // tableaux, listes de tâches, etc.
  breaks: true, // un simple retour à la ligne devient un <br>
});

/**
 * Convertit du Markdown en HTML pour l'affichage.
 * Le HTML brut reste accepté (le contenu existant continue de fonctionner),
 * ce qui permet une migration progressive vers le Markdown.
 * @param {string} text
 * @returns {string}
 */
export function renderMarkdown(text) {
  if (!text) return '';
  return marked.parse(String(text));
}
