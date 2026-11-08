import { Outlet } from 'react-router-dom';
import { useSite } from '../../hooks/useSite.js';
import Spinner from '../ui/Spinner.jsx';
import Alert from '../ui/Alert.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';

export default function SiteLayout() {
  const { site, loading, error } = useSite();

  if (loading) {
    return <Spinner label="Chargement du portfolio…" />;
  }

  if (error || !site) {
    return (
      <div className="page-state">
        <Alert kind="error">
          Impossible de charger le contenu : {error || 'réponse vide'}.
          <br />
          Vérifie que le backend est démarré (<code>npm run dev</code> dans <code>backend/</code>).
        </Alert>
      </div>
    );
  }

  const navPages = site.pages.filter((page) => page.nav_visible);

  return (
    <>
      <Sidebar pages={navPages} settings={site.settings} />
      <main id="content">
        <Outlet />
      </main>
      <Footer settings={site.settings} />
    </>
  );
}
