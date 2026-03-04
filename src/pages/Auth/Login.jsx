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

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const result = loginUser(email, password, role);

        if (result.success) {
            navigate(`/${role}-dashboard`, { replace: true });
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-kpmg-gray flex flex-col justify-center items-center p-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 bg-kpmg-blue rounded-2xl flex items-center justify-center shadow-inner">
                        <Building2 size={32} className="text-white" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2 capitalize">
                    {role} Login
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Sign in to access your dashboard
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kpmg-blue focus:border-kpmg-blue outline-none transition-colors"
                            placeholder={role === 'admin' ? "sanjana@kpmg.com" : "you@company.com"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kpmg-blue focus:border-kpmg-blue outline-none transition-colors"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-kpmg-blue text-white py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm mt-2"
                    >
                        Sign In
                    </button>
                </form>

                {role !== 'admin' && (
                    <div className="mt-6 text-center text-sm border-t pt-6">
                        <span className="text-gray-600">Don't have an account? </span>
                        <Link
                            to={`/${role}-signup`}
                            className="text-kpmg-blue font-semibold hover:underline"
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
