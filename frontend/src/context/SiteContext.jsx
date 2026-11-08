import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as contentService from '../services/contentService.js';
import { useAuth } from './AuthContext.jsx';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const { user } = useAuth();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Connecté : on charge aussi les brouillons (admin).
      const data = user ? await contentService.getAdminSite() : await contentService.getSite();
      setSite(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <SiteContext.Provider value={{ site, loading, error, reload }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error('useSite doit être utilisé à l\'intérieur d\'un SiteProvider.');
  }
  return ctx;
}
