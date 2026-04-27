import Navbar from '../components/Navbar';
import { getCurrentUser } from '../utils/auth';

const DashboardLayout = ({ children }) => {
    const user = getCurrentUser();
    // LeaderDashboard has its own full-page sidebar layout — skip the wrapper
    if (user?.role === 'leader') {
        return <>{children}</>;
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#f8f9fa' }}>
            <Navbar />
            <main style={{ flex: 1, overflowX: 'hidden', overflowY: 'auto', padding: '24px 28px 40px' }}>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
