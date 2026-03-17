import { User } from 'lucide-react';
import { getCurrentUser } from '../utils/auth.js';

const Navbar = () => {
    const user = getCurrentUser();

    return (
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
            <h1 className="text-xl font-bold text-kpmg-navy tracking-tight">
                {user?.role === 'admin' && 'IT Admin Dashboard'}
                {user?.role === 'leader' && 'Leader Dashboard'}
                {user?.role === 'employee' && 'Employee Dashboard'}
            </h1>

            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-kpmg-navy">{user?.email}</span>
                    <span className="text-xs text-kpmg-mediumGray capitalize font-medium">{user?.role}</span>
                </div>
                <div className="h-10 w-10 bg-gray-100 flex items-center justify-center text-kpmg-blue border border-gray-200">
                    <User size={20} />
                </div>
            </div>
        </header>
    );
};

export default Navbar;
