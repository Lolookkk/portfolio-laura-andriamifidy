import * as pagesModel from './pages.js';
import * as sectionsModel from './sections.js';
import * as categoriesModel from './categories.js';
import * as itemsModel from './items.js';
import * as settingsModel from './settings.js';

/** Champs exposés dans le JSON, conformément au contrat d'API. */
function mapPage(page, sections) {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    nav_label: page.nav_label,
    template: page.template,
    position: page.position,
    nav_visible: page.nav_visible,
    sections,
  };
}

function mapSection(section) {
  return {
    id: section.id,
    parent_id: section.parent_id,
    title: section.title,
    subtitle: section.subtitle,
    content: section.content,
    position: section.position,
  };
}

function mapItem(item) {
  return {
    id: item.id,
    kind: item.kind,
    page_id: item.page_id,
    section_id: item.section_id,
    title: item.title,
    subtitle: item.subtitle,
    description: item.description,
    categories: item.categories,
    tech: item.tech,
    image_url: item.image_url,
    repo_url: item.repo_url,
    demo_url: item.demo_url,
    modal_title: item.modal_title,
    modal_subtitle: item.modal_subtitle,
    modal_content: item.modal_content,
    gallery: item.gallery,
    position: item.position,
    published: item.published,
  };
}

/**
 * Assemble l'intégralité du contenu du site.
 * @param {{ includeDrafts?: boolean }} [options] includeDrafts : inclut les
 *   items non publiés et les pages masquées (usage admin).
 */
export async function getSite({ includeDrafts = false } = {}) {
  const [settings, categories, pages, sections, items] = await Promise.all([
    settingsModel.getAll(),
    categoriesModel.findAll(),
    pagesModel.findAll({ onlyVisible: !includeDrafts }),
    sectionsModel.findAll(),
    itemsModel.findAll({ onlyPublished: !includeDrafts }),
  ]);

  // Regroupe les sections par page.
  const sectionsByPage = new Map();
  for (const section of sections) {
    if (!sectionsByPage.has(section.page_id)) {
      sectionsByPage.set(section.page_id, []);
    }
    sectionsByPage.get(section.page_id).push(section);
  }

  const byPosition = (a, b) => a.position - b.position || a.id - b.id;

  const mappedPages = pages.map((page) => {
    const pageSections = sectionsByPage.get(page.id) || [];

    const roots = [];
    const childrenByParent = new Map();
    for (const section of pageSections) {
      if (section.parent_id === null) {
        roots.push(section);
      } else {
        if (!childrenByParent.has(section.parent_id)) {
          childrenByParent.set(section.parent_id, []);
        }
        childrenByParent.get(section.parent_id).push(section);
      }
    }

    const sectionsTree = roots.sort(byPosition).map((root) => ({
      ...mapSection(root),
      children: (childrenByParent.get(root.id) || [])
        .sort(byPosition)
        .map(mapSection),
    }));

    return mapPage(page, sectionsTree);
  });

  return {
    settings,
    categories,
    pages: mappedPages,
    items: items.map(mapItem),
  };
}
