import { Building2, UploadCloud, BarChart3, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser, getCurrentUser } from '../utils/auth.js';

const Sidebar = () => {
    const user = getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/', { replace: true });
    };

    const adminLinks = [
        { name: 'Upload Transcript', path: '/admin-dashboard', icon: <UploadCloud size={20} /> },
    ];

    const leaderLinks = [
        { name: 'Overview', path: '/leader-dashboard', icon: <BarChart3 size={20} /> },
    ];

    const employeeLinks = [
        { name: 'Soft Controls', path: '/employee-dashboard', icon: <Building2 size={20} /> },
    ];

    let links = [];
    if (user?.role === 'admin') links = adminLinks;
    if (user?.role === 'leader') links = leaderLinks;
    if (user?.role === 'employee') links = employeeLinks;

    return (
        <div className="w-64 bg-kpmg-blue text-white min-h-screen flex flex-col shadow-lg">
            <div className="p-6 flex items-center gap-3 border-b border-blue-800">
                <Building2 size={28} className="text-white" />
                <span className="text-xl font-bold tracking-tight">Risk Culture</span>
            </div>

            <nav className="flex-1 mt-6 px-4 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-800 font-medium' : 'hover:bg-blue-800/50'
                            }`
                        }
                    >
                        {link.icon}
                        <span>{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-blue-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-blue-800/50 transition-colors text-left"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
