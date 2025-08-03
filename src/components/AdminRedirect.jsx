import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRedirect = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // If authenticated and admin, go to dashboard
  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Otherwise, go to admin login
  return <Navigate to="/admin/login" replace />;
};

export default AdminRedirect;
