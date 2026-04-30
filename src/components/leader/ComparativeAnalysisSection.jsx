import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, Legend,
} from 'recharts';

const ComparativeAnalysisSection = ({ employeeLeaderData, toneAtTopIndex, leaderChartLoading }) => {
    const [insightsData, setInsightsData] = useState({});

    useEffect(() => {
        fetch('http://localhost:8000/insights')
            .then(r => r.ok ? r.json() : {})
            .then(data => setInsightsData(data || {}))
            .catch(() => {});
    }, []);

    // Build gap insights from backend /insights — all 8 soft controls
    const gapInsights = Object.entries(insightsData)
        .map(([sc, val]) => ({
            control: sc,
            leader: val.leaderScore,
            employee: val.employeeScore,
            gap: val.leaderScore != null && val.employeeScore != null
                ? Math.abs((val.leaderScore || 0) - (val.employeeScore || 0))
                : null,
            summary: val.gapAnalysis?.summary || '',
            points: val.gapAnalysis?.points?.filter(p => p && p.trim()) || [],
        }))
        .sort((a, b) => (b.gap ?? -1) - (a.gap ?? -1));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

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
                                <Bar dataKey="employee" name="Employee" fill="#93c5fd" barSize={20} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="leader" name="Leader" fill="#1d4ed8" barSize={20} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Top Gap Insights from backend */}
            {gapInsights.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', margin: '0 0 14px' }}>Gap Insights — All Soft Controls</h3>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px', lineHeight: 1.6 }}>
                        Leadership vs employee perception gaps across all 8 soft controls, sourced from AI analysis.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {gapInsights.map((item, i) => {
                            const leaderHigher = (item.leader || 0) > (item.employee || 0);
                            const gapColor = item.gap == null ? '#94a3b8' : item.gap >= 10 ? '#ef4444' : item.gap >= 5 ? '#f59e0b' : '#22c55e';
                            return (
                                <div key={i} style={{ background: '#F7FAFC', border: '1px solid #E5E7EB', borderLeft: `4px solid ${gapColor}`, borderRadius: '0 10px 10px 0', padding: '14px 16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: '#1F2937', margin: 0 }}>{item.control}</p>
                                    </div>
                                    {item.summary && (
                                        <p style={{ fontSize: 12, color: '#374151', margin: '0 0 6px', lineHeight: 1.6, fontWeight: 500 }}>{item.summary}</p>
                                    )}
                                    {item.points.length > 0 && (
                                        <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                            {item.points.map((pt, pi) => (
                                                <li key={pi} style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.55 }}>{pt}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {!item.summary && !item.points.length && (
                                        <p style={{ fontSize: 12, color: '#6B7280', margin: '6px 0 0', lineHeight: 1.5 }}>
                                          {leaderHigher
                                                ? `Leaders rate this control ${item.gap} points higher than employees experience it — a potential blind spot.`
                                                : `Employees rate this control ${item.gap} points higher than leaders perceive — an opportunity to leverage.`}
                                        </p>
                                    )}
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