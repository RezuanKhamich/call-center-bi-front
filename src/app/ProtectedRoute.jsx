import { Navigate, Outlet } from 'react-router-dom';

const getUserRole = () => {
  return localStorage.getItem('role') || 'guest';
};

export const ProtectedRoute = ({ allowedRoles }) => {
  const role = getUserRole();
  console.log('role', role);
  if (!role || role === 'guest') return <Navigate to="/login" />;

  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/404" />;
};
