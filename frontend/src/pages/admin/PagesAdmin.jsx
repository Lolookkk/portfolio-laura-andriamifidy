import { useState } from 'react';
import { useSite } from '../../hooks/useSite.js';
import { pagesApi, sectionsApi } from '../../services/contentService.js';
import { moveInArray, persistPositions } from '../../utils/reorder.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import AdminField from '../../components/admin/AdminField.jsx';

const TEMPLATES = [
  { value: 'home', label: 'Accueil (bannière + présentation)' },
  { value: 'projects', label: 'Projets (filtre + cartes)' },
  { value: 'items', label: 'Cartes (activités + galeries)' },
  { value: 'text', label: 'Texte (rubriques / sous-rubriques)' },
];

function countSections(page) {
  return page.sections.reduce(
    (total, section) => total + 1 + (section.children?.length || 0),
    0
  );
}

function newPageValues(pages) {
  return {
    title: '',
    slug: '',
    nav_label: '',
    template: 'text',
    nav_visible: true,
    position: pages.length,
  };
}

function pageValues(page) {
  return {
    id: page.id,
    title: page.title,
    slug: page.slug,
    nav_label: page.nav_label || '',
    template: page.template,
    nav_visible: page.nav_visible,
    position: page.position,
  };
}

export default function PagesAdmin() {
  const { site, loading, error, reload } = useSite();
  const [actionError, setActionError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [pageForm, setPageForm] = useState(null);
  const [sectionForm, setSectionForm] = useState(null);

  if (loading) return <Spinner label="Chargement…" />;
  if (error || !site) {
    return <Alert kind="error">Impossible de charger le contenu : {error || 'réponse vide'}.</Alert>;
  }

  const pages = site.pages;

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

  // ----- Pages -----
  async function savePage(values) {
    const payload = {
      title: values.title.trim(),
      template: values.template,
      nav_visible: values.nav_visible,
      position: Number(values.position) || 0,
      nav_label: values.nav_label.trim() || null,
    };
    if (values.slug.trim()) payload.slug = values.slug.trim();

    if (values.id) {
      await guard(() => pagesApi.update(values.id, payload));
    } else {
      await guard(() => pagesApi.create(payload));
    }
    setPageForm(null);
  }

  function movePage(index, direction) {
    const next = moveInArray(pages, index, direction);
    if (next) guard(() => persistPositions(next, pagesApi));
  }

  function removePage(page) {
    if (!window.confirm(`Supprimer la rubrique « ${page.title} » et tout son contenu ?`)) return;
    guard(() => pagesApi.remove(page.id));
  }

  // ----- Sections -----
  async function saveSection(values) {
    const payload = {
      page_id: values.page_id,
      title: values.title.trim(),
      subtitle: values.subtitle.trim() || null,
      content: values.content.trim() || null,
    };
    if (values.isNew) {
      payload.parent_id = values.parent_id || null;
      payload.position = values.siblingsCount;
    }

    if (values.id) {
      await guard(() => sectionsApi.update(values.id, payload));
    } else {
      await guard(() => sectionsApi.create(payload));
    }
    setSectionForm(null);
  }

  function moveSection(siblings, index, direction) {
    const next = moveInArray(siblings, index, direction);
    if (next) guard(() => persistPositions(next, sectionsApi));
  }

  function removeSection(section) {
    if (!window.confirm(`Supprimer « ${section.title || 'cette section'} » ?`)) return;
    guard(() => sectionsApi.remove(section.id));
  }

  return (
    <>
      <h2>Rubriques &amp; sections</h2>
      <p className="admin-hint">
        Les <strong>rubriques</strong> sont les entrées du menu (ex. Projets, Anglais). Chaque
        rubrique contient des <strong>sections</strong> et, en option, des <strong>sous-sections</strong>.
      </p>

      <div className="admin-toolbar">
        <Button variant="solid" onClick={() => setPageForm(newPageValues(pages))}>
          + Ajouter une rubrique
        </Button>
      </div>

      {actionError ? <Alert kind="error">{actionError}</Alert> : null}

      {pages.length === 0 ? (
        <div className="admin-empty">Aucune rubrique pour le moment.</div>
      ) : (
        pages.map((page, index) => (
          <div className="admin-card" key={page.id}>
            <div className="admin-card__head">
              <div className="admin-reorder">
                <button
                  type="button"
                  onClick={() => movePage(index, 'up')}
                  disabled={index === 0}
                  aria-label="Monter la rubrique"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => movePage(index, 'down')}
                  disabled={index === pages.length - 1}
                  aria-label="Descendre la rubrique"
                >
                  ▼
                </button>
              </div>

              <div>
                <h3 className="admin-card__title">{page.nav_label || page.title}</h3>
                <p className="admin-card__meta">
                  /{page.slug} · modèle : {page.template} · {countSections(page)} section(s)
                </p>
                <p className="admin-card__meta">
                  <span className={`admin-badge ${page.nav_visible ? 'admin-badge--on' : 'admin-badge--off'}`}>
                    {page.nav_visible ? 'dans le menu' : 'masquée'}
                  </span>
                </p>
              </div>

              <div className="admin-card__actions">
                <Button variant="ghost" onClick={() => setExpandedId(expandedId === page.id ? null : page.id)}>
                  {expandedId === page.id ? 'Replier' : 'Sections'}
                </Button>
                <Button variant="ghost" onClick={() => setPageForm(pageValues(page))}>
                  Modifier
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setSectionForm({
                      isNew: true,
                      page_id: page.id,
                      parent_id: null,
                      siblingsCount: page.sections.length,
                      title: '',
                      subtitle: '',
                      content: '',
                    })
                  }
                >
                  + Section
                </Button>
                <Button variant="danger" onClick={() => removePage(page)}>
                  Supprimer
                </Button>
              </div>
            </div>

            {expandedId === page.id ? (
              <div style={{ marginTop: 16 }}>
                {page.sections.length === 0 ? (
                  <div className="admin-empty">Aucune section dans cette rubrique.</div>
                ) : (
                  page.sections.map((section, sectionIndex) => (
                    <SectionCard
                      key={section.id}
                      section={section}
                      index={sectionIndex}
                      siblings={page.sections}
                      onMove={moveSection}
                      onEdit={(target) =>
                        setSectionForm({
                          isNew: false,
                          id: target.id,
                          page_id: target.page_id,
                          title: target.title || '',
                          subtitle: target.subtitle || '',
                          content: target.content || '',
                        })
                      }
                      onAddChild={(target) =>
                        setSectionForm({
                          isNew: true,
                          page_id: page.id,
                          parent_id: target.id,
                          siblingsCount: target.children?.length || 0,
                          title: '',
                          subtitle: '',
                          content: '',
                        })
                      }
                      onRemove={removeSection}
                    />
                  ))
                )}
              </div>
            ) : null}
          </div>
        ))
      )}

      {pageForm ? (
        <PageForm
          key={pageForm.id ?? 'new'}
          initial={pageForm}
          onClose={() => setPageForm(null)}
          onSubmit={savePage}
        />
      ) : null}

      {sectionForm ? (
        <SectionForm
          key={sectionForm.id ?? `new-${sectionForm.parent_id ?? 'root'}`}
          initial={sectionForm}
          onClose={() => setSectionForm(null)}
          onSubmit={saveSection}
        />
      ) : null}
    </>
  );
}

