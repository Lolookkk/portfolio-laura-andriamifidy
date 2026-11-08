import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import AdminField from '../../components/admin/AdminField.jsx';

/**
 * Page de connexion cachée (accessible uniquement via /studio/login).
 * Aucun lien vers cette page n'existe dans la navigation publique.
 */
export default function AdminLogin() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Spinner label="Chargement…" />;
  if (user) return <Navigate to="/studio" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email.trim(), password);
      navigate('/studio', { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="studio-login">
      <form className="studio-login__card" onSubmit={handleSubmit}>
        <h1>Studio</h1>
        <p className="studio-login__sub">Espace d’administration privé.</p>

        {error ? <Alert kind="error">{error}</Alert> : null}

        <div className="admin-form">
          <AdminField label="Adresse e-mail">
            <input
              className="admin-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
            />
          </AdminField>

          <AdminField label="Mot de passe">
            <input
              className="admin-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </AdminField>

          <div className="admin-form__actions">
            <Button type="submit" variant="solid" disabled={submitting}>
              {submitting ? 'Connexion…' : 'Se connecter'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
