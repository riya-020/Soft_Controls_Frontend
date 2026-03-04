import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth.js';

const ProtectedRoute = ({ children, allowedRole }) => {
    const user = getCurrentUser();

    if (!user) {
        if (allowedRole === 'admin') return <Navigate to="/admin-login" replace />;
        if (allowedRole === 'leader') return <Navigate to="/leader-login" replace />;
        if (allowedRole === 'employee') return <Navigate to="/employee-login" replace />;
        return <Navigate to="/" replace />;
    }

    if (user.role !== allowedRole) {
        return <Navigate to={`/${user.role}-dashboard`} replace />;
    }

    return children;
};

export default ProtectedRoute;
