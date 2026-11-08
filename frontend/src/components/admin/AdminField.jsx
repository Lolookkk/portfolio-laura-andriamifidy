/** Champ de formulaire admin (libellé + contrôle + aide facultative). */
export default function AdminField({ label, hint, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}
