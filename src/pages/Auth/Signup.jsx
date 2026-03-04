import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { registerUser, getCurrentUser } from '../../utils/auth';

const Signup = ({ role }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // If user is already logged in, block signup access and redirect
        const currentUser = getCurrentUser();
        if (currentUser) {
            navigate(`/${currentUser.role}-dashboard`, { replace: true });
        }
    }, [navigate]);

    const handleSignup = (e) => {
        e.preventDefault();

        const result = registerUser({ email, password, role });

        if (!result.success) {
            alert(result.message);
            navigate(`/${role}-login`, { replace: true });
            return;
        }

        // Auto login after signup
        navigate(`/${role}-dashboard`, { replace: true });
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
                    {role} Sign Up
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Create an account to access the platform
                </p>

                <form onSubmit={handleSignup} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kpmg-blue focus:border-kpmg-blue outline-none transition-colors"
                            placeholder="you@company.com"
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
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-kpmg-blue text-white py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm mt-2"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-6 text-center text-sm border-t pt-6">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link
                        to={`/${role}-login`}
                        className="text-kpmg-blue font-semibold hover:underline"
                    >
                        Sign In here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
