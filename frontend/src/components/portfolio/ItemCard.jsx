import { useState } from 'react';
import TechBadges from './TechBadges.jsx';
import ItemModal from './ItemModal.jsx';
import { renderMarkdown } from '../../utils/markdown.js';

/**
 * Carte générique : sert à la fois pour les projets (page Projets)
 * et pour les activités (page À côté). Le rendu reproduit à l'identique
 * la structure HTML de l'ancien site statique.
 */
export default function ItemCard({ item }) {
  const [modalOpen, setModalOpen] = useState(false);

  const classes = ['project'];
  if (item.kind === 'activity') classes.push('activity');
  for (const category of item.categories || []) classes.push(category);
  if (item.image_url) classes.push('project-with-img');

  const hasModal = Boolean(item.modal_content);

  return (
    <article className={classes.join(' ')}>
      <div className="project-content">
        <div className="project-text">
          <h3>{item.title}</h3>

          {item.subtitle ? <p>{item.subtitle}</p> : null}

          {item.description ? (
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(item.description) }}
            />
          ) : null}

          <TechBadges tech={item.tech} />

          {item.repo_url ? (
            <a href={item.repo_url} target="_blank" rel="noreferrer">
              <img src="/images/github.png" className="logo_github" alt="GitHub" />
            </a>
          ) : null}

          {item.demo_url ? (
            <a href={item.demo_url} target="_blank" rel="noreferrer">
              <img
                src="/images/youtube.png"
                className="logo_github"
                style={{ marginLeft: '10px' }}
                alt="Vidéo"
              />
            </a>
          ) : null}

          {hasModal ? (
            <button className="more-btn" onClick={() => setModalOpen(true)}>
              En savoir plus →
            </button>
          ) : null}
        </div>

        {item.image_url ? (
          <div className="project-img">
            <img src={item.image_url} alt={item.title} />
          </div>
        ) : null}
      </div>

      {hasModal ? (
        <ItemModal item={item} open={modalOpen} onClose={() => setModalOpen(false)} />
      ) : null}
    </article>
  );
}
