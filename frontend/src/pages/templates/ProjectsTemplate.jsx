import { useState } from 'react';
import ItemCard from '../../components/portfolio/ItemCard.jsx';
import { renderMarkdown } from '../../utils/markdown.js';

/**
 * Template "projects" : titre + filtre par catégorie + liste des projets.
 * Reproduit le comportement du <select id="filter"> d'origine.
 */
export default function ProjectsTemplate({ page, items, categories }) {
  const [filter, setFilter] = useState('all');

  const visible =
    filter === 'all'
      ? items
      : items.filter((item) => (item.categories || []).includes(filter));

  return (
    <section id="projects">
      <h1>{page.title}</h1>

      <select id="filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
        <option value="all">Tous</option>
        {categories.map((category) => (
          <option key={category.id} value={category.code}>
            {category.label}
          </option>
        ))}
      </select>

      {page.sections.map((section) => (
        <div key={section.id}>
          {section.title ? <h2>{section.title}</h2> : null}
          {section.content ? (
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }}
            />
          ) : null}
        </div>
      ))}

      {visible.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </section>
  );
}
