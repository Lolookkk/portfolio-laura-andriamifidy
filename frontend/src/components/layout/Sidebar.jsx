import { Link, useLocation } from 'react-router-dom';

function hrefFor(page) {
  return page.slug === 'accueil' ? '/' : `/${page.slug}`;
}

export default function Sidebar({ pages, settings }) {
  const location = useLocation();
  const currentSlug =
    location.pathname === '/' ? 'accueil' : location.pathname.replace(/^\//, '');

  return (
    <aside id="sidebar">
      <h1>
        {settings.brand_line1}
        <br />
        {settings.brand_line2}
      </h1>
      {settings.status ? <p className="status">{settings.status}</p> : null}

      <nav>
        {pages.map((page) => (
          <Link
            key={page.id}
            to={hrefFor(page)}
            className={page.slug === currentSlug ? 'active' : undefined}
          >
            {page.nav_label || page.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
