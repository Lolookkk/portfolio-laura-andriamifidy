import { useState } from 'react';
import { useSite } from '../../hooks/useSite.js';
import { itemsApi } from '../../services/contentService.js';
import { moveInArray, persistPositions } from '../../utils/reorder.js';
import { listToText, textToList, parseGallery, galleryToText } from '../../utils/format.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import AdminField from '../../components/admin/AdminField.jsx';

function newItemValues(site, pageId) {
  return {
    kind: 'project',
    page_id: pageId ?? site.pages[0]?.id ?? '',
    section_id: '',
    title: '',
    subtitle: '',
    description: '',
    categories: [],
    techText: '',
    image_url: '',
    repo_url: '',
    demo_url: '',
    modal_title: '',
    modal_subtitle: '',
    modal_content: '',
    galleryText: '',
    published: true,
  };
}

function itemValues(item) {
  return {
    id: item.id,
    kind: item.kind,
    page_id: item.page_id ?? '',
    section_id: item.section_id ?? '',
    title: item.title,
    subtitle: item.subtitle || '',
    description: item.description || '',
    categories: item.categories || [],
    techText: listToText(item.tech),
    image_url: item.image_url || '',
    repo_url: item.repo_url || '',
    demo_url: item.demo_url || '',
    modal_title: item.modal_title || '',
    modal_subtitle: item.modal_subtitle || '',
    modal_content: item.modal_content || '',
    galleryText: galleryToText(item.gallery),
    published: item.published !== false,
  };
}

/**
 * Renvoie les sections d'une page (rubriques + sous-sections) sous forme
 * de liste plate { id, label } pour le sélecteur.
 */
