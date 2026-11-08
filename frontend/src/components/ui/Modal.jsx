import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Fenêtre modale réutilisable.
 * Reproduit le DOM attendu par Style.css (.modal-overlay .open / .modal / …)
 * et gère : touche Échap, clic sur l'overlay, blocage du scroll.
 *
 * Le contenu est rendu via un portail dans document.body : c'est indispensable
 * car les cartes .project ont un `transform` au survol, et un ancêtre transformé
 * rend le `position: fixed` de l'overlay relatif à la carte au lieu de la fenêtre.
 */
export default function Modal({ open, onClose, title, subtitle, children, maxWidth }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape' || event.key === 'Esc') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal" style={maxWidth ? { maxWidth } : undefined}>
        <button className="modal-close" onClick={onClose} aria-label="Fermer">
          &times;
        </button>
        <div className="modal-header">
          <h2>{title}</h2>
          {subtitle ? <p className="modal-subtitle">{subtitle}</p> : null}
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
