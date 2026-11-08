import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section>
      <h1>Page introuvable</h1>
      <p>La page demandée n’existe pas (ou plus).</p>
      <p>
        <Link to="/" className="admin-btn">
          Retour à l’accueil
        </Link>
      </p>
    </section>
  );
}
