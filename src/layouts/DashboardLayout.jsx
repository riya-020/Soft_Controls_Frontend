import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = ({ children }) => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < 1024;
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window === 'undefined') return true;
        return window.innerWidth >= 1024;
    });

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            setIsSidebarOpen((prev) => {
                if (mobile) return false;
                return prev === false ? false : true;
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(232,241,250,0.95),_rgba(242,246,251,0.92)_38%,_#edf2f7_100%)]">
            <Sidebar
                isOpen={isSidebarOpen}
                isMobile={isMobile}
                onClose={() => isMobile && setIsSidebarOpen(false)}
            />

            <div className="flex h-screen flex-1 flex-col">
                <Navbar
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent px-4 py-5 md:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
