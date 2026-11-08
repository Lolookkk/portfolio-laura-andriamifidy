import ItemCard from '../../components/portfolio/ItemCard.jsx';
import { renderMarkdown } from '../../utils/markdown.js';

/**
 * Template "items" (ex. page À côté) : titre + rubriques d'introduction
 * puis cartes d'activités avec fenêtre « En savoir plus ».
 */
export default function ItemsTemplate({ page, items }) {
  return (
    <section id={page.slug}>
      <h1>{page.title}</h1>

      {page.sections.map((section) => (
        <div key={section.id}>
          {section.title ? <h2>{section.title}</h2> : null}
          {section.subtitle ? <h3>{section.subtitle}</h3> : null}
          {section.content ? (
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }}
            />
          ) : null}
        </div>
      ))}

      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </section>
  );
}
