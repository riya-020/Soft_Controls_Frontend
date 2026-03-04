import { User } from 'lucide-react';
import { getCurrentUser } from '../utils/auth.js';

const Navbar = () => {
    const user = getCurrentUser();

    return (
        <header className="bg-white h-16 border-b flex items-center justify-between px-8 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-800">
                {user?.role === 'admin' && 'IT Admin Dashboard'}
                {user?.role === 'leader' && 'Leader Dashboard'}
                {user?.role === 'employee' && 'Employee Dashboard'}
            </h1>

            <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900">{user?.email}</span>
                    <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-kpmg-lightBlue flex items-center justify-center text-kpmg-blue">
                    <User size={20} />
                </div>
            </div>
        </header>
    );
};

export default Navbar;
