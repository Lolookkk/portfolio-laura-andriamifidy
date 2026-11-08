import { renderMarkdown } from '../../utils/markdown.js';

/**
 * Template "text" (ex. page Anglais) : titre de page en h1, puis une
 * succession de rubriques (h2) et sous-rubriques (h3).
 */
export default function TextTemplate({ page }) {
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

          {section.children && section.children.length > 0 ? (
            <div className="rich-text">
              {section.children.map((child) => (
                <div key={child.id}>
                  {child.title ? <h3>{child.title}</h3> : null}
                  {child.content ? (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(child.content) }} />
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </section>
  );
}
