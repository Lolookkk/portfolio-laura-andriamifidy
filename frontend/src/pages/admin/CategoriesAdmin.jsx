import { useState } from 'react';
import { useSite } from '../../hooks/useSite.js';
import { categoriesApi } from '../../services/contentService.js';
import { moveInArray, persistPositions } from '../../utils/reorder.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import AdminField from '../../components/admin/AdminField.jsx';

export default function CategoriesAdmin() {
  const { site, loading, error, reload } = useSite();
  const [actionError, setActionError] = useState(null);
  const [form, setForm] = useState(null); // { id?, code, label }

  if (loading) return <Spinner label="Chargement…" />;
  if (error || !site) {
    return <Alert kind="error">Impossible de charger le contenu : {error || 'réponse vide'}.</Alert>;
  }

  const categories = site.categories;

  async function guard(action) {
    setActionError(null);
    try {
      await action();
      await reload();
    } catch (err) {
      setActionError(err.message);
      throw err;
    }
  }

  async function save(values) {
    const payload = { code: values.code.trim(), label: values.label.trim() };
    if (values.id) {
      await guard(() => categoriesApi.update(values.id, payload));
    } else {
      await guard(() => categoriesApi.create({ ...payload, position: categories.length }));
    }
    setForm(null);
  }

  function move(index, direction) {
    const next = moveInArray(categories, index, direction);
    if (next) guard(() => persistPositions(next, categoriesApi));
  }

  function remove(category) {
    if (!window.confirm(`Supprimer la catégorie « ${category.label} » ?`)) return;
    guard(() => categoriesApi.remove(category.id));
  }

  return (
    <>
      <h2>Catégories</h2>
      <p className="admin-hint">
        Ces catégories alimentent le filtre de la page « Projets ». Le code (ex. <code>dev</code>)
        doit rester simple et sans espace.
      </p>

      <div className="admin-toolbar">
        <Button variant="solid" onClick={() => setForm({ code: '', label: '' })}>
          + Ajouter une catégorie
        </Button>
      </div>

      {actionError ? <Alert kind="error">{actionError}</Alert> : null}

      {categories.length === 0 ? (
        <div className="admin-empty">Aucune catégorie pour le moment.</div>
      ) : (
        categories.map((category, index) => (
          <div className="admin-card" key={category.id}>
            <div className="admin-card__head">
              <div className="admin-reorder">
                <button
                  type="button"
                  onClick={() => move(index, 'up')}
                  disabled={index === 0}
                  aria-label="Monter"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 'down')}
                  disabled={index === categories.length - 1}
                  aria-label="Descendre"
                >
                  ▼
                </button>
              </div>

              <div>
                <h3 className="admin-card__title">{category.label}</h3>
                <p className="admin-card__meta">code : {category.code}</p>
              </div>

              <div className="admin-card__actions">
                <Button variant="ghost" onClick={() => setForm({ ...category })}>
                  Modifier
                </Button>
                <Button variant="danger" onClick={() => remove(category)}>
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        ))
      )}

      {form ? (
        <CategoryForm
          key={form.id ?? 'new'}
          initial={form}
          onClose={() => setForm(null)}
          onSubmit={save}
        />
      ) : null}
    </>
  );
}

function CategoryForm({ initial, onClose, onSubmit }) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (patch) => setValues((current) => ({ ...current, ...patch }));

  async function handleSubmit(event) {
    event.preventDefault();
    if (!values.code.trim() || !values.label.trim()) {
      setError('Le code et le libellé sont requis.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={initial.id ? 'Modifier la catégorie' : 'Nouvelle catégorie'} maxWidth="440px">
      <form className="admin-form" onSubmit={handleSubmit}>
        {error ? <Alert kind="error">{error}</Alert> : null}

        <AdminField label="Libellé" hint="Nom affiché dans le menu de filtre.">
          <input
            className="admin-input"
            value={values.label}
            onChange={(event) => set({ label: event.target.value })}
          />
        </AdminField>

        <AdminField label="Code" hint="Identifiant technique, sans espace (ex. dev, cybersec).">
          <input
            className="admin-input"
            value={values.code}
            onChange={(event) => set({ code: event.target.value })}
          />
        </AdminField>

        <div className="admin-form__actions">
          <Button type="submit" variant="solid" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </form>
    </Modal>
  );
}
