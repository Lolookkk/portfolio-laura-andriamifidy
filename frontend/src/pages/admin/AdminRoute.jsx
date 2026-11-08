import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Spinner from '../../components/ui/Spinner.jsx';

/**
 * Garde d'accès à l'espace admin (/studio).
 * Redirige vers la page de connexion si la session n'est pas valide.
 */
export default function AdminRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner label="Vérification de la session…" />;
  }

  if (!user) {
    return <Navigate to="/studio/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
