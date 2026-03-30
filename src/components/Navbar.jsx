import { Menu, PanelLeftClose, User } from 'lucide-react';
import { getCurrentUser } from '../utils/auth.js';

const Navbar = ({ isSidebarOpen, onToggleSidebar }) => {
    const user = getCurrentUser();

    return (
        <header className="px-4 pt-4 md:px-8 md:pt-6">
            <div className="flex min-h-20 items-center justify-between gap-4 rounded-[28px] border border-white/80 bg-[linear-gradient(145deg,_rgba(255,255,255,0.96),_rgba(244,246,255,0.94))] px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="flex min-w-0 items-center gap-4">
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d7def0] bg-[linear-gradient(135deg,_#0b1f3a,_#0051ba,_#6d28d9)] text-white shadow-[0_14px_30px_rgba(0,81,186,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(109,40,217,0.24)]"
                        aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        {isSidebarOpen ? <PanelLeftClose size={18} /> : <Menu size={18} />}
                    </button>

                    <div className="min-w-0">
                        <h1 className="truncate text-[22px] font-semibold tracking-[-0.03em] text-[#121826]">
                            {user?.role === 'admin' && 'IT Admin Dashboard'}
                            {user?.role === 'leader' && 'Leader Dashboard'}
                            {user?.role === 'employee' && 'Employee Dashboard'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white px-3 py-2 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                        <div className="hidden flex-col items-end md:flex">
                            <span className="text-sm font-semibold text-[#0b1f3a]">{user?.email}</span>
                            <span className="text-xs font-medium capitalize text-[#6d7691]">{user?.role}</span>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#2458ff] bg-[linear-gradient(135deg,_#eef4ff,_#f8f2ff)] text-[#0051ba]">
                            <User size={20} />
                        </div>
                    </div>
                </div>
            </div> 
        </header>
    );
};

export default Navbar;
