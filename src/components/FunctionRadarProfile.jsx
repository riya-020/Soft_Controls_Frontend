import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip as RechartsTooltip, Legend
} from 'recharts';
import { ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const METRICS = [
    'Achievability', 'Call someone to account', 'Clarity', 'Commitment',
    'Discussability', 'Enforcement', 'Role Modelling', 'Transparency'
];

const METRIC_COLORS = {
    'Achievability':           '#3b82f6',
    'Call someone to account': '#f43f5e',
    'Clarity':                 '#8b5cf6',
    'Commitment':              '#f97316',
    'Discussability':          '#06b6d4',
    'Enforcement':             '#10b981',
    'Role Modelling':          '#6366f1',
    'Transparency':            '#eab308',
};

const FALLBACK_FUNC_DATA = {
    Audit:      { Achievability: 71, 'Call someone to account': 71, Clarity: 66, Commitment: 81, Discussability: 88, Enforcement: 75, 'Role Modelling': 76, Transparency: 76 },
    Finance:    { Achievability: 74, 'Call someone to account': 65, Clarity: 81, Commitment: 84, Discussability: 80, Enforcement: 80, 'Role Modelling': 80, Transparency: 82 },
    HR:         { Achievability: 71, 'Call someone to account': 86, Clarity: 75, Commitment: 81, Discussability: 71, Enforcement: 71, 'Role Modelling': 74, Transparency: 72 },
    IT:         { Achievability: 71, 'Call someone to account': 80, Clarity: 83, Commitment: 72, Discussability: 78, Enforcement: 75, 'Role Modelling': 74, Transparency: 70 },
    Operations: { Achievability: 68, 'Call someone to account': 60, Clarity: 63, Commitment: 66, Discussability: 74, Enforcement: 75, 'Role Modelling': 75, Transparency: 65 },
    Sales:      { Achievability: 82, 'Call someone to account': 74, Clarity: 75, Commitment: 76, Discussability: 80, Enforcement: 79, 'Role Modelling': 78, Transparency: 79 },
};

const FALLBACK_ORG = {
    Achievability: 73, 'Call someone to account': 74, Clarity: 74,
    Commitment: 77, Discussability: 78, Enforcement: 76, 'Role Modelling': 76, Transparency: 75
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const diff = d.score - d.orgAvg;
    const col = diff > 0 ? '#22c55e' : diff < 0 ? '#f43f5e' : '#94a3b8';
    return (
        <div style={{
            background: 'rgba(255,255,255,0.97)', border: '1px solid #e2e8f0',
            borderRadius: 12, padding: '14px 18px',
            boxShadow: '0 8px 32px rgba(15,23,42,0.14)', minWidth: 210,
        }}>
            <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: 10, fontSize: 13, borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>{d.metric}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#1565c0', fontWeight: 600 }}>Function Score</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#1565c0' }}>{d.score}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>Org Average</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#f59e0b' }}>{d.orgAvg}</span>
                </div>
                <div style={{ marginTop: 4, paddingTop: 8, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: col }}>
                        {diff > 0 ? `▲ +${diff}` : diff < 0 ? `▼ ${diff}` : '— On par'} vs org avg
                    </span>
                </div>
            </div>
        </div>
    );
};

// ─── Score Breakdown Row ──────────────────────────────────────────────────────
const ScoreRow = ({ metric, score, orgAvg, index }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => { const t = setTimeout(() => setVisible(true), index * 60); return () => clearTimeout(t); }, [index]);

    const diff = score - orgAvg;
    const color = METRIC_COLORS[metric] || '#3b82f6';
    const diffCol = diff > 0 ? '#22c55e' : diff < 0 ? '#f43f5e' : '#94a3b8';
    const DiffIcon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;

    return (
        <div style={{
            display: 'grid', gridTemplateColumns: '1fr 36px 36px 58px',
            alignItems: 'center', gap: 8,
            padding: '7px 10px', borderRadius: 8,
            background: index % 2 === 0 ? 'rgba(240,249,255,0.8)' : 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(186,230,253,0.3)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-8px)',
            transition: 'opacity .3s ease, transform .3s ease',
        }}>
            {/* Metric name + bar */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#1e293b' }}>{metric}</span>
                </div>
                <div style={{ height: 4, background: '#e0f2fe', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                        height: '100%', borderRadius: 3,
                        width: `${score}%`,
                        background: `linear-gradient(90deg, ${color}99, ${color})`,
                        transition: 'width 0.9s cubic-bezier(.4,0,.2,1)',
                    }} />
                </div>
            </div>

            {/* Function score */}
            <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color, letterSpacing: '-0.02em' }}>{score}</span>
            </div>

            {/* Org avg */}
            <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{orgAvg}</span>
            </div>

            {/* Diff badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
                <DiffIcon size={10} style={{ color: diffCol, flexShrink: 0 }} />
                <span style={{
                    fontSize: 10, fontWeight: 700, color: diffCol,
                    background: diff > 0 ? '#dcfce7' : diff < 0 ? '#ffe4e6' : '#f1f5f9',
                    borderRadius: 20, padding: '1px 7px',
                }}>
                    {diff > 0 ? `+${diff}` : diff}
                </span>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const FunctionRadarProfile = () => {
    const [functions,        setFunctions]        = useState(Object.keys(FALLBACK_FUNC_DATA));
    const [selectedFunction, setSelectedFunction] = useState('Audit');
    const [funcScores,       setFuncScores]       = useState(FALLBACK_FUNC_DATA);
    const [orgAverages,      setOrgAverages]      = useState(FALLBACK_ORG);
    const [isLoading,        setIsLoading]        = useState(true);
    const [insights,         setInsights]         = useState(null);
    const [insightsLoading,  setInsightsLoading]  = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`/data/soft_control_data1.xlsx?v=${Date.now()}`);
                if (!res.ok) throw new Error('Failed to fetch Excel');
                const buf = await res.arrayBuffer();
                const wb  = XLSX.read(buf, { type: 'array' });

                const computedOrg = {};
                if (wb.SheetNames.includes('SOFT CONTROL SCORECARD')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['SOFT CONTROL SCORECARD']).forEach(row => {
                        const sc = String(row['SoftControl'] || '').trim();
                        const score = parseFloat(row['AvgScore100']);
                        if (sc && sc !== 'SoftControl' && !isNaN(score) && score > 0) computedOrg[sc] = Math.round(score);
                    });
                }

                const funcMap = {};
                if (wb.SheetNames.includes('Functions')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['Functions']).forEach(row => {
                        const rid = String(row['RespondentID'] || '').trim();
                        const fn  = String(row['Function']    || '').trim();
                        if (rid && fn) funcMap[rid] = fn;
                    });
                }

                const funcSCTotals = {};
                if (wb.SheetNames.includes('AllResponses')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['AllResponses']).forEach(row => {
                        const rid   = String(row['RespondentID'] || '').trim();
                        const sc    = String(row['SoftControl']  || '').trim();
                        const score = parseFloat(row['Score_100']);
                        if (!rid || !sc || isNaN(score) || score <= 0) return;
                        const fn = funcMap[rid];
                        if (!fn) return;
                        if (!funcSCTotals[fn]) funcSCTotals[fn] = {};
                        if (!funcSCTotals[fn][sc]) funcSCTotals[fn][sc] = { sum: 0, count: 0 };
                        funcSCTotals[fn][sc].sum   += score;
                        funcSCTotals[fn][sc].count += 1;
                    });
                }

                const computedFuncScores = {};
                Object.entries(funcSCTotals).forEach(([fn, scMap]) => {
                    computedFuncScores[fn] = {};
                    Object.entries(scMap).forEach(([sc, { sum, count }]) => {
                        computedFuncScores[fn][sc] = Math.round(sum / count);
                    });
                });

                const uniqueFunctions = Object.keys(computedFuncScores).sort();
                if (uniqueFunctions.length > 0) {
                    setFunctions(uniqueFunctions);
                    setSelectedFunction(uniqueFunctions[0]);
                    setFuncScores(computedFuncScores);
                    setOrgAverages(Object.keys(computedOrg).length > 0 ? computedOrg : FALLBACK_ORG);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    // ── Fetch functional insights when function changes ────────────────────────
    useEffect(() => {
        if (!selectedFunction) return;
        const fetch_ = async () => {
            setInsightsLoading(true);
            setInsights(null);
            try {
                const res = await fetch(`http://localhost:8000/functional-insights?function=${encodeURIComponent(selectedFunction)}`);
                if (!res.ok) throw new Error('API not available');
                const data = await res.json();
                setInsights(data);
            } catch {
                setInsights(null);
            } finally {
                setInsightsLoading(false);
            }
        };
        fetch_();
    }, [selectedFunction]);

    const chartData = METRICS.map(metric => {
        const fnScores = funcScores[selectedFunction] || {};
        const scoreKey = Object.keys(fnScores).find(k => k.toLowerCase() === metric.toLowerCase());
        const orgKey   = Object.keys(orgAverages).find(k => k.toLowerCase() === metric.toLowerCase());
        return {
            metric,
            score:  scoreKey ? fnScores[scoreKey]  : 0,
            orgAvg: orgKey   ? orgAverages[orgKey] : 75,
        };
    });

    const aboveAvg = chartData.filter(d => d.score >= d.orgAvg).length;
    const belowAvg = chartData.length - aboveAvg;

    if (isLoading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, background: 'rgba(255,255,255,0.82)', borderRadius: 18 }}>
            <p style={{ color: '#94a3b8', fontWeight: 600 }}>Loading…</p>
        </div>
    );

    return (
        <div style={{
            background: '#ffffff',
            border: '1px solid #ebebeb',
            borderRadius: 14,
            padding: '22px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            transition: 'box-shadow .2s ease, transform .2s ease',
            position: 'relative', overflow: 'hidden',
        }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#1565c0', textTransform: 'uppercase', letterSpacing: '.12em', margin: '0 0 5px' }}>Function Analysis</p>
                    <h2 style={{ fontSize: 19, fontWeight: 700, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Soft Control Scores by Function</h2>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Function score vs organisation average</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {/* stat pills */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 20, padding: '5px 13px', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <TrendingUp size={12} style={{ color: '#16a34a' }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>{aboveAvg} above avg</span>
                        </div>
                        <div style={{ background: '#ffe4e6', border: '1px solid #fecdd3', borderRadius: 20, padding: '5px 13px', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <TrendingDown size={12} style={{ color: '#dc2626' }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626' }}>{belowAvg} below avg</span>
                        </div>
                    </div>

                    {/* dropdown */}
                    <div style={{ position: 'relative' }}>
                        <select
                            value={selectedFunction}
                            onChange={e => setSelectedFunction(e.target.value)}
                            style={{
                                appearance: 'none', cursor: 'pointer',
                                background: '#fff', border: '1.5px solid #cbd5e1',
                                borderRadius: 10, color: '#0f172a',
                                fontSize: 13, fontWeight: 700,
                                padding: '9px 40px 9px 14px',
                                minWidth: 170,
                                boxShadow: '0 1px 4px rgba(15,23,42,.08)',
                                transition: 'border-color .15s, box-shadow .15s',
                            }}
                            onFocus={e => { e.target.style.borderColor = '#1565c0'; e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,.12)'; }}
                            onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = '0 1px 4px rgba(15,23,42,.08)'; }}
                        >
                            {functions.map((f, i) => <option key={i} value={f}>{f}</option>)}
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                    </div>
                </div>
            </div>

            {/* ── Body: Radar only ── */}
            <div style={{ height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                        <PolarGrid stroke="#e2e8f0" gridType="polygon" />
                        <PolarAngleAxis dataKey="metric"
                            tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]}
                            tick={{ fill: '#94a3b8', fontSize: 9 }}
                            axisLine={false} tickCount={5} />
                        <Radar name="Org Average" dataKey="orgAvg"
                            stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 4"
                            fill="#f59e0b" fillOpacity={0.07} />
                        <Radar name={selectedFunction || 'Function'} dataKey="score"
                            stroke="#1565c0" strokeWidth={2.5}
                            fill="#1565c0" fillOpacity={0.18} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend layout="horizontal" align="center" verticalAlign="bottom"
                            wrapperStyle={{ paddingTop: 14 }}
                            formatter={v => <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>{v}</span>} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* ── Functional Insights ── */}
            {insightsLoading && (
                <div style={{ marginTop: 16, padding: '14px 16px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 16, height: 16, border: '2px solid #1565c0', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#64748b' }}>Loading insights for {selectedFunction}…</span>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            {!insightsLoading && insights && (
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>

                    {/* Section header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                        </div>
                        <div>
                            <p style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 1px' }}>AI-Generated</p>
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                AI Insights — {selectedFunction}
                            </h3>
                        </div>
                    </div>

                    {/* Summary */}
                    {insights.summary && (
                        <div style={{
                            background: 'linear-gradient(135deg, #f8faff 0%, #f5f7ff 100%)',
                            border: '1px solid #e0e7ff',
                            borderRadius: 12, padding: '14px 16px',
                            animation: 'insightFade 0.4s ease 0s both',
                        }}>
                            <p style={{ fontSize: 9.5, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 6px' }}>Summary</p>
                            <p style={{ fontSize: 12.5, color: '#3730a3', lineHeight: 1.7, margin: 0 }}>{insights.summary}</p>
                        </div>
                    )}

                    {/* Strengths + Risks in 2 cols */}
                    {(insights.strengths?.length > 0 || insights.risks?.length > 0) && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            {insights.strengths?.length > 0 && (
                                <div style={{
                                    background: 'linear-gradient(135deg, #f0fdf9 0%, #ecfdf5 100%)',
                                    border: '1px solid #a7f3d0',
                                    borderRadius: 12, padding: '12px 14px',
                                    animation: 'insightFade 0.4s ease 0.05s both',
                                }}>
                                    <p style={{ fontSize: 9.5, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 8px' }}>Strengths</p>
                                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {insights.strengths.map((s, i) => (
                                            <li key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: '#065f46', lineHeight: 1.55 }}>
                                                <span style={{ color: '#10b981', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>{s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {insights.risks?.length > 0 && (
                                <div style={{
                                    background: 'linear-gradient(135deg, #fef5f8 0%, #fdf2f8 100%)',
                                    border: '1px solid #fbcfe8',
                                    borderRadius: 12, padding: '12px 14px',
                                    animation: 'insightFade 0.4s ease 0.1s both',
                                }}>
                                    <p style={{ fontSize: 9.5, fontWeight: 700, color: '#db2777', textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 8px' }}>Risk Areas</p>
                                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {insights.risks.map((r, i) => (
                                            <li key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: '#831843', lineHeight: 1.55 }}>
                                                <span style={{ color: '#ec4899', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>!</span>{r}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Recommendations */}
                    {insights.recommendations?.length > 0 && (
                        <div style={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            border: '1px solid #cbd5e1',
                            borderRadius: 12, padding: '12px 14px',
                            animation: 'insightFade 0.4s ease 0.15s both',
                        }}>
                            <p style={{ fontSize: 9.5, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 10px' }}>Recommendations</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {insights.recommendations.map((rec, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12, color: '#334155', lineHeight: 1.6, animation: `insightFade 0.4s ease ${0.15 + i * 0.05}s both` }}>
                                        <span style={{
                                            width: 20, height: 20, borderRadius: '50%',
                                            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                            color: '#fff', fontSize: 10, fontWeight: 800,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>{i + 1}</span>
                                        {rec}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Structured API response fields */}
                    {(() => {
                        const items = Array.isArray(insights) ? insights : [insights];
                        const item = items.find(i => i.Function?.toLowerCase() === selectedFunction?.toLowerCase()) || items[0];
                        if (!item) return null;
                        const fields = [
                            { key: 'ObservedRiskPattern',        label: 'Observed Risk Pattern',        bg: 'linear-gradient(135deg, #fef5f8 0%, #fdf2f8 100%)', border: '#fbcfe8', labelColor: '#db2777', textColor: '#831843' },
                            { key: 'WhyRiskIsConcentratedHere',  label: 'Why Risk Is Concentrated Here', bg: 'linear-gradient(135deg, #fef3f2 0%, #fef2f2 100%)', border: '#fecaca', labelColor: '#dc2626', textColor: '#7f1d1d' },
                            { key: 'FunctionalGap',              label: 'Functional Gap',                bg: 'linear-gradient(135deg, #f8faff 0%, #f5f7ff 100%)', border: '#e0e7ff', labelColor: '#6366f1', textColor: '#3730a3' },
                            { key: 'BusinessImpact',             label: 'Business Impact',               bg: 'linear-gradient(135deg, #f0fdf9 0%, #ecfdf5 100%)', border: '#a7f3d0', labelColor: '#059669', textColor: '#065f46' },
                        ];
                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {fields.map(({ key, label, bg, border, labelColor, textColor }, idx) =>
                                    item[key] ? (
                                        <div key={key} style={{
                                            background: bg, border: `1px solid ${border}`,
                                            borderRadius: 12, padding: '14px 16px',
                                            animation: `insightFade 0.4s ease ${0.1 + idx * 0.07}s both`,
                                        }}>
                                            <p style={{ fontSize: 9.5, fontWeight: 700, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 6px' }}>{label}</p>
                                            <p style={{ fontSize: 12.5, color: textColor, lineHeight: 1.7, margin: 0 }}>{item[key]}</p>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        );
                    })()}

                    <style>{`
                        @keyframes insightFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default FunctionRadarProfile;