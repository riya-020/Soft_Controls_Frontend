import { Menu, PanelLeftClose, User } from 'lucide-react';
import { getCurrentUser } from '../utils/auth.js';

const Navbar = ({ isSidebarOpen, onToggleSidebar }) => {
    const user = getCurrentUser();

    return (
        <header className="border-b border-[#b7c5da] bg-[linear-gradient(135deg,_rgba(255,255,255,0.94),_rgba(230,237,246,0.92))] backdrop-blur-xl shadow-[0_14px_38px_rgba(20,40,90,0.08)]">
            <div className="flex h-20 items-center justify-between gap-4 px-4 md:px-8">
                <div className="flex min-w-0 items-center gap-4">
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#b7c5da] bg-white/80 text-[#0b1f3a] transition hover:-translate-y-0.5 hover:bg-white"
                        aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        {isSidebarOpen ? <PanelLeftClose size={18} /> : <Menu size={18} />}
                    </button>

                    <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#5a6f8f]">Risk Culture Assessment </p>
                        <h1 className="truncate text-xl font-bold tracking-tight text-[#0b1f3a]">
                            {user?.role === 'admin' && 'IT Admin Dashboard'}
                            {user?.role === 'leader' && 'Leader Dashboard'}
                            {user?.role === 'employee' && 'Employee Dashboard'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                        <div className="hidden flex-col items-end md:flex">
                            <span className="text-sm font-semibold text-[#0b1f3a]">{user?.email}</span>
                            <span className="text-xs font-medium capitalize text-[#5a6f8f]">{user?.role}</span>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d6dfec] bg-[#eef3f9] text-[#0051ba]">
                            <User size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;