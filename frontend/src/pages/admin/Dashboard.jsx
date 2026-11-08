import { Link } from 'react-router-dom';
import { useSite } from '../../hooks/useSite.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Alert from '../../components/ui/Alert.jsx';

function countSections(pages) {
  return pages.reduce(
    (total, page) =>
      total + page.sections.reduce((sum, section) => sum + 1 + (section.children?.length || 0), 0),
    0
  );
}

export default function Dashboard() {
  const { site, loading, error } = useSite();

  if (loading) return <Spinner label="Chargement du contenu…" />;
  if (error || !site) {
    return <Alert kind="error">Impossible de charger le contenu : {error || 'réponse vide'}.</Alert>;
  }

  const drafts =
    site.items.filter((item) => !item.published).length +
    site.pages.filter((page) => !page.nav_visible).length;

  const stats = [
    { value: site.pages.length, label: 'Rubriques (pages)' },
    { value: countSections(site.pages), label: 'Sections & sous-sections' },
    { value: site.items.filter((item) => item.kind === 'project').length, label: 'Projets' },
    { value: site.items.filter((item) => item.kind === 'activity').length, label: 'Activités' },
    { value: site.categories.length, label: 'Catégories' },
    { value: drafts, label: 'Brouillons / masqués' },
  ];

  return (
    <>
      <h2>Tableau de bord</h2>
      <p className="admin-hint">
        Tout le contenu du portfolio est modifiable ici, sans toucher au code.
      </p>

      <div className="admin-stats">
        {stats.map((stat) => (
          <div className="admin-stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="admin-toolbar">
        <Link to="/studio/pages" className="admin-btn">
          Gérer les rubriques
        </Link>
        <Link to="/studio/items" className="admin-btn">
          Gérer les projets & activités
        </Link>
        <Link to="/studio/categories" className="admin-btn">
          Gérer les catégories
        </Link>
        <Link to="/studio/settings" className="admin-btn">
          Modifier la présentation
        </Link>
      </div>

      <Alert kind="info">
        Les modifications sont enregistrées directement dans la base de données et visibles
        immédiatement sur le site public.
      </Alert>
    </>
  );
}
