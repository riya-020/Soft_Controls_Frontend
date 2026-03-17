import { UploadCloud, BarChart3, LogOut, Download } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser, getCurrentUser } from '../utils/auth.js';
import kpmgLogo from '../assets/kpmg-logo.svg';

const Sidebar = () => {
    const user = getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/', { replace: true });
    };

    const handleDownloadReport = () => {
        const link = document.createElement('a');
        link.href = '/Soft-Control-Deep-Dive-Report.pdf';        // path inside /public — change filename if needed
        link.download = 'Soft-Control-Deep-Dive-Report.pdf';
        link.click();
    };

    const adminLinks = [
        { name: 'Upload Transcript', path: '/admin-dashboard', icon: <UploadCloud size={20} /> },
    ];

    const leaderLinks = [
        { name: 'Overview', path: '/leader-dashboard', icon: <BarChart3 size={20} /> },
    ];

    const employeeLinks = [
        { name: 'Soft Controls', path: '/employee-dashboard', icon: <BarChart3 size={20} /> },
    ];

    let links = [];
    if (user?.role === 'admin') links = adminLinks;
    if (user?.role === 'leader') links = leaderLinks;
    if (user?.role === 'employee') links = employeeLinks;

    return (
        <div className="w-64 bg-kpmg-navy text-white min-h-screen flex flex-col border-r border-kpmg-blue shadow-lg z-10">
            {/* Logo */}
            <div className="p-4 flex items-center justify-center gap-3 border-b border-kpmg-blue bg-white h-16">
                <img src={kpmgLogo} alt="KPMG Logo" className="h-10 max-w-full object-contain" />
            </div>

            {/* Nav Links */}
            <nav className="flex-1 mt-6 flex flex-col">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-6 py-4 transition-colors border-l-4 ${isActive
                                ? 'bg-kpmg-blue border-white font-semibold'
                                : 'border-transparent hover:bg-gray-800 hover:border-gray-500 text-gray-300 hover:text-white'
                            }`
                        }
                    >
                        {link.icon}
                        <span>{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom actions */}
            <div className="border-t border-gray-800">

                {/* Download Report — leaders only */}
                {user?.role === 'leader' && (
                    <button
                        onClick={handleDownloadReport}
                        className="flex items-center gap-3 px-6 py-4 w-full transition-colors text-left text-gray-300 hover:text-white hover:bg-gray-800 border-b border-gray-800"
                    >
                        <Download size={20} />
                        <span className="font-medium">Download Report</span>
                    </button>
                )}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-6 py-5 w-full transition-colors text-left text-gray-400 hover:text-white hover:bg-gray-800"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;