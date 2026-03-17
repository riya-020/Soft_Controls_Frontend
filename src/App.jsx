import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import PersonaSelection from './pages/PersonaSelection';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Dashboards
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/Dashboards/AdminDashboard';
import LeaderDashboard from './pages/Dashboards/LeaderDashboard';
import EmployeeDashboard from './pages/Dashboards/EmployeeDashboard';

import ReportPage from './pages/Report/ReportPage';
// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PersonaSelection />} />

        {/* Auth Routes */}
        <Route path="/admin-login" element={<Login role="admin" />} />

        <Route path="/leader-login" element={<Login role="leader" />} />
        <Route path="/leader-signup" element={<Signup role="leader" />} />

        <Route path="/employee-login" element={<Login role="employee" />} />
        <Route path="/employee-signup" element={<Signup role="employee" />} />

        {/* Dashboard Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leader-dashboard"
          element={
            <ProtectedRoute allowedRole="leader">
              <DashboardLayout>
                <LeaderDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRole="employee">
              <DashboardLayout>
                <EmployeeDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
