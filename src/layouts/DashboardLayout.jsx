import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-kpmg-gray overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-kpmg-gray p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;