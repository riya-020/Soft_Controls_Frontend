import React, { useState } from 'react';
import { UploadCloud, BarChart3, LogOut, Download, Sparkles, FileText } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser, getCurrentUser } from '../utils/auth.js';
import kpmgLogo from '../assets/kpmg-logo.svg';

const Sidebar = () => {
    const user = getCurrentUser();
    const navigate = useNavigate();
    const [showNotif, setShowNotif] = useState(true);

    const handleLogout = () => {
        logoutUser();
        navigate('/', { replace: true });
    };

    const adminLinks = [
        { name: 'Upload Transcript', path: '/admin-dashboard', icon: <UploadCloud size={18} /> },
    ];

    const leaderLinks = [
        { name: 'Overview', path: '/leader-dashboard', icon: <BarChart3 size={18} /> },
        { name: 'Recommendations', path: '/recommendations', icon: <Sparkles size={18} />, special: true },
    ];

    const employeeLinks = [
        { name: 'Soft Controls', path: '/employee-dashboard', icon: <BarChart3 size={18} /> },
    ];

    let links = [];
    if (user?.role === 'admin') links = adminLinks;
    if (user?.role === 'leader') links = leaderLinks;
    if (user?.role === 'employee') links = employeeLinks;

    return (
        <div className="w-72 bg-gradient-to-b from-[#0b1f3a] via-[#0b1f3a] to-black text-white min-h-screen flex flex-col border-r border-white/10 shadow-2xl">

            {/* Logo */}
            <div className="p-5 flex items-center justify-center border-b border-white/10 bg-white/95 backdrop-blur">
                <img src={kpmgLogo} alt="KPMG Logo" className="h-10 object-contain" />
            </div>

            {/* Nav */}
            <nav className="flex-1 mt-6 flex flex-col gap-2 px-3">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        onClick={() => {
                            if (link.name === 'Recommendations') setShowNotif(false);
                        }}
                        className={({ isActive }) =>
                            `group relative flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 overflow-hidden ${link.special
                                ? 'bg-gradient-to-r from-purple-600/20 to-blue-500/20 hover:from-purple-600 hover:to-blue-500 hover:shadow-xl'
                                : isActive
                                ? 'bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg'
                                : 'hover:bg-white/5'
                            }`
                        }
                    >
                        {/* Glow effect */}
                        <span className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 ${link.special
                            ? 'bg-gradient-to-r from-purple-500/30 via-blue-400/20 to-transparent blur-2xl'
                            : 'bg-gradient-to-r from-blue-500/10 to-transparent blur-xl'
                        }`}></span>

                        <div className="relative z-10 flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <span className={`${link.special ? 'text-purple-300' : 'text-blue-300'} group-hover:text-white transition`}>
                                    {link.icon}
                                </span>
                                <span className="font-medium tracking-wide text-sm">
                                    {link.name}
                                </span>
                            </div>

                            {/* Notification dot */}
                            {link.name === 'Recommendations' && showNotif && (
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                </span>
                            )}
                        </div>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom actions */}
            <div className="border-t border-white/10 p-3 space-y-2">

                {/* View Report — only for leader */}
                {user?.role === 'leader' && (
                    <button
                        onClick={() => navigate('/report')}
                        className="group w-full flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 transition-all duration-300"
                    >
                        <FileText size={18} className="text-blue-300 group-hover:text-white transition" />
                        <span className="font-medium text-sm group-hover:text-white transition">View Report</span>
                    </button>
                )}

                <button
                    onClick={handleLogout}
                    className="group w-full flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-red-500/20 transition-all duration-300"
                >
                    <LogOut size={18} className="text-gray-400 group-hover:text-white" />
                    <span className="font-medium text-sm text-gray-400 group-hover:text-white">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;