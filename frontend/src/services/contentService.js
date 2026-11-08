import { apiFetch } from './api.js';

// ---------- Lecture ----------
export const getSite = () => apiFetch('/site');
export const getAdminSite = () => apiFetch('/admin/site');

// ---------- CRUD générique ----------
function crud(resource) {
  const base = `/admin/${resource}`;
  return {
    create: (data) => apiFetch(base, { method: 'POST', body: data }),
    update: (id, data) => apiFetch(`${base}/${id}`, { method: 'PATCH', body: data }),
    remove: (id) => apiFetch(`${base}/${id}`, { method: 'DELETE' }),
  };
}

export const pagesApi = crud('pages');
export const sectionsApi = crud('sections');
export const itemsApi = crud('items');
export const categoriesApi = crud('categories');

export const settingsApi = {
  get: () => apiFetch('/admin/settings'),
  save: (data) => apiFetch('/admin/settings', { method: 'PUT', body: data }),
};
