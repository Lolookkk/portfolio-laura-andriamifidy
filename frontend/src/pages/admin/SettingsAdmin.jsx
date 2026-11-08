import { useState } from 'react';
import { useSite } from '../../hooks/useSite.js';
import { settingsApi } from '../../services/contentService.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import AdminField from '../../components/admin/AdminField.jsx';

const EMPTY = {
  brand_line1: '',
  brand_line2: '',
  status: '',
  banner_image: '',
  title_suffix: '',
  footer_text: '',
};

export default function SettingsAdmin() {
  const { site, loading, error, reload } = useSite();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState(null); // { kind, message }
  const [saving, setSaving] = useState(false);

  if (loading) return <Spinner label="Chargement…" />;
  if (error || !site) {
    return <Alert kind="error">Impossible de charger le contenu : {error || 'réponse vide'}.</Alert>;
  }

  const values = form || { ...EMPTY, ...site.settings };
  const set = (patch) => setForm({ ...values, ...patch });

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await settingsApi.save({
        brand_line1: values.brand_line1,
        brand_line2: values.brand_line2,
        status: values.status,
        banner_image: values.banner_image,
        title_suffix: values.title_suffix,
        footer_text: values.footer_text,
      });
      await reload();
      setForm(null);
      setStatus({ kind: 'success', message: 'Présentation enregistrée.' });
    } catch (err) {
      setStatus({ kind: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h2>Présentation</h2>
      <p className="admin-hint">
        Ces réglages pilotent l’en-tête de la barre latérale, la bannière d’accueil et le pied de page.
      </p>

      {status ? <Alert kind={status.kind}>{status.message}</Alert> : null}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__grid">
          <AdminField label="Nom — ligne 1" hint="Première ligne du titre de la barre latérale.">
            <input className="admin-input" value={values.brand_line1} onChange={(event) => set({ brand_line1: event.target.value })} />
          </AdminField>

          <AdminField label="Nom — ligne 2" hint="Seconde ligne du titre.">
            <input className="admin-input" value={values.brand_line2} onChange={(event) => set({ brand_line2: event.target.value })} />
          </AdminField>
        </div>

        <AdminField label="Statut" hint="Petite phrase sous le nom (ex. « Étudiante ingénieure »).">
          <input className="admin-input" value={values.status} onChange={(event) => set({ status: event.target.value })} />
        </AdminField>

        <AdminField
          label="Image de la bannière d’accueil"
          hint="Chemin interne (/images/fond2.png) ou URL complète."
        >
          <input className="admin-input" value={values.banner_image} onChange={(event) => set({ banner_image: event.target.value })} />
        </AdminField>

        <AdminField label="Suffixe des titres d’onglet" hint="Ajouté après le titre de chaque page.">
          <input className="admin-input" value={values.title_suffix} onChange={(event) => set({ title_suffix: event.target.value })} />
        </AdminField>

        <AdminField label="Texte du pied de page" hint="Utilisez {year} pour l’année courante.">
          <input className="admin-input" value={values.footer_text} onChange={(event) => set({ footer_text: event.target.value })} />
        </AdminField>

        <div className="admin-form__actions">
          <Button type="submit" variant="solid" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </>
  );
}
