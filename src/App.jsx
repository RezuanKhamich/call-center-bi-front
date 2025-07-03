import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Publications from './pages/Publications.jsx';
import Reports from './pages/Reports.jsx';
import MOPage from './pages/MOPage.jsx';
import MinisterPage from './pages/MinisterPage.jsx';
import { ProtectedRoute } from './app/ProtectedRoute.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />

        <Route element={<ProtectedRoute allowedRoles={['moderator']} />}>
          <Route path="/moderator/dashboard" element={<Dashboard />} />
          <Route path="/moderator/publications" element={<Publications />} />
          <Route path="/moderator/reports" element={<Reports />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['mo']} />}>
          <Route path="/mo" element={<MOPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['minister']} />}>
          <Route path="/minister" element={<MinisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
