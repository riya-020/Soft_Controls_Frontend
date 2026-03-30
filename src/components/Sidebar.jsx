import React, { useState } from 'react';
import { UploadCloud, BarChart3, LogOut, Sparkles, X, FileText } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser, getCurrentUser } from '../utils/auth.js';
import kpmgLogo from '../assets/kpmg-logo.svg';

const Sidebar = ({ isOpen, isMobile, onClose }) => {
    const user = getCurrentUser();
    const navigate = useNavigate();
    const [showNotif, setShowNotif] = useState(true);

    const handleLogout = () => {
        logoutUser();
        navigate('/', { replace: true });
    };

    const handleRecommendationsClick = (e) => {
        e.preventDefault();
        setShowNotif(false);
        const triggerScroll = () => {
            window.dispatchEvent(new CustomEvent('leader-dashboard-scroll-recommendations'));
        };
        if (window.location.pathname === '/leader-dashboard') {
            triggerScroll();
        } else {
            navigate('/leader-dashboard');
            setTimeout(() => {
                triggerScroll();
            }, 220);
        }
        onClose?.();
    };

    const adminLinks = [
        { name: 'Upload Transcript', path: '/admin-dashboard', icon: <UploadCloud size={18} /> },
    ];

    const employeeLinks = [
        { name: 'Soft Controls', path: '/employee-dashboard', icon: <BarChart3 size={18} /> },
    ];

    let links = [];
    if (user?.role === 'admin') links = adminLinks;
    if (user?.role === 'employee') links = employeeLinks;

    const showLabels = isOpen || isMobile;
    const baseNavItem = (isActive) =>
        `group relative flex items-center overflow-hidden rounded-2xl px-5 py-3 transition-all duration-300 ${
            isActive
                ? 'bg-[linear-gradient(135deg,_#ffffff,_#f1f3ff)] text-[#121826] shadow-[0_14px_30px_rgba(255,255,255,0.14)]'
                : 'bg-white/6 hover:bg-white/12 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
        } ${showLabels ? 'justify-start gap-3' : 'justify-center'}`;
    const leaderOverviewNavItem = (isActive) =>
        `group relative flex items-center overflow-hidden rounded-2xl border px-5 py-3 transition-all duration-300 ${
            isActive
                ? 'border-white/20 bg-[linear-gradient(135deg,_rgba(85,169,255,0.36),_rgba(109,40,217,0.42))] text-white shadow-[0_18px_34px_rgba(55,120,255,0.28)]'
                : 'border-white/10 bg-[linear-gradient(135deg,_rgba(255,255,255,0.12),_rgba(255,255,255,0.04))] text-white hover:border-white/20 hover:bg-[linear-gradient(135deg,_rgba(85,169,255,0.36),_rgba(109,40,217,0.42))] hover:shadow-[0_18px_34px_rgba(55,120,255,0.28)]'
        } ${showLabels ? 'justify-start gap-3' : 'justify-center'}`;

    const sidebarClasses = isMobile
        ? `fixed inset-y-0 left-0 z-50 flex min-h-screen w-72 flex-col border-r border-white/10 bg-[linear-gradient(180deg,_#07152f_0%,_#0b2c67_48%,_#4c1d95_100%)] text-white shadow-[0_30px_60px_rgba(0,0,0,0.35)] transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
        : `flex min-h-screen flex-col border-r border-white/10 bg-[linear-gradient(180deg,_#07152f_0%,_#0b2c67_48%,_#4c1d95_100%)] text-white shadow-[0_30px_60px_rgba(0,0,0,0.18)] transition-all duration-300 ${isOpen ? 'w-72' : 'w-24'}`;

    return (
        <>
            {isMobile && isOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar overlay"
                    className="fixed inset-0 z-40 bg-[#020817]/50 backdrop-blur-[2px]"
                    onClick={onClose}
                />
            )}

            <aside className={sidebarClasses}>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(61,144,255,0.22),_transparent_68%)]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_bottom,_rgba(167,139,250,0.22),_transparent_68%)]" />

                <div className={`relative flex items-center border-b border-white/10 bg-white px-4 py-5 ${showLabels ? 'justify-between' : 'justify-center'}`}>
                    <div className={`flex items-center ${showLabels ? 'gap-3' : ''}`}>
                        <div className="rounded-[22px] bg-white p-2 shadow-[0_12px_28px_rgba(11,31,58,0.12)]">
                            <img src={kpmgLogo} alt="KPMG Logo" className="h-9 object-contain" />
                        </div>
                    </div>

                    {isMobile && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0b1f3a] shadow-sm"
                            aria-label="Close sidebar"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                <nav className="mt-6 flex flex-1 flex-col gap-2 px-3">
                    {user?.role === 'leader' && (
                        <NavLink to="/leader-dashboard" end onClick={onClose} className={({ isActive }) => leaderOverviewNavItem(isActive)}>
                            <span className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.32),_transparent_48%)]" />
                            <BarChart3 size={18} className="relative z-10 text-cyan-200 transition group-hover:text-white" />
                            {showLabels && <span className="relative z-10 text-sm font-medium tracking-wide">Overview</span>}
                        </NavLink>
                    )}

                    {user?.role === 'leader' && (
                        <button
                            onClick={handleRecommendationsClick}
                            className={`group relative flex w-full items-center overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,_rgba(255,255,255,0.12),_rgba(255,255,255,0.04))] px-5 py-3 text-left transition-all duration-300 hover:border-white/20 hover:bg-[linear-gradient(135deg,_rgba(85,169,255,0.36),_rgba(109,40,217,0.42))] hover:shadow-[0_18px_34px_rgba(55,120,255,0.28)] ${showLabels ? 'justify-between gap-3' : 'justify-center'}`}
                        >
                            <span className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.32),_transparent_48%)]" />
                            <div className={`relative z-10 flex items-center ${showLabels ? 'gap-3' : ''}`}>
                                <Sparkles size={18} className="text-cyan-200 transition group-hover:text-white" />
                                {showLabels && <span className="text-sm font-medium tracking-wide">Recommendations</span>}
                            </div>
                            {showLabels && showNotif && (
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                                </span>
                            )}
                        </button>
                    )}

                    {links.map((link) => (
                        <NavLink key={link.name} to={link.path} onClick={onClose} className={({ isActive }) => baseNavItem(isActive)}>
                            <span className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.15),transparent)] opacity-0 transition duration-500 group-hover:translate-x-[120%] group-hover:opacity-100" />
                            <span className="relative z-10 text-blue-200 transition group-hover:text-white">{link.icon}</span>
                            {showLabels && <span className="relative z-10 text-sm font-medium tracking-wide">{link.name}</span>}
                        </NavLink>
                    ))}

                    {user?.role === 'leader' && (
                        <button
                            type="button"
                            onClick={() => {
                                navigate('/report');
                                onClose?.();
                            }}
                            className={`group report-cta relative flex w-full items-center overflow-hidden rounded-2xl border border-cyan-300/20 bg-[linear-gradient(135deg,rgba(3,51,141,0.88),rgba(0,92,185,0.88),rgba(34,211,238,0.76))] px-5 py-3 text-left text-white shadow-[0_18px_36px_rgba(0,84,180,0.24)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(0,84,180,0.3)] ${showLabels ? 'justify-between gap-3' : 'justify-center'}`}
                        >
                            <span className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.28),_transparent_42%)]" />
                            <span className="absolute inset-y-[-140%] left-[-45%] w-[42%] rotate-[20deg] bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.85),transparent)] transition-transform duration-700 group-hover:translate-x-[380%]" />
                            <div className={`relative z-10 flex items-center ${showLabels ? 'gap-3' : ''}`}>
                                <FileText size={18} className="text-cyan-50 transition group-hover:text-white" />
                                {showLabels && <span className="text-sm font-semibold tracking-wide">View Report</span>}
                            </div>
                        </button>
                    )}
                </nav>

                <div className="border-t border-white/10 p-3">
                    <button
                        onClick={handleLogout}
                        className={`group flex w-full items-center rounded-2xl px-5 py-3 transition-all duration-300 hover:bg-red-500/18 ${showLabels ? 'justify-start gap-3' : 'justify-center'}`}
                    >
                        <LogOut size={18} className="text-gray-400 group-hover:text-white" />
                        {showLabels && <span className="text-sm font-medium text-gray-400 group-hover:text-white">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
