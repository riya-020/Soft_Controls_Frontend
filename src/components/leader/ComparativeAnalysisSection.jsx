import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, Legend,
} from 'recharts';

const ComparativeAnalysisSection = ({ employeeLeaderData, toneAtTopIndex, leaderChartLoading }) => {
    // Compute gap insights
    const gapInsights = [...(employeeLeaderData || [])]
        .map(d => ({ ...d, gap: Math.abs((d.leader || 0) - (d.employee || 0)) }))
        .sort((a, b) => b.gap - a.gap)
        .slice(0, 3);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Header */}
            <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', margin: '0 0 4px' }}>Comparative Analysis</h2>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
                    Side-by-side comparison of leadership perception vs employee experience across all soft controls.
                </p>
            </div>

            {/* Tone at Top */}
            {toneAtTopIndex && (
                <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 12, padding: '14px 18px', display: 'inline-flex', alignItems: 'center', gap: 12, alignSelf: 'flex-start' }}>
                    <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>Tone at Top Index</p>
                        <p style={{ fontSize: 24, fontWeight: 800, color: '#5B21B6', margin: 0, lineHeight: 1 }}>{toneAtTopIndex}</p>
                    </div>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0, maxWidth: 240, lineHeight: 1.5 }}>
                        Composite score reflecting how leadership tone translates into observable employee behaviour.
                    </p>
                </div>
            )}

            {/* Bar Chart */}
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Alignment Analysis</p>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Leadership vs Employee Scores</h3>
                </div>
                {leaderChartLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                        <p style={{ color: '#9CA3AF', fontSize: 13 }}>Loading chart data…</p>
                    </div>
                ) : (
                    <div style={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={employeeLeaderData} margin={{ top: 8, right: 8, left: -20, bottom: 70 }} barGap={4} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="control" tick={{ fontSize: 10, fill: '#6B7280' }} angle={-30} textAnchor="end" tickMargin={6} height={80} interval={0} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                <RechartsTooltip contentStyle={{ borderRadius: 10, border: '1px solid #E8EAF0', fontSize: 12 }} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Bar dataKey="employee" name="Employee" fill="#C4B5FD" barSize={20} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="leader" name="Leader" fill="#7C3AED" barSize={20} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Gap Insights */}
            {gapInsights.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', margin: '0 0 14px' }}>Top Gap Insights</h3>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px', lineHeight: 1.6 }}>
                        The following soft controls show the largest divergence between leadership and employee scores, indicating areas where leadership intent may not be translating into employee experience.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {gapInsights.map((item, i) => {
                            const leaderHigher = (item.leader || 0) > (item.employee || 0);
                            const gapColor = item.gap >= 10 ? '#ef4444' : item.gap >= 5 ? '#f59e0b' : '#22c55e';
                            return (
                                <div key={i} style={{ background: '#F7FAFC', border: '1px solid #E5E7EB', borderLeft: `4px solid ${gapColor}`, borderRadius: '0 10px 10px 0', padding: '14px 16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: '#1F2937', margin: 0 }}>{item.control}</p>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: gapColor, background: `${gapColor}18`, padding: '2px 10px', borderRadius: 20, flexShrink: 0, marginLeft: 8 }}>
                                            Gap: {item.gap}pts
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 16 }}>
                                        <span style={{ fontSize: 12, color: '#7C3AED', fontWeight: 600 }}>Leader: {item.leader}</span>
                                        <span style={{ fontSize: 12, color: '#6366F1', fontWeight: 600 }}>Employee: {item.employee}</span>
                                    </div>
                                    <p style={{ fontSize: 12, color: '#6B7280', margin: '6px 0 0', lineHeight: 1.5 }}>
                                        {leaderHigher
                                            ? `Leaders rate this control ${item.gap} points higher than employees experience it — a potential blind spot.`
                                            : `Employees rate this control ${item.gap} points higher than leaders perceive — an opportunity to leverage.`}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComparativeAnalysisSection;
