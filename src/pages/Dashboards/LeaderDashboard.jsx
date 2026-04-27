import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, Legend, Cell, PieChart, Pie
} from 'recharts';
import { Activity, Users, AlertTriangle, ChevronDown, X, TrendingUp, ShieldCheck, AlertCircle, Target, BarChart2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import dashImg from '../../assets/Leader 7.JPG';
import FunctionRadarProfile from '../../components/FunctionRadarProfile';
import SpiderChartWithDimensions from '../../components/SpiderChartWithDimensions';
import RecommendationsSection from '../../components/RecommendationSection';
import QuestionInsightsSection from '../../components/QuestionInsightsSection';
import PolicyGapDashboard from '../../components/PolicyGapDashboard';

const PILLAR_COLORS = {
    'Role Modelling':          '#3b82f6',
    'Discussability':          '#6366f1',
    'Achievability':           '#8b5cf6',
    'Enforcement':             '#a855f7',
    'Clarity':                 '#ec4899',
    'Transparency':            '#f43f5e',
    'Commitment':              '#f97316',
    'Call Someone to Account': '#eab308',
};

const PARAM_MAP = {
    role_modelling:          'Role Modelling',
    open_to_discussion:      'Discussability',
    achievability:           'Achievability',
    enforcement:             'Enforcement',
    clarity:                 'Clarity',
    transparency:            'Transparency',
    commitment:              'Commitment',
    call_someone_to_account: 'Call Someone to Account',
};

const normSC = (n) => {
    const map = {
        'call someone to account': 'Call Someone to Account',
        'role modelling':          'Role Modelling',
        'discussability':          'Discussability',
        'open_to_discussion':      'Discussability',
        'open to discussion':      'Discussability',
        'openness to discussion':  'Discussability',
        'achievability':           'Achievability',
        'enforcement':             'Enforcement',
        'clarity':                 'Clarity',
        'transparency':            'Transparency',
        'commitment':              'Commitment',
    };
    return map[(n || '').toLowerCase().trim()] || n;
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, items, icon: Icon, accent, badge, gradient, delay = 0 }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
    return (
        <div style={{
            background: '#fff',
            border: '1px solid #e8eaf0',
            borderRadius: 18,
            padding: '20px 22px',
            display: 'flex', flexDirection: 'column', gap: 12,
            boxShadow: '0 2px 12px rgba(99,102,241,.07)',
            borderTop: `3px solid #c9a84c`,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity .45s ease, transform .45s ease, box-shadow .2s',
            cursor: 'default',
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
                <span style={{ fontSize: 48, fontWeight: 800, color: accent, lineHeight: 1, fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>{value}</span>
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
    const nLen = R - strokeW - 8; // tip stays inside arc, well above score text
    const nx = cx + nLen * Math.cos(needleAngle), ny = cy - nLen * Math.sin(needleAngle);

    const riskLabel = score >= 75 ? 'Low Risk' : score >= 60 ? 'Medium Risk' : 'High Risk';
    const riskCol   = score >= 75 ? '#22c55e'  : score >= 60 ? '#f59e0b'     : '#f43f5e';
    const riskBg    = score >= 75 ? '#dcfce7'  : score >= 60 ? '#fef3c7'     : '#ffe4e6';
    const riskText  = score >= 75 ? '#15803d'  : score >= 60 ? '#b45309'     : '#be123c';

    // dotted track — inner ring
    const trackDots = [];
    for (let d = 4; d <= 176; d += 7) {
        const a = toRad(180 - d);
        const dr = R - strokeW / 2 - 5;
        trackDots.push({ x: cx + dr * Math.cos(a), y: cy - dr * Math.sin(a) });
    }

    return (
        <div style={{
            background: '#ffffff',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            border: '1px solid #ebebeb',
            borderRadius: 14,
            padding: '20px 22px 18px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            transition: 'box-shadow .25s ease, transform .25s ease',
            position: 'relative',
            overflow: 'hidden',
        }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            {/* subtle corner accent */}
            <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${riskCol}18, transparent 70%)`, pointerEvents: 'none' }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '.1em' }}>Risk Culture Index</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: riskText, background: riskBg, borderRadius: 20, padding: '3px 11px', border: `1px solid ${riskCol}40` }}>{riskLabel}</span>
            </div>

            {/* SVG Gauge */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
                    <defs>
                        <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>

                    {/* background track */}
                    {(() => {
                        const a1 = toRad(180), a2 = toRad(0);
                        return <path d={`M ${cx + R * Math.cos(a1)} ${cy - R * Math.sin(a1)} A ${R} ${R} 0 0 1 ${cx + R * Math.cos(a2)} ${cy - R * Math.sin(a2)}`}
                            fill="none" stroke="#e0e7ff" strokeWidth={strokeW} strokeLinecap="round" />;
                    })()}

                    {/* inner dotted ring */}
                    {trackDots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={1.4} fill="#c7d2fe" opacity={0.7} />)}

                    {/* glow shadow arcs */}
                    {segments.map((s, i) => {
                        const gs = i === 0 ? 0 : GAP, ge = i === 2 ? 0 : GAP;
                        const a1 = toRad(180 - s2a(s.from) - gs), a2 = toRad(180 - s2a(s.to) + ge);
                        const x1 = cx + R * Math.cos(a1), y1 = cy - R * Math.sin(a1);
                        const x2 = cx + R * Math.cos(a2), y2 = cy - R * Math.sin(a2);
                        return <path key={`g${i}`} d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
                            fill="none" stroke={s.glow} strokeWidth={strokeW + 10} strokeLinecap="round"
                            style={{ filter: 'blur(5px)' }} />;
                    })}

                    {/* main colored arcs */}
                    {segments.map((s, i) => arc(s2a(s.from) + (i > 0 ? GAP : 0), s2a(s.to) - (i < 2 ? GAP : 0), s.color))}

                    {/* needle */}
                    <line x1={cx} y1={cy} x2={nx} y2={ny}
                        stroke="#1e293b" strokeWidth={2} strokeLinecap="round"
                        style={{ transition: 'all 1.4s cubic-bezier(.34,1.56,.64,1)' }} />
                    {/* needle base glow */}
                    <circle cx={cx} cy={cy} r={8} fill={`${riskCol}20`} />
                    {/* pivot ring */}
                    <circle cx={cx} cy={cy} r={5} fill="#fff" stroke="#e0e7ff" strokeWidth={1.5} />
                    {/* pivot dot */}
                    <circle cx={cx} cy={cy} r={2.5} fill={riskCol} />
                </svg>
            </div>

            {/* Score — sits fully below the SVG, no overlap */}
            <div style={{ textAlign: 'center', marginTop: 6 }}>
                <p style={{ fontSize: 38, fontWeight: 800, color: '#0f172a', lineHeight: 1, margin: 0, letterSpacing: '-0.03em' }}>{score}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 14px', fontWeight: 500, letterSpacing: '.02em' }}>out of 100</p>
            </div>

            {/* Legend */}
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

// ─── Donut Ring ───────────────────────────────────────────────────────────────
const DonutRing = ({ name, score, color, isSelected, onClick }) => {
    const size = 100, sw = isSelected ? 11 : 8;
    const r = (size - sw) / 2, circ = 2 * Math.PI * r;
    return (
        <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'transform 0.2s', transform: isSelected ? 'scale(1.06)' : 'scale(1)' }}>
            <div style={{ position: 'relative', width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={`${(score / 100) * circ} ${circ}`} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color, fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>{Math.round(score)}</span>
                </div>
                {isSelected && (
                    <div style={{ position: 'absolute', top: -3, right: -3, width: 14, height: 14, background: color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontSize: 9, fontWeight: 700 }}>✓</span>
                    </div>
                )}
            </div>
            <p style={{ fontSize: 11, fontWeight: isSelected ? 700 : 600, color: isSelected ? color : '#374151', textAlign: 'center', margin: 0, maxWidth: 90, lineHeight: 1.3 }}>{name}</p>
            <div style={{ width: 64, height: 3, background: '#f3f4f6', borderRadius: 2 }}>
                <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 2 }} />
            </div>
        </div>
    );
};

// ─── Dimension Drill-Down ─────────────────────────────────────────────────────
const DimensionDrillDown = ({ pillar, dims, color, onClose }) => (
    <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px 22px', marginTop: 20, animation: 'fadeUp 0.22s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Dimension Breakdown</p>
                <p style={{ fontSize: 15, fontWeight: 700, color }}>{pillar}</p>
            </div>
            <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: '#6b7280', cursor: 'pointer' }}>
                <X size={13} /> Close
            </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {dims.map((dim, i) => {
                const sc = dim.score >= 80 ? '#22c55e' : dim.score >= 70 ? '#f59e0b' : '#ef4444';
                const rl = dim.score >= 80 ? 'Low Risk' : dim.score >= 70 ? 'Medium' : 'High Risk';
                return (
                    <div key={i} style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', border: '1px solid #e5e7eb', borderLeft: `3px solid ${color}` }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 10, lineHeight: 1.4 }}>{dim.name}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: 22, fontWeight: 700, color: sc, fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>{dim.score}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: sc, background: `${sc}18`, padding: '2px 8px', borderRadius: 12 }}>{rl}</span>
                        </div>
                        <div style={{ height: 4, background: '#f3f4f6', borderRadius: 2, marginBottom: 6 }}>
                            <div style={{ width: `${dim.score}%`, height: '100%', background: sc, borderRadius: 2, transition: 'width 0.5s ease' }} />
                        </div>
                        <span style={{ fontSize: 10, color: '#9ca3af' }}>{dim.favorable}% favorable</span>
                    </div>
                );
            })}
        </div>
        <style>{'@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }'}</style>
    </div>
);
// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const LeaderDashboard = () => {
    const [pillarsData, setPillarsData] = useState([]);
    const [radarData, setRadarData] = useState([]);
    const [dimensionData, setDimensionData] = useState({});
    const [functionData, setFunctionData] = useState({});
    const [kpiData, setKpiData] = useState({ rci: 0, respondents: 0, totalQuestions: 0, strongControls: { count: 0, items: [] }, weakControls: { count: 0, items: [] } });
    const [employeeLeaderData, setEmployeeLeaderData] = useState([]);
    const [selectedControl, setSelectedControl] = useState(null);
    const [toneAtTopIndex, setToneAtTopIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [leaderChartLoading, setLeaderChartLoading] = useState(true);

    const reportingData = [
        { name: 'HR Department', value: 6 },
        { name: 'Manager', value: 8 },
        { name: 'Digital Incident Reporting Tool', value: 4 },
        { name: 'Anonymous', value: 3 },
        { name: 'I choose not to report', value: 4 },
    ];
    const PIE_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#f59e0b', '#ef4444'];

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/data/soft_control_data1.xlsx');
                if (!res.ok) throw new Error('Excel not found');
                const buf = await res.arrayBuffer();
                const wb = XLSX.read(buf, { type: 'array' });

                let loadedPillars = [];
                if (wb.SheetNames.includes('SOFT CONTROL SCORECARD')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['SOFT CONTROL SCORECARD']).forEach((row) => {
                        const name = normSC(String(row.SoftControl || '').trim());
                        const score = parseFloat(row.AvgScore100);
                        if (name && !Number.isNaN(score) && score > 0 && name !== 'SoftControl')
                            loadedPillars.push({ name, score: Math.round(score), fill: PILLAR_COLORS[name] || '#6366f1' });
                    });
                }
                setPillarsData(loadedPillars);

                let rci = 0, respondents = 0, totalQuestions = 0;
                if (wb.SheetNames.includes('Culture_Risk_Index')) {
                    XLSX.utils.sheet_to_json(wb.Sheets.Culture_Risk_Index, { header: 1 }).forEach((row) => {
                        if (row[0] === 'Total Respondents' && typeof row[1] === 'number') respondents = row[1];
                        if (row[0] === 'Total Questions' && typeof row[1] === 'number') totalQuestions = row[1];
                        if (typeof row[15] === 'number' && row[15] > 1) rci = Math.round(row[15]);
                    });
                }
                if (wb.SheetNames.includes('Functions')) {
                    respondents = XLSX.utils.sheet_to_json(wb.Sheets.Functions).filter((r) => r.RespondentID).length;
                }

                const sorted = [...loadedPillars].sort((a, b) => b.score - a.score);
                setKpiData({
                    rci: rci || 77, respondents, totalQuestions,
                    strongControls: { count: 3, items: sorted.slice(0, 3).map((p) => p.name) },
                    weakControls: { count: 2, items: sorted.slice(-2).reverse().map((p) => p.name) },
                });

                let loadedRadar = [];
                if (wb.SheetNames.includes('Radar Chart')) {
                    let inData = false;
                    XLSX.utils.sheet_to_json(wb.Sheets['Radar Chart']).forEach((row) => {
                        const vals = Object.values(row);
                        const first = String(vals[0]);
                        if (first === 'SoftControl') { inData = true; return; }
                        if (first === 'Role Modelling' && typeof vals[1] === 'number') inData = true;
                        if (inData && first && first !== 'SoftControl') {
                            loadedRadar.push({ metric: first, score: parseFloat(row.__EMPTY_2) || 0, lowRisk: parseFloat(row.Score) || 100, mediumRisk: parseFloat(row.__EMPTY) || 80, highRisk: parseFloat(row.__EMPTY_1) || 70 });
                        }
                    });
                }
                if (loadedRadar.length === 0) loadedRadar = loadedPillars.map((p) => ({ metric: p.name, score: p.score, lowRisk: 100, mediumRisk: 80, highRisk: 70 }));
                setRadarData(loadedRadar);

                const dimMap = {};
                if (wb.SheetNames.includes('FinalQuestions')) {
                    XLSX.utils.sheet_to_json(wb.Sheets.FinalQuestions).forEach((row) => {
                        const sc = normSC(String(row.SoftControl || '').trim());
                        const dim = String(row.Dimensions || '').trim();
                        if (sc && dim) {
                            if (!dimMap[sc]) dimMap[sc] = [];
                            if (!dimMap[sc].find((d) => d.name === dim)) dimMap[sc].push({ name: dim, score: 0, favorable: 0 });
                        }
                    });
                }
                if (wb.SheetNames.includes('Dimension Sheet')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['Dimension Sheet']).forEach((row) => {
                        const dn = String(row.Dimension || '').trim();
                        const sc = parseFloat(row.AvgScore_100);
                        const fp = typeof row['Favorable%'] === 'number' ? Math.round(row['Favorable%'] * 100) : 0;
                        if (!dn || Number.isNaN(sc)) return;
                        Object.keys(dimMap).forEach((k) => {
                            const found = dimMap[k].find((d) => d.name.trim() === dn.trim());
                            if (found) { found.score = Math.round(sc); found.favorable = fp; }
                        });
                    });
                }
                setDimensionData(dimMap);

                const funcMap = {};
                if (wb.SheetNames.includes('Functions')) {
                    XLSX.utils.sheet_to_json(wb.Sheets.Functions).forEach((row) => {
                        const rid = String(row.RespondentID || '').trim();
                        const fn = String(row.Function || '').trim();
                        if (rid && fn) funcMap[rid] = fn;
                    });
                }
                const funcSCTotals = {};
                if (wb.SheetNames.includes('AllResponses')) {
                    XLSX.utils.sheet_to_json(wb.Sheets.AllResponses).forEach((row) => {
                        const rid = String(row.RespondentID || '').trim();
                        const sc = normSC(String(row.SoftControl || '').trim());
                        const score = parseFloat(row.Score_100);
                        if (!rid || !sc || Number.isNaN(score) || score <= 0) return;
                        const fn = funcMap[rid];
                        if (!fn) return;
                        if (!funcSCTotals[fn]) funcSCTotals[fn] = {};
                        if (!funcSCTotals[fn][sc]) funcSCTotals[fn][sc] = { sum: 0, count: 0 };
                        funcSCTotals[fn][sc].sum += score;
                        funcSCTotals[fn][sc].count += 1;
                    });
                }
                const computedFuncData = {};
                Object.entries(funcSCTotals).forEach(([fn, scMap]) => {
                    computedFuncData[fn] = {};
                    Object.entries(scMap).forEach(([sc, { sum, count }]) => {
                        computedFuncData[fn][sc] = Math.round((sum / count) * 100) / 100;
                    });
                });
                setFunctionData(computedFuncData);
            } catch (err) {
                console.error('Excel load error:', err);
                setKpiData({ rci: 77, respondents: 25, totalQuestions: 32, strongControls: { count: 2, items: ['Discussability', 'Enforcement'] }, weakControls: { count: 3, items: ['Call Someone to Account', 'Achievability', 'Clarity'] } });
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const apiRes = await fetch('http://localhost:8000/scores');
                if (!apiRes.ok) throw new Error();
                const leaderScores = await apiRes.json();
                if (leaderScores.length > 0) setToneAtTopIndex(leaderScores[0].ToneAtTopIndex?.toFixed(1));

                const xlsRes = await fetch('/data/soft_control_data1.xlsx');
                const buf = await xlsRes.arrayBuffer();
                const wb = XLSX.read(buf, { type: 'array' });
                const empMap = {};
                if (wb.SheetNames.includes('SOFT CONTROL SCORECARD')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['SOFT CONTROL SCORECARD']).forEach((row) => {
                        const name = normSC(String(row.SoftControl || '').trim());
                        const score = parseFloat(row.AvgScore100);
                        if (name && !Number.isNaN(score)) empMap[name] = Math.round(score);
                    });
                }
                setEmployeeLeaderData(leaderScores.map((item) => ({
                    control: PARAM_MAP[item.Parameter] || item.Parameter,
                    leader: Math.round(item.LeadershipScore_0_100),
                    employee: empMap[PARAM_MAP[item.Parameter]] || 0,
                })));
            } catch {
                setEmployeeLeaderData([
                    { control: 'Role Modelling', employee: 78, leader: 84 },
                    { control: 'Discussability', employee: 81, leader: 85 },
                    { control: 'Achievability', employee: 75, leader: 79 },
                    { control: 'Enforcement', employee: 78, leader: 82 },
                    { control: 'Clarity', employee: 76, leader: 80 },
                    { control: 'Transparency', employee: 76, leader: 83 },
                    { control: 'Commitment', employee: 77, leader: 81 },
                    { control: 'Call Someone to Account', employee: 73, leader: 78 },
                ]);
            } finally {
                setLeaderChartLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const scrollToRec = () => {
            document.getElementById('recommendations-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        window.addEventListener('leader-dashboard-scroll-recommendations', scrollToRec);
        return () => window.removeEventListener('leader-dashboard-scroll-recommendations', scrollToRec);
    }, []);

    useEffect(() => {
        const handleNav = (e) => {
            const map = {
                overview:             'dashboard-overview',
                'soft-controls':      'soft-controls-anchor',
                analytics:            'analytics-anchor',
                'question-insights':  'question-insights-anchor',
                recommendations:      'recommendations-anchor',
            };
            const el = document.getElementById(map[e.detail?.section]);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        window.addEventListener('leader-dashboard-nav', handleNav);
        return () => window.removeEventListener('leader-dashboard-nav', handleNav);
    }, []);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#6b7280' }}>Loading dashboard…</p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', gap: 20,
            fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
            position: 'relative',
        }}>
            {/* ── Full-page background image ── */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                backgroundImage: `url(${dashImg})`,
                backgroundSize: 'cover', backgroundPosition: 'center top',
                backgroundAttachment: 'fixed',
                
            }} />
            {/* All content sits above the background */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
                @keyframes slideR  { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
                @keyframes shimmerSlide {
                    0%   { transform: translateX(-100%) skewX(-12deg); }
                    100% { transform: translateX(220%)  skewX(-12deg); }
                }
                * { font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif !important; }

                .card {
                    background: #ffffff;
                    border: 1px solid #ebebeb;
                    border-radius: 14px;
                    padding: 22px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
                    transition: box-shadow .2s ease, transform .2s ease;
                    position: relative;
                    overflow: hidden;
                }
                .card::before { display: none; }
                .card::after  { display: none; }
                .card:hover {
                    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                    transform: translateY(-2px);
                }
                .kpi-num { font-variant-numeric: tabular-nums; }
            `}</style>

            {/* ══ HERO BANNER ══ */}
            <div id="dashboard-overview" style={{
                position: 'relative', borderRadius: 20, overflow: 'hidden',
                height: 220, flexShrink: 0,
                boxShadow: '0 4px 24px rgba(15,23,42,.14)',
                animation: 'fadeIn .5s ease both',
            }}>
                <img src={dashImg} alt="Leadership meeting"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }} />
                {/* semi-transparent dark overlay — text readable, faces visible */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(10,14,35,.60) 0%, rgba(10,14,35,.28) 50%, rgba(10,14,35,.04) 100%)' }} />

                <div style={{ position: 'relative', zIndex: 1, padding: '32px 44px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(167,139,250,.95)', textTransform: 'uppercase', letterSpacing: '.18em', margin: 0, animation: 'slideR .5s ease .05s both', opacity: 0 }}>
                        Executive Leadership View &nbsp;·&nbsp;
                    </p>
                    <h1 style={{ fontSize: 34, fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.1, letterSpacing: '-.02em', animation: 'slideR .5s ease .15s both', opacity: 0 }}>
                        Risk Culture Dashboard
                    </h1>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', margin: 0, maxWidth: 460, lineHeight: 1.7, fontWeight: 400, animation: 'slideR .5s ease .25s both', opacity: 0 }}>
                        Enable leaders to proactively identify, prioritize, and address risk culture gaps with clarity and precision.
                    </p>
                </div>
            </div>

            {/* ══ KPI ROW ══ */}
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 1fr 1fr', gap: 16, alignItems: 'stretch' }}>
                <RCIGauge score={kpiData.rci} />

                {/* ── Respondents ── */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0, animation: 'fadeUp .4s ease .1s both', opacity: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}><Users size={15}/></div>
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

                {/* ── Strong Controls ── */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0, animation: 'fadeUp .4s ease .2s both', opacity: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}><Activity size={15}/></div>
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

                {/* ── Needs Attention ── */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0, animation: 'fadeUp .4s ease .3s both', opacity: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}><AlertTriangle size={15}/></div>
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

            {/* ── Row: Soft Control Bar Chart + Leadership vs Employee ── */}
            <div id="soft-controls-anchor" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                {/* Bar Chart */}
                <div className="card" style={{ animation: 'fadeUp .45s ease .15s both' }}>
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
                <div id="leadership-alignment" className="card">
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
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <SpiderChartWithDimensions radarData={radarData} selectedControl={selectedControl} setSelectedControl={setSelectedControl} dimensionData={dimensionData} />
            </div>

            {/* ── Row: Pie + Function Radar ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                {/* Incident Reporting Pie */}
                <div id="analytics-anchor" className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Analytics</p>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Incident Reporting Preferences</h2>
                    <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>How employees prefer to report risk incidents</p>

                    {/* Donut — slightly smaller to leave room for legend */}
                    <div style={{ height: 190, width: '100%', flexShrink: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={reportingData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={3} label={false}>
                                    {reportingData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                </Pie>
                                <RechartsTooltip formatter={(v, n) => [`${Math.round((v / reportingData.reduce((a, b) => a + b.value, 0)) * 100)}%`, n]} contentStyle={{ borderRadius: 10, border: '1px solid #e8eaf0', fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Single-column legend — all 5 items vertical, no wrapping */}
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
            <div id="question-insights-anchor">
                <QuestionInsightsSection />
            </div>
{/* 
            <div id="question-insights-anchor">
             <PolicyGapDashboard />
            </div> */}

            {/* ── Recommendations ── */}
            <div id="recommendations-anchor">
                <RecommendationsSection />
            </div>
            
            </div>{/* end content wrapper */}
        </div>

        
    );
};

export default LeaderDashboard;