function sectionOptions(page) {
  if (!page) return [];
  const options = [];
  for (const section of page.sections) {
    options.push({ id: section.id, label: section.title || `Section #${section.id}` });
    for (const child of section.children || []) {
      options.push({ id: child.id, label: `— ${child.title || `Sous-section #${child.id}`}` });
    }
  }
  return options;
}

export default function ItemsAdmin() {
  const { site, loading, error, reload } = useSite();
  const [actionError, setActionError] = useState(null);
  const [pageFilter, setPageFilter] = useState('all');
  const [kindFilter, setKindFilter] = useState('all');
  const [itemForm, setItemForm] = useState(null);

  if (loading) return <Spinner label="Chargement…" />;
  if (error || !site) {
    return <Alert kind="error">Impossible de charger le contenu : {error || 'réponse vide'}.</Alert>;
  }

  const groups = site.pages
    .map((page) => ({
      page,
      items: site.items
        .filter((item) => item.page_id === page.id)
        .filter((item) => kindFilter === 'all' || item.kind === kindFilter),
    }))
    .filter((group) => pageFilter === 'all' || String(group.page.id) === pageFilter);

  const orphanItems = site.items
    .filter((item) => !item.page_id)
    .filter((item) => kindFilter === 'all' || item.kind === kindFilter);

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

  async function saveItem(values) {
    const payload = {
      kind: values.kind,
      page_id: values.page_id ? Number(values.page_id) : null,
      section_id: values.section_id ? Number(values.section_id) : null,
      title: values.title.trim(),
      subtitle: values.subtitle.trim() || null,
      description: values.description.trim() || null,
      categories: values.categories,
      tech: textToList(values.techText),
      image_url: values.image_url.trim() || null,
      repo_url: values.repo_url.trim() || null,
      demo_url: values.demo_url.trim() || null,
      modal_title: values.modal_title.trim() || null,
      modal_subtitle: values.modal_subtitle.trim() || null,
      modal_content: values.modal_content.trim() || null,
      gallery: parseGallery(values.galleryText),
      published: values.published,
    };

    if (values.id) {
      await guard(() => itemsApi.update(values.id, payload));
    } else {
      const position = site.items.filter((item) => item.page_id === payload.page_id).length;
      await guard(() => itemsApi.create({ ...payload, position }));
    }
    setItemForm(null);
  }

  function moveItems(list, index, direction) {
    const next = moveInArray(list, index, direction);
    if (next) guard(() => persistPositions(next, itemsApi));
  }

  function removeItem(item) {
    if (!window.confirm(`Supprimer « ${item.title} » ?`)) return;
    guard(() => itemsApi.remove(item.id));
  }

  return (
    <>
      <h2>Projets &amp; activités</h2>
      <p className="admin-hint">
        Chaque élément appartient à une rubrique. Les projets utilisent les catégories ; les
        activités peuvent avoir une fenêtre « En savoir plus » et une galerie d’images.
      </p>

      <div className="admin-toolbar">
        <Button
          variant="solid"
          onClick={() => setItemForm(newItemValues(site, pageFilter === 'all' ? undefined : Number(pageFilter)))}
        >
          + Ajouter un élément
        </Button>
        <span className="admin-toolbar__spacer" />

        <label className="admin-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <span>Rubrique</span>
          <select className="admin-select" value={pageFilter} onChange={(event) => setPageFilter(event.target.value)}>
            <option value="all">Toutes</option>
            {site.pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.nav_label || page.title}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <span>Type</span>
          <select className="admin-select" value={kindFilter} onChange={(event) => setKindFilter(event.target.value)}>
            <option value="all">Tous</option>
            <option value="project">Projets</option>
            <option value="activity">Activités</option>
          </select>
        </label>
      </div>

      {actionError ? <Alert kind="error">{actionError}</Alert> : null}

      {groups.map((group) => (
        <div key={group.page.id}>
          <h3 className="admin-card__title" style={{ marginTop: 24 }}>
            {group.page.nav_label || group.page.title}
          </h3>

          {group.items.length === 0 ? (
            <div className="admin-empty">Aucun élément dans cette rubrique.</div>
          ) : (
            group.items.map((item, index) => (
              <ItemRow
                key={item.id}
                item={item}
                index={index}
                siblings={group.items}
                onMove={moveItems}
                onEdit={() => setItemForm(itemValues(item))}
                onRemove={() => removeItem(item)}
              />
            ))
          )}
        </div>
      ))}

      {orphanItems.length > 0 ? (
        <div>
          <h3 className="admin-card__title" style={{ marginTop: 24 }}>
            Sans rubrique
          </h3>
          {orphanItems.map((item, index) => (
            <ItemRow
              key={item.id}
              item={item}
              index={index}
              siblings={orphanItems}
              onMove={moveItems}
              onEdit={() => setItemForm(itemValues(item))}
              onRemove={() => removeItem(item)}
            />
          ))}
        </div>
      ) : null}

      {itemForm ? (
        <ItemForm
          key={itemForm.id ?? 'new'}
          initial={itemForm}
          site={site}
          onClose={() => setItemForm(null)}
          onSubmit={saveItem}
        />
      ) : null}
    </>
  );
}

function ItemRow({ item, index, siblings, onMove, onEdit, onRemove }) {
  return (
    <div className="admin-card">
      <div className="admin-card__head">
        <div className="admin-reorder">
          <button type="button" onClick={() => onMove(siblings, index, 'up')} disabled={index === 0} aria-label="Monter">
            ▲
          </button>
          <button
            type="button"
            onClick={() => onMove(siblings, index, 'down')}
            disabled={index === siblings.length - 1}
            aria-label="Descendre"
          >
            ▼
          </button>
        </div>

        <div>
          <h3 className="admin-card__title">{item.title}</h3>
          <p className="admin-card__meta">
            <span className={`admin-badge ${item.published ? 'admin-badge--on' : 'admin-badge--off'}`}>
              {item.published ? 'publié' : 'brouillon'}
            </span>
            <span className="admin-badge">{item.kind === 'activity' ? 'activité' : 'projet'}</span>
            {(item.categories || []).map((code) => (
              <span className="admin-badge" key={code}>
                {code}
              </span>
            ))}
          </p>
          {item.subtitle ? <p className="admin-card__meta">{item.subtitle}</p> : null}
        </div>

        <div className="admin-card__actions">
          <Button variant="ghost" onClick={onEdit}>
            Modifier
          </Button>
          <Button variant="danger" onClick={onRemove}>
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}

function ItemForm({ initial, site, onClose, onSubmit }) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (patch) => setValues((current) => ({ ...current, ...patch }));

  const currentPage = site.pages.find((page) => String(page.id) === String(values.page_id));
  const options = sectionOptions(currentPage);

  function toggleCategory(code) {
    setValues((current) => ({
      ...current,
      categories: current.categories.includes(code)
        ? current.categories.filter((value) => value !== code)
        : [...current.categories, code],
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!values.title.trim()) {
      setError('Le titre est requis.');
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
    <Modal open onClose={onClose} title={initial.id ? 'Modifier l’élément' : 'Nouvel élément'}>
      <form className="admin-form" onSubmit={handleSubmit}>
        {error ? <Alert kind="error">{error}</Alert> : null}

        <div className="admin-form__grid">
          <AdminField label="Type">
            <select className="admin-select" value={values.kind} onChange={(event) => set({ kind: event.target.value })}>
              <option value="project">Projet</option>
              <option value="activity">Activité</option>
            </select>
          </AdminField>

          <AdminField label="Rubrique (page)">
            <select
              className="admin-select"
              value={values.page_id}
              onChange={(event) => set({ page_id: event.target.value, section_id: '' })}
            >
              <option value="">— Aucune —</option>
              {site.pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.nav_label || page.title}
                </option>
              ))}
            </select>
          </AdminField>
        </div>

        <AdminField label="Section (facultatif)">
          <select
            className="admin-select"
            value={values.section_id}
            onChange={(event) => set({ section_id: event.target.value })}
          >
            <option value="">— Aucune —</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </AdminField>

        <AdminField label="Titre">
          <input className="admin-input" value={values.title} onChange={(event) => set({ title: event.target.value })} />
        </AdminField>

        <AdminField label="Sous-titre" hint="Petite ligne affichée sous le titre.">
          <input className="admin-input" value={values.subtitle} onChange={(event) => set({ subtitle: event.target.value })} />
        </AdminField>

        <AdminField label="Description" hint="Markdown accepté (**gras**, - listes, ## titres…).">
          <textarea
            className="admin-textarea"
            value={values.description}
            onChange={(event) => set({ description: event.target.value })}
          />
        </AdminField>

        <AdminField label="Technologies" hint="Séparées par des virgules (ex. Rust, Axum, PostgreSQL).">
          <input className="admin-input" value={values.techText} onChange={(event) => set({ techText: event.target.value })} />
        </AdminField>

        <div className="admin-field">
          <span>Catégories</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {site.categories.map((category) => (
              <label className="admin-checkbox" key={category.id}>
                <input
                  type="checkbox"
                  checked={values.categories.includes(category.code)}
                  onChange={() => toggleCategory(category.code)}
                />
                {category.label}
              </label>
            ))}
          </div>
        </div>

        <div className="admin-form__grid">
          <AdminField label="URL du dépôt GitHub" hint="Affiche l’icône GitHub.">
            <input className="admin-input" value={values.repo_url} onChange={(event) => set({ repo_url: event.target.value })} />
          </AdminField>

          <AdminField label="URL de la vidéo / démo" hint="Affiche l’icône YouTube.">
            <input className="admin-input" value={values.demo_url} onChange={(event) => set({ demo_url: event.target.value })} />
          </AdminField>
        </div>

        <AdminField
          label="Image de la carte"
          hint="Chemin interne (/images/mon-image.png) ou URL complète. Laisser vide pour un texte pleine largeur."
        >
          <input className="admin-input" value={values.image_url} onChange={(event) => set({ image_url: event.target.value })} />
        </AdminField>

        <AdminField label="Fenêtre « En savoir plus » — titre" hint="Vide = pas de bouton « En savoir plus ».">
          <input className="admin-input" value={values.modal_title} onChange={(event) => set({ modal_title: event.target.value })} />
        </AdminField>

        <AdminField label="Fenêtre « En savoir plus » — sous-titre">
          <input
            className="admin-input"
            value={values.modal_subtitle}
            onChange={(event) => set({ modal_subtitle: event.target.value })}
          />
        </AdminField>

        <AdminField
          label="Fenêtre « En savoir plus » — contenu"
          hint="Markdown : ## titre, **gras**, - liste, [lien](https://…)."
        >
          <textarea
            className="admin-textarea admin-textarea--tall"
            value={values.modal_content}
            onChange={(event) => set({ modal_content: event.target.value })}
          />
        </AdminField>

        <AdminField
          label="Galerie d’images"
          hint="Une image par ligne, au format : /images/photo.png | Légende (la légende est facultative)."
        >
          <textarea
            className="admin-textarea"
            value={values.galleryText}
            onChange={(event) => set({ galleryText: event.target.value })}
          />
        </AdminField>

        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(event) => set({ published: event.target.checked })}
          />
          Publié sur le site
        </label>

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
