import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/layout/SiteLayout.jsx';
import PublicPage from './pages/PublicPage.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminRoute from './pages/admin/AdminRoute.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import PagesAdmin from './pages/admin/PagesAdmin.jsx';
import ItemsAdmin from './pages/admin/ItemsAdmin.jsx';
import CategoriesAdmin from './pages/admin/CategoriesAdmin.jsx';
import SettingsAdmin from './pages/admin/SettingsAdmin.jsx';

export default function App() {
  return (
    <Routes>
      {/* Site public */}
      <Route element={<SiteLayout />}>
        <Route index element={<PublicPage />} />
        <Route path=":slug" element={<PublicPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Administration cachée (accessible uniquement par URL) */}
      <Route path="studio/login" element={<AdminLogin />} />
      <Route path="studio" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pages" element={<PagesAdmin />} />
          <Route path="items" element={<ItemsAdmin />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="*" element={<Navigate to="/studio" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
