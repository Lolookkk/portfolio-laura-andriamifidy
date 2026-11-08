import { apiFetch, setToken } from './api.js';

export async function login(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  setToken(data.token);
  return data.user;
}

export async function me() {
  const data = await apiFetch('/auth/me');
  return data.user;
}

export function logout() {
  setToken(null);
}
