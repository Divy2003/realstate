import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // If not authenticated, redirect to admin login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If authenticated but not admin, redirect to admin login with error
  if (user?.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location, error: 'Admin access required' }} replace />;
  }

  // If authenticated and admin, render the protected component
  return children;
};

export default AdminRoute;
