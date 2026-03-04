import SoftControlCard from '../../components/SoftControlCard';
import { ExternalLink, ClipboardList } from 'lucide-react';

const EmployeeDashboard = () => {
    // Removed "Integrity" to only show 8 required pillars
    const pillars = [
        { title: 'Transparency', description: 'Degree to which management is open and clear about decisions and actions.' },
        { title: 'Role Modelling', description: 'Extent to which leadership exemplifies the organization\'s core values and ethics.' },
        { title: 'Commitment', description: 'Dedication from employees towards organizational goals and standards.' },
        { title: 'Achievability', description: 'Ensuring that assigned tasks and objectives are realistic and attainable.' },
        { title: 'Enforcement', description: 'Consistent application of rules and consequences across the organization.' },
        { title: 'Accountability', description: 'Taking ownership of actions and resulting outcomes.' },
        { title: 'Discussibility', description: 'Comfort level of employees in raising concerns and discussing issues openly.' },
        { title: 'Clarity', description: 'Clear understanding of expectations, roles, and responsibilities.' }
    ];

    return (
        <div className="space-y-8">
            {/* Section 1: Intro & Survey */}
            <div className="bg-white rounded-xl shadow-sm border border-kpmg-blue p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-kpmg-blue"></div>
                <div className="max-w-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Help Us Shape Our Culture</h2>
                    <p className="text-gray-600">
                        Your feedback directly impacts our cultural initiatives. Please complete the Risk Culture Assessment
                        to help us measure and improve our Soft Control Pillars.
                    </p>
                </div>
                <a
                    href="https://forms.office.com/r/SNX6Wt7dRy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-kpmg-blue hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition-colors shadow-sm"
                >
                    <ClipboardList size={20} />
                    Start Assessment Survey
                    <ExternalLink size={16} className="ml-1" />
                </a>
            </div>

            {/* Section 2: Cards */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">The 8 Soft Control Pillars</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {pillars.map((pillar, idx) => (
                        <SoftControlCard
                            key={pillar.title}
                            title={pillar.title}
                            description={pillar.description}
                            number={idx + 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
