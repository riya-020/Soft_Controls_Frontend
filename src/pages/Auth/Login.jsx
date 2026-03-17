import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { loginUser, getCurrentUser } from '../../utils/auth';

const Login = ({ role }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // If user is already logged in, prevent accessing login page and redirect
        const currentUser = getCurrentUser();
        if (currentUser) {
            navigate(`/${currentUser.role}-dashboard`, { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const result = await loginUser(email, password, role);

        if (result.success) {
            navigate(`/${role}-dashboard`, { replace: true });
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-kpmg-gray">
            <div className="w-full max-w-md bg-white border border-gray-200 border-t-4 border-t-kpmg-blue p-10 shadow-card">
                <div className="flex justify-center mb-8">
                    <div className="h-16 w-16 bg-kpmg-navy flex items-center justify-center border border-kpmg-blue">
                        <Building2 size={32} className="text-white" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-kpmg-navy capitalize mb-2">
                        {role} Login
                    </h2>
                    <p className="text-kpmg-mediumGray text-sm">
                        Access your {role} dashboard
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 text-sm mb-6 border-l-4 border-red-500">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-kpmg-darkGray mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 focus:bg-white focus:ring-0 focus:border-kpmg-blue focus:outline-none transition-colors"
                            placeholder={role === 'admin' ? "sanjana@kpmg.com" : "you@company.com"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-kpmg-darkGray mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 focus:bg-white focus:ring-0 focus:border-kpmg-blue focus:outline-none transition-colors"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-kpmg-blue text-white py-3 font-semibold hover:bg-kpmg-navy transition-colors mt-4 shadow-solid"
                    >
                        Sign In
                    </button>
                </form>

                {role !== 'admin' && (
                    <div className="mt-8 text-center text-sm border-t border-gray-200 pt-6">
                        <span className="text-kpmg-mediumGray">Don't have an account? </span>
                        <Link
                            to={`/${role}-signup`}
                            className="text-kpmg-blue font-semibold hover:text-kpmg-navy"
                        >
                            Requirements to Create Account
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
