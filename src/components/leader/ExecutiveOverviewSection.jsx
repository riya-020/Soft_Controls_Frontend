import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, Legend, Cell, PieChart, Pie,
} from 'recharts';
import { Activity, Users, AlertTriangle } from 'lucide-react';
import SpiderChartWithDimensions from '../SpiderChartWithDimensions';
import FunctionRadarProfile from '../FunctionRadarProfile';
import QuestionInsightsSection from '../QuestionInsightsSection';

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, items, icon: Icon, accent, badge, delay = 0 }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
    return (
        <div style={{
            background: '#fff', border: '1px solid #e8eaf0', borderRadius: 18,
            padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12,
            boxShadow: '0 2px 12px rgba(99,102,241,.07)', borderTop: '3px solid #c9a84c',
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity .45s ease, transform .45s ease, box-shadow .2s', cursor: 'default',
        }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 28px ${accent}22`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: `${accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
                        {Icon && <Icon size={16} />}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</span>
                </div>
                {badge && <span style={{ fontSize: 10, fontWeight: 700, color: accent, background: `${accent}12`, borderRadius: 20, padding: '3px 10px', border: `1px solid ${accent}25` }}>{badge}</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: accent, lineHeight: 1 }}>{value}</span>
                {typeof value === 'number' && <span style={{ fontSize: 12, color: '#9ca3af', paddingBottom: 7 }}>controls</span>}
            </div>
            {items?.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{item}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── RCI Gauge ────────────────────────────────────────────────────────────────
const RCIGauge = ({ score }) => {
    const [animated, setAnimated] = useState(false);
    useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t); }, []);

    const W = 260, H = 130, cx = W / 2, cy = H - 2;
    const R = 100, strokeW = 18;
    const toRad = d => (d * Math.PI) / 180;
    const s2a = s => s * 1.8;
    const GAP = 6;
    const segments = [
        { from: 0,  to: 60,  color: '#f43f5e', glow: '#f43f5e40', label: 'High'   },
        { from: 60, to: 75,  color: '#f59e0b', glow: '#f59e0b40', label: 'Medium' },
        { from: 75, to: 100, color: '#22c55e', glow: '#22c55e40', label: 'Low'    },
    ];

    const arc = (fromDeg, toDeg, color) => {
        const a1 = toRad(180 - fromDeg), a2 = toRad(180 - toDeg);
        const x1 = cx + R * Math.cos(a1), y1 = cy - R * Math.sin(a1);
        const x2 = cx + R * Math.cos(a2), y2 = cy - R * Math.sin(a2);
        return <path d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round" />;
    };

    const currentScore = animated ? score : 0;
    const needleAngle = toRad(180 - s2a(currentScore));
    const nLen = R - strokeW - 8;
    const nx = cx + nLen * Math.cos(needleAngle), ny = cy - nLen * Math.sin(needleAngle);

    const riskLabel = score >= 75 ? 'Low Risk' : score >= 60 ? 'Medium Risk' : 'High Risk';
    const riskCol   = score >= 75 ? '#22c55e'  : score >= 60 ? '#f59e0b'     : '#f43f5e';
    const riskBg    = score >= 75 ? '#dcfce7'  : score >= 60 ? '#fef3c7'     : '#ffe4e6';
    const riskText  = score >= 75 ? '#15803d'  : score >= 60 ? '#b45309'     : '#be123c';

    const trackDots = [];
    for (let d = 4; d <= 176; d += 7) {
        const a = toRad(180 - d);
        const dr = R - strokeW / 2 - 5;
        trackDots.push({ x: cx + dr * Math.cos(a), y: cy - dr * Math.sin(a) });
    }

    return (
        <div style={{
            background: '#ffffff', border: '1px solid #ebebeb', borderRadius: 14,
            padding: '20px 22px 18px', display: 'flex', flexDirection: 'column',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)', transition: 'box-shadow .25s ease, transform .25s ease',
            position: 'relative', overflow: 'hidden',
        }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${riskCol}18, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '.1em' }}>Risk Culture Index</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: riskText, background: riskBg, borderRadius: 20, padding: '3px 11px', border: `1px solid ${riskCol}40` }}>{riskLabel}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
                    <defs>
                        <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    {(() => {
                        const a1 = toRad(180), a2 = toRad(0);
                        return <path d={`M ${cx + R * Math.cos(a1)} ${cy - R * Math.sin(a1)} A ${R} ${R} 0 0 1 ${cx + R * Math.cos(a2)} ${cy - R * Math.sin(a2)}`}
                            fill="none" stroke="#e0e7ff" strokeWidth={strokeW} strokeLinecap="round" />;
                    })()}
                    {trackDots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={1.4} fill="#c7d2fe" opacity={0.7} />)}
                    {segments.map((s, i) => {
                        const gs = i === 0 ? 0 : GAP, ge = i === 2 ? 0 : GAP;
                        const a1 = toRad(180 - s2a(s.from) - gs), a2 = toRad(180 - s2a(s.to) + ge);
                        const x1 = cx + R * Math.cos(a1), y1 = cy - R * Math.sin(a1);
                        const x2 = cx + R * Math.cos(a2), y2 = cy - R * Math.sin(a2);
                        return <path key={`g${i}`} d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
                            fill="none" stroke={s.glow} strokeWidth={strokeW + 10} strokeLinecap="round"
                            style={{ filter: 'blur(5px)' }} />;
                    })}
                    {segments.map((s, i) => arc(s2a(s.from) + (i > 0 ? GAP : 0), s2a(s.to) - (i < 2 ? GAP : 0), s.color))}
                    <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#1e293b" strokeWidth={2} strokeLinecap="round"
                        style={{ transition: 'all 1.4s cubic-bezier(.34,1.56,.64,1)' }} />
                    <circle cx={cx} cy={cy} r={8} fill={`${riskCol}20`} />
                    <circle cx={cx} cy={cy} r={5} fill="#fff" stroke="#e0e7ff" strokeWidth={1.5} />
                    <circle cx={cx} cy={cy} r={2.5} fill={riskCol} />
                </svg>
            </div>
            <div style={{ textAlign: 'center', marginTop: 6 }}>
                <p style={{ fontSize: 38, fontWeight: 800, color: '#0f172a', lineHeight: 1, margin: 0, letterSpacing: '-0.03em' }}>{score}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 14px', fontWeight: 500, letterSpacing: '.02em' }}>out of 100</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
                {segments.map(s => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, boxShadow: `0 0 6px ${s.color}80` }} />
                        <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Main Section ─────────────────────────────────────────────────────────────
