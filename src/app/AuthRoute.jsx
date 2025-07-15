import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

export default function AuthRoute({ allowedRoles }) {
  const token = getToken();
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace />;

  try {
    const { role } = jwtDecode(token);

    if (location.pathname === '/') {
      switch (role) {
        case 'moderator':
          return <Navigate to="/moderator/dashboard" replace />;
        case 'mo':
          return <Navigate to="/mo" replace />;
        case 'minister':
          return <Navigate to="/minister" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to="/404" replace />;
    }

    return <Outlet />;
  } catch {
    return <Navigate to="/login" replace />;
  }
}
