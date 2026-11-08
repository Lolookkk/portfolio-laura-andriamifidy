import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSite } from '../hooks/useSite.js';
import HomeTemplate from './templates/HomeTemplate.jsx';
import ProjectsTemplate from './templates/ProjectsTemplate.jsx';
import TextTemplate from './templates/TextTemplate.jsx';
import ItemsTemplate from './templates/ItemsTemplate.jsx';
import NotFound from './NotFound.jsx';

function findPage(pages, slug) {
  if (!slug) {
    return pages.find((page) => page.template === 'home') || pages[0];
  }
  return pages.find((page) => page.slug === slug);
}

export default function PublicPage() {
  const { slug } = useParams();
  const { site } = useSite();

  const page = site ? findPage(site.pages, slug) : null;

  useEffect(() => {
    if (!site || !page) return;
    const suffix = site.settings.title_suffix ? ` ${site.settings.title_suffix}` : '';
    document.title = `${page.title}${suffix}`;
  }, [site, page]);

  if (!page) return <NotFound />;

  const items = site.items.filter((item) => item.page_id === page.id);

  switch (page.template) {
    case 'home':
      return <HomeTemplate page={page} settings={site.settings} />;
    case 'projects':
      return (
        <ProjectsTemplate page={page} items={items} categories={site.categories} />
      );
    case 'items':
      return <ItemsTemplate page={page} items={items} />;
    case 'text':
    default:
      return <TextTemplate page={page} />;
  }
}
