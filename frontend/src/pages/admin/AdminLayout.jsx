import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../../components/ui/Button.jsx';

const LINKS = [
  { to: '/studio', label: 'Tableau de bord', end: true },
  { to: '/studio/pages', label: 'Rubriques & sections' },
  { to: '/studio/items', label: 'Projets & activités' },
  { to: '/studio/categories', label: 'Catégories' },
  { to: '/studio/settings', label: 'Présentation' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <p className="admin-header__brand">
          Studio <span>· portfolio</span>
        </p>
        <span className="admin-header__spacer" />
        <span className="admin-hint">{user?.email}</span>
        <Link to="/" className="admin-btn admin-btn--ghost" target="_blank" rel="noreferrer">
          Voir le site
        </Link>
        <Button variant="ghost" onClick={logout}>
          Déconnexion
        </Button>
      </header>

      <nav className="admin-nav">
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
