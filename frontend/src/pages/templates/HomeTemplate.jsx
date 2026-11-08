import { renderMarkdown } from '../../utils/markdown.js';

/**
 * Template "home" (page d'accueil) : bannière plein écran + sections.
 * La première section reproduit le bloc #about d'origine.
 */
export default function HomeTemplate({ page, settings = {} }) {
  const bannerStyle = settings.banner_image
    ? { backgroundImage: `url("${settings.banner_image}")` }
    : undefined;

  return (
    <>
      <section id="banner" style={bannerStyle}>
        <h1></h1>
      </section>

      {page.sections.map((section, index) => (
        <section key={section.id} id={index === 0 ? 'about' : undefined}>
          {section.title ? <h1>{section.title}</h1> : null}
          {section.subtitle ? <h2>{section.subtitle}</h2> : null}
          {section.content ? (
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }}
            />
          ) : null}

          {section.children && section.children.length > 0 ? (
            <div>
              {section.children.map((child) => (
                <div key={child.id}>
                  {child.title ? <h2>{child.title}</h2> : null}
                  {child.subtitle ? <h3>{child.subtitle}</h3> : null}
                  {child.content ? (
                    <div
                      className="rich-text"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(child.content) }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </>
  );
}