const ExecutiveOverviewSection = ({
    kpiData,
    pillarsData,
    radarData,
    dimensionData,
    employeeLeaderData,
    toneAtTopIndex,
    leaderChartLoading,
    selectedControl,
    setSelectedControl,
    reportingData,
}) => {
    const PIE_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#f59e0b', '#ef4444'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── KPI Row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 1fr 1fr', gap: 16, alignItems: 'stretch' }}>
                <RCIGauge score={kpiData.rci} />

                {/* Respondents */}
                <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}><Users size={15} /></div>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.09em' }}>Respondents</span>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', background: '#eff6ff', borderRadius: 20, padding: '2px 10px', border: '1px solid #bfdbfe' }}>Live</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 52, fontWeight: 800, color: '#1d4ed8', lineHeight: 1 }}>{kpiData.respondents}</span>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>employees</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 14px' }}>responded this survey cycle</p>
                    <div style={{ background: '#eff6ff', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
                        <p style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, margin: '0 0 3px' }}>What this means</p>
                        <p style={{ fontSize: 11, color: '#4b5563', margin: 0, lineHeight: 1.5 }}>Total unique employees who completed the risk culture survey in this cycle.</p>
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>Participation rate</span>
                            <span style={{ fontSize: 10, color: '#2563eb', fontWeight: 700 }}>68%</span>
                        </div>
                        <div style={{ height: 5, background: '#dbeafe', borderRadius: 4 }}>
                            <div style={{ width: '68%', height: '100%', background: '#2563eb', borderRadius: 4 }} />
                        </div>
                    </div>
                </div>

                {/* Strong Controls */}
                <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}><Activity size={15} /></div>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.09em' }}>Strong Controls</span>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', borderRadius: 20, padding: '2px 10px', border: '1px solid #bbf7d0' }}>Leading</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 52, fontWeight: 800, color: '#15803d', lineHeight: 1 }}>{kpiData.strongControls.count}</span>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>of 8 controls</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 14px' }}>performing above threshold</p>
                    <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
                        <p style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, margin: '0 0 3px' }}>What this means</p>
                        <p style={{ fontSize: 11, color: '#4b5563', margin: 0, lineHeight: 1.5 }}>These controls indicate healthy cultural behaviours across the organisation.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 8px' }}>
                        {kpiData.strongControls.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', borderRadius: 7, padding: '5px 8px' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />
                                <span style={{ fontSize: 11, color: '#166534', fontWeight: 600 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Needs Attention */}
                <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}><AlertTriangle size={15} /></div>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.09em' }}>Needs Attention</span>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#e11d48', background: '#fff1f2', borderRadius: 20, padding: '2px 10px', border: '1px solid #fecdd3' }}>Review</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 52, fontWeight: 800, color: '#be123c', lineHeight: 1 }}>{kpiData.weakControls.count}</span>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>of 8 controls</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 14px' }}>require immediate intervention</p>
                    <div style={{ background: '#fff1f2', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
                        <p style={{ fontSize: 11, color: '#e11d48', fontWeight: 600, margin: '0 0 3px' }}>What this means</p>
                        <p style={{ fontSize: 11, color: '#4b5563', margin: 0, lineHeight: 1.5 }}>These areas carry elevated cultural risk and need targeted leadership action.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 8px' }}>
                        {kpiData.weakControls.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff1f2', borderRadius: 7, padding: '5px 8px' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e11d48', flexShrink: 0 }} />
                                <span style={{ fontSize: 11, color: '#9f1239', fontWeight: 600 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            ── Bar Charts Row ──
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Soft Control Bar Chart */}
                <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '22px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                    <div style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Soft Control Landscape</p>
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Soft Control Performance</h2>
                    </div>
                    <div style={{ height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pillarsData} margin={{ top: 8, right: 8, left: -20, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} angle={-30} textAnchor="end" tickMargin={6} height={80} interval={0} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                <RechartsTooltip contentStyle={{ borderRadius: 10, border: '1px solid #e8eaf0', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,.08)' }} />
                                <Bar dataKey="score" barSize={26} radius={[5, 5, 0, 0]}>
                                    {pillarsData.map((_, i) => {
                                        const blues = ['#1e3a8a','#1d4ed8','#2563eb','#3b82f6','#60a5fa','#93c5fd','#bfdbfe','#dbeafe'];
                                        return <Cell key={i} fill={blues[i % blues.length]} />;
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Leadership vs Employee */}
                <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '22px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Alignment Analysis</p>
                            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Leadership vs Employee</h2>
                        </div>
                        {toneAtTopIndex && (
                            <div style={{ background: '#f5f3ff', borderRadius: 8, padding: '6px 12px', border: '1px solid #ddd6fe' }}>
                                <p style={{ fontSize: 10, color: '#9ca3af', margin: 0 }}>Tone at Top</p>
                                <p style={{ fontSize: 16, fontWeight: 700, color: '#7c3aed', margin: 0 }}>{toneAtTopIndex}</p>
                            </div>
                        )}
                    </div>
                    {leaderChartLoading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                            <p style={{ color: '#9ca3af', fontSize: 13 }}>Loading…</p>
                        </div>
                    ) : (
                        <div style={{ height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={employeeLeaderData} margin={{ top: 8, right: 8, left: -20, bottom: 60 }} barGap={4} barCategoryGap="32%">
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="control" tick={{ fontSize: 10, fill: '#6b7280' }} angle={-30} textAnchor="end" tickMargin={6} height={80} interval={0} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                    <RechartsTooltip contentStyle={{ borderRadius: 10, border: '1px solid #e8eaf0', fontSize: 12 }} />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <Bar dataKey="employee" name="Employee" fill="#c4b5fd" barSize={18} radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="leader" name="Leader" fill="#7c3aed" barSize={18} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Spider Chart ── */}
            <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                <SpiderChartWithDimensions
                    radarData={radarData}
                    selectedControl={selectedControl}
                    setSelectedControl={setSelectedControl}
                    dimensionData={dimensionData}
                />
            </div>

            {/* ── Pie + Function Radar ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Incident Reporting Pie */}
                <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '22px', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Analytics</p>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Incident Reporting Preferences</h2>
                    <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>How employees prefer to report risk incidents</p>
                    <div style={{ height: 190, width: '100%', flexShrink: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={reportingData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={3} label={false}>
                                    {reportingData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(v, n) => [`${Math.round((v / reportingData.reduce((a, b) => a + b.value, 0)) * 100)}%`, n]}
                                    contentStyle={{ borderRadius: 10, border: '1px solid #e8eaf0', fontSize: 12 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 14 }}>
                        {reportingData.map((entry, i) => {
                            const total = reportingData.reduce((a, b) => a + b.value, 0);
                            const p = Math.round((entry.value / total) * 100);
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 9, height: 9, borderRadius: 3, background: PIE_COLORS[i], flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.name}</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: PIE_COLORS[i], flexShrink: 0 }}>{p}%</span>
                                    <div style={{ width: 60, height: 3, background: '#f3f4f6', borderRadius: 2, flexShrink: 0 }}>
                                        <div style={{ width: `${p}%`, height: '100%', background: PIE_COLORS[i], borderRadius: 2 }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Function Radar */}
                <div style={{ overflow: 'hidden' }}>
                    <FunctionRadarProfile />
                </div>
            </div>

            {/* ── Question Insights ── */}
            <QuestionInsightsSection />
        </div>
    );
};

export default ExecutiveOverviewSection;
