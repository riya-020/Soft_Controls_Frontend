import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';

const data = [
    { name: 'Transparency', score: 85 },
    { name: 'Role Modelling', score: 72 },
    { name: 'Commitment', score: 88 },
    { name: 'Achievability', score: 65 },
    { name: 'Enforcement', score: 90 },
    { name: 'Accountability', score: 78 },
    { name: 'Discussibility', score: 82 },
    { name: 'Clarity', score: 84 }
];

const overallScoreData = [
    { name: 'Score', value: 82, fill: '#00338D' },
    { name: 'Remaining', value: 18, fill: '#E2E8F0' }
];

const LeaderDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Overall Score */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center lg:col-span-1 min-h-[300px]">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 w-full text-left">Overall Organization Score</h2>
                    <p className="text-sm text-gray-500 mb-4 w-full text-left">Average soft controls rating across all departments</p>

                    <div className="relative w-full h-[200px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                cx="50%" cy="50%"
                                innerRadius="70%" outerRadius="100%"
                                barSize={20} data={overallScoreData}
                                startAngle={90} endAngle={-270}
                            >
                                <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-kpmg-blue">82%</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Healthy</span>
                        </div>
                    </div>
                </div>

                {/* Breakdown Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2 min-h-[300px]">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Soft Control Pillars Breakdown</h2>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={0} tickMargin={10} />
                                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="score" fill="#00338D" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LeaderDashboard;
