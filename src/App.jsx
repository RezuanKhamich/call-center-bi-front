import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Dashboard from './pages/Dashboard.jsx';
import History from './pages/History.jsx';
import Reports from './pages/Reports.jsx';
import MOPage from './pages/MOPage.jsx';
import AuthRoute from './app/AuthRoute.jsx';
import AppLayout from './pages/AppLayout.jsx';
import { roles } from './app/constants.jsx';
import biStore from './app/store/store.js';

function App() {
  const setUserInfo = biStore((state) => state.setUserInfo);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserInfo(parsed);
      } else {
        console.warn('⚠️ Нет user в localStorage');
      }
    } catch (err) {
      console.error('❌ Ошибка парсинга user:', err);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />

        {/* Главная — редирект по роли */}
        <Route path="/" element={<AuthRoute />}></Route>

        {/* Moderator */}
        <Route element={<AuthRoute allowedRoles={[roles.moderator.value]} />}>
          <Route
            path="/moderator/dashboard"
            element={
              <AppLayout>
                <Dashboard selectedRole={roles.moderator.value} />
              </AppLayout>
            }
          />
          <Route
            path="/moderator/reports"
            element={
              <AppLayout>
                <Reports selectedRole={roles.moderator.value} />
              </AppLayout>
            }
          />
          <Route
            path="/moderator/history"
            element={
              <AppLayout>
                <History selectedRole={roles.moderator.value} />
              </AppLayout>
            }
          />
        </Route>

        {/* MO */}
        <Route element={<AuthRoute allowedRoles={[roles.mo.value]} />}>
          <Route path="/mo" element={<MOPage />} />
        </Route>

        {/* Minister */}
        <Route element={<AuthRoute allowedRoles={[roles.minister.value]} />}>
          <Route path="/minister" element={<Dashboard selectedRole={roles.minister.value} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
