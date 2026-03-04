import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, Building2 } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';

const PersonaSelection = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // If user is already logged in, skip persona selection and redirect directly to their dashboard
        const user = getCurrentUser();
        if (user) {
            navigate(`/${user.role}-dashboard`, { replace: true });
        }
    }, [navigate]);

    const personas = [
        {
            id: 'admin',
            title: 'IT Admin',
            description: 'Manage transcripts and system technical controls.',
            icon: <ShieldAlert size={40} className="text-kpmg-blue mb-4" />,
            path: '/admin-login'
        },
        {
            id: 'leader',
            title: 'Leader',
            description: 'View overall organization culture scores and insights.',
            icon: <Users size={40} className="text-kpmg-blue mb-4" />,
            path: '/leader-login'
        },
        {
            id: 'employee',
            title: 'Employee',
            description: 'Access and review the required Soft Control Pillars.',
            icon: <Building2 size={40} className="text-kpmg-blue mb-4" />,
            path: '/employee-login'
        }
    ];

    return (
        <div className="min-h-screen bg-kpmg-gray flex flex-col items-center justify-center p-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Risk Culture & Soft Controls Assessment</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Please select your role to log into the assessment platform and access your relevant dashboard.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
                {personas.map((persona) => (
                    <button
                        key={persona.id}
                        onClick={() => navigate(persona.path)}
                        className="group bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center
                       hover:shadow-xl hover:border-kpmg-blue transition-all duration-300 transform hover:-translate-y-1"
                    >
                        {persona.icon}
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-kpmg-blue transition-colors">
                            {persona.title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            {persona.description}
                        </p>
                    </button>
                ))}
            </div>

            <div className="mt-16 text-sm text-gray-400">
                &copy; {new Date().getFullYear()} KPMG. All rights reserved.
            </div>
        </div>
    );
};

export default PersonaSelection;
