// import React from 'react';
// import { UploadCloud, BarChart3, LogOut, X } from 'lucide-react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { logoutUser, getCurrentUser } from '../utils/auth.js';
// import kpmgLogo from '../assets/kpmg-logo.svg';

// const Sidebar = ({ isOpen, isMobile, onClose }) => {
//     const user = getCurrentUser();
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         logoutUser();
//         navigate('/', { replace: true });
//     };

//     const adminLinks = [
//         { name: 'Upload Transcript', path: '/admin-dashboard', icon: <UploadCloud size={18} /> },
//     ];

//     const employeeLinks = [
//         { name: 'Soft Controls', path: '/employee-dashboard', icon: <BarChart3 size={18} /> },
//     ];

//     let links = [];
//     if (user?.role === 'admin') links = adminLinks;
//     if (user?.role === 'employee') links = employeeLinks;

//     const showLabels = isOpen || isMobile;

//     const baseNavItem = (isActive) =>
//         `group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
//             isActive
//                 ? 'bg-[#f0f4ff] text-[#1746d6]'
//                 : 'text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827]'
//         } ${showLabels ? 'justify-start gap-3' : 'justify-center'}`;

//     const sidebarClasses = isMobile
//         ? `fixed inset-y-0 left-0 z-50 flex min-h-screen flex-col border-r border-[#e5e7eb] bg-white text-[#111827] shadow-lg transition-transform duration-300 w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
//         : `flex min-h-screen flex-col border-r border-[#e5e7eb] bg-white text-[#111827] transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`;

//     return (
//         <>
//             {isMobile && isOpen && (
//                 <button
//                     type="button"
//                     aria-label="Close sidebar overlay"
//                     className="fixed inset-0 z-40 bg-black/20"
//                     onClick={onClose}
//                 />
//             )}

//             <aside className={sidebarClasses}>
//                 {/* Logo */}
//                 <div className={`flex items-center border-b border-[#f3f4f6] px-4 py-5 ${showLabels ? 'justify-between' : 'justify-center'}`}>
//                     <div className={`flex items-center ${showLabels ? 'gap-3' : ''}`}>
//                         <img src={kpmgLogo} alt="KPMG" className="h-8 object-contain" />
//                         {showLabels && (
//                             <div>
//                                 <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9ca3af]">Risk Culture</p>
//                             </div>
//                         )}
//                     </div>
//                     {isMobile && (
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b7280] hover:bg-[#f3f4f6]"
//                             aria-label="Close sidebar"
//                         >
//                             <X size={16} />
//                         </button>
//                     )}
//                 </div>

//                 {/* Nav */}
//                 <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
//                     {links.map((link) => (
//                         <NavLink key={link.name} to={link.path} onClick={onClose} className={({ isActive }) => baseNavItem(isActive)}>
//                             <span>{link.icon}</span>
//                             {showLabels && <span>{link.name}</span>}
//                         </NavLink>
//                     ))}
//                 </nav>

//                 {/* Logout */}
//                 <div className="border-t border-[#f3f4f6] p-3">
//                     <button
//                         onClick={handleLogout}
//                         className={`group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-[#6b7280] transition hover:bg-[#fff1f2] hover:text-[#ef4444] ${showLabels ? 'justify-start gap-3' : 'justify-center'}`}
//                     >
//                         <LogOut size={18} />
//                         {showLabels && <span>Logout</span>}
//                     </button>
//                 </div>
//             </aside>
//         </>
//     );
// };

// export default Sidebar;