function SectionCard({ section, index, siblings, onMove, onEdit, onAddChild, onRemove }) {
  return (
    <div className="admin-card">
      <div className="admin-card__head">
        <div className="admin-reorder">
          <button
            type="button"
            onClick={() => onMove(siblings, index, 'up')}
            disabled={index === 0}
            aria-label="Monter"
          >
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
          <h3 className="admin-card__title">{section.title || '(sans titre)'}</h3>
          {section.subtitle ? <p className="admin-card__meta">{section.subtitle}</p> : null}
        </div>

        <div className="admin-card__actions">
          <Button variant="ghost" onClick={() => onEdit(section)}>
            Modifier
          </Button>
          {onAddChild ? (
            <Button variant="ghost" onClick={() => onAddChild(section)}>
              + Sous-section
            </Button>
          ) : null}
          <Button variant="danger" onClick={() => onRemove(section)}>
            Supprimer
          </Button>
        </div>
      </div>

      {section.children && section.children.length > 0 ? (
        <div className="admin-tree" style={{ marginTop: 12 }}>
          {section.children.map((child, childIndex) => (
            <SectionCard
              key={child.id}
              section={child}
              index={childIndex}
              siblings={section.children}
              onMove={onMove}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PageForm({ initial, onClose, onSubmit }) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (patch) => setValues((current) => ({ ...current, ...patch }));

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
    <Modal open onClose={onClose} title={initial.id ? 'Modifier la rubrique' : 'Nouvelle rubrique'}>
      <form className="admin-form" onSubmit={handleSubmit}>
        {error ? <Alert kind="error">{error}</Alert> : null}

        <div className="admin-form__grid">
          <AdminField label="Titre" hint="Titre affiché en haut de la page.">
            <input
              className="admin-input"
              value={values.title}
              onChange={(event) => set({ title: event.target.value })}
            />
          </AdminField>

          <AdminField label="Libellé du menu" hint="Vide = le titre est utilisé.">
            <input
              className="admin-input"
              value={values.nav_label}
              onChange={(event) => set({ nav_label: event.target.value })}
            />
          </AdminField>
        </div>

        <div className="admin-form__grid">
          <AdminField
            label="Adresse (slug)"
            hint={initial.id ? 'Modifiable, mais casse les liens existants.' : 'Vide = généré depuis le titre.'}
          >
            <input
              className="admin-input"
              value={values.slug}
              onChange={(event) => set({ slug: event.target.value })}
            />
          </AdminField>

          <AdminField label="Modèle de page" hint="Détermine la présentation.">
            <select
              className="admin-select"
              value={values.template}
              onChange={(event) => set({ template: event.target.value })}
            >
              {TEMPLATES.map((template) => (
                <option key={template.value} value={template.value}>
                  {template.label}
                </option>
              ))}
            </select>
          </AdminField>
        </div>

        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={values.nav_visible}
            onChange={(event) => set({ nav_visible: event.target.checked })}
          />
          Afficher dans le menu
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

function SectionForm({ initial, onClose, onSubmit }) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (patch) => setValues((current) => ({ ...current, ...patch }));

  const heading = initial.isNew
    ? initial.parent_id
      ? 'Nouvelle sous-section'
      : 'Nouvelle section'
    : 'Modifier la section';

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
    <Modal open onClose={onClose} title={heading}>
      <form className="admin-form" onSubmit={handleSubmit}>
        {error ? <Alert kind="error">{error}</Alert> : null}

        <AdminField label="Titre" hint="Laisser vide pour une simple section de texte.">
          <input
            className="admin-input"
            value={values.title}
            onChange={(event) => set({ title: event.target.value })}
          />
        </AdminField>

        <AdminField label="Sous-titre" hint="Facultatif.">
          <input
            className="admin-input"
            value={values.subtitle}
            onChange={(event) => set({ subtitle: event.target.value })}
          />
        </AdminField>

        <AdminField
          label="Contenu"
          hint="Markdown : **gras**, *italique*, ## titre, - liste, [lien](https://…). Le HTML reste accepté."
        >
          <textarea
            className="admin-textarea admin-textarea--tall"
            value={values.content}
            onChange={(event) => set({ content: event.target.value })}
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
