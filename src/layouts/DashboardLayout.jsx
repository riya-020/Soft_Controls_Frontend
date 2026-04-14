import Navbar from '../components/Navbar';

const DashboardLayout = ({ children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#f8f9fa' }}>
        <Navbar />
        <main style={{ flex: 1, overflowX: 'hidden', overflowY: 'auto', padding: '24px 28px 40px' }}>
            {children}
        </main>
    </div>
);

export default DashboardLayout;
