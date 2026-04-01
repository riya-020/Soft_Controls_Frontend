import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, Legend, Cell, PieChart, Pie
} from 'recharts';
import * as XLSX from 'xlsx';
import FunctionRadarProfile from '../../components/FunctionRadarProfile';
import SpiderChartWithDimensions from '../../components/SpiderChartWithDimensions';
import RecommendationsSection from '../../components/RecommendationSection';
import QuestionInsightsSection from '../../components/QuestionInsightsSection';

// ─── Only truly static things (colors, labels) ───────────────────────────────
const PILLAR_COLORS = {
    'Role Modelling': '#B5C833',
    'Discussability': '#8CC05A',
    'Achievability': '#63B06E',
    'Enforcement': '#45A07A',
    'Clarity': '#338F86',
    'Transparency': '#437F8A',
    'Commitment': '#54708C',
    'Call Someone to Account': '#545083'
};

const PARAM_MAP = {
    role_modelling: 'Role Modelling',
    open_to_discussion: 'Discussability',
    achievability: 'Achievability',
    enforcement: 'Enforcement',
    clarity: 'Clarity',
    transparency: 'Transparency',
    commitment: 'Commitment',
    call_someone_to_account: 'Call Someone to Account'
};

const premiumPanelClass = 'premium-panel bg-[#fbfcff] border border-[#e8edf7] rounded-[32px] shadow-[0_18px_38px_rgba(15,23,42,0.06)]';
const premiumCardStyle = {
    background: '#ffffff',
    borderRadius: 28,
    padding: '14px 14px 12px',
    boxShadow: '0 10px 22px rgba(15, 23, 42, 0.045)',
    border: '1px solid #e8edf7',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease'
};

// normalize SC name from Excel to display key
const normSC = (n) => {
    const map = {
        'call someone to account': 'Call Someone to Account',
        'role modelling': 'Role Modelling',
        discussability: 'Discussability',
        achievability: 'Achievability',
        enforcement: 'Enforcement',
        clarity: 'Clarity',
        transparency: 'Transparency',
        commitment: 'Commitment'
    };
    return map[(n || '').toLowerCase().trim()] || n;
};

// ─── Clickable Donut Ring ─────────────────────────────────────────────────────
const ClickableDonutRing = ({ name, score, color, isSelected, onClick }) => {
    const size = 120;
    const sw = isSelected ? 13 : 10;
    const r = (size - sw) / 2;
    const circ = 2 * Math.PI * r;

    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                transform: isSelected ? 'scale(1.08)' : 'scale(1)'
            }}
        >
            <div style={{ position: 'relative', width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={r}
                        fill="none"
                        stroke={isSelected ? color : '#E5E7EB'}
                        strokeWidth={sw}
                        opacity={isSelected ? 0.25 : 1}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={r}
                        fill="none"
                        stroke={color}
                        strokeWidth={sw}
                        strokeDasharray={`${(score / 100) * circ} ${circ}`}
                        strokeLinecap="round"
                    />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color, fontFamily: 'Georgia, serif' }}>{Math.round(score)}</span>
                </div>
                {isSelected && (
                    <div
                        style={{
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            width: 16,
                            height: 16,
                            background: color,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>✓</span>
                    </div>
                )}
            </div>
            <p
                style={{
                    fontSize: 12,
                    fontWeight: isSelected ? 700 : 600,
                    color: isSelected ? color : '#001B41',
                    textAlign: 'center',
                    margin: 0,
                    maxWidth: 100,
                    lineHeight: 1.3
                }}
            >
                {name}
            </p>
            <div style={{ width: 80, height: 3, background: '#E5E7EB', borderRadius: 2 }}>
                <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 2 }} />
            </div>
        </div>
    );
};

// ─── Donut Function Section (fully live) ─────────────────────────────────────
const DonutFunctionSection = ({ functionData, dimensionData }) => {
    const [selectedFunction, setSelectedFunction] = useState('');
    const [selectedPillar, setSelectedPillar] = useState(null);

    const functions = Object.keys(functionData);

    useEffect(() => {
        if (functions.length > 0 && !selectedFunction) setSelectedFunction(functions[0]);
    }, [functions, selectedFunction]);

    const pillars = selectedFunction && functionData[selectedFunction]
        ? Object.entries(functionData[selectedFunction]).map(([name, score]) => ({
            name: normSC(name),
            score,
            color: PILLAR_COLORS[normSC(name)] || '#00338D'
        }))
        : [];

    const dims = selectedPillar ? (dimensionData[selectedPillar] || []) : [];

    if (functions.length === 0) return null;

    return (
        <div className={`${premiumPanelClass} border-t-4 border-t-kpmg-navy p-6`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 className="text-lg font-bold text-kpmg-navy mb-1">Soft Control Score Overview</h2>
                    <p className="text-sm text-gray-500">Click any ring to see its dimension breakdown</p>
                </div>
                <select
                    value={selectedFunction}
                    onChange={(e) => {
                        setSelectedFunction(e.target.value);
                        setSelectedPillar(null);
                    }}
                    style={{
                        border: '1px solid #D1D5DB',
                        borderRadius: 4,
                        padding: '8px 36px 8px 12px',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#001B41',
                        background: '#fff',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundImage:
                            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%2300338D\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        minWidth: 160
                    }}
                >
                    {functions.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px 16px', marginTop: 32 }}>
                {pillars.slice(0, 4).map((p, i) => (
                    <ClickableDonutRing
                        key={i}
                        name={p.name}
                        score={p.score}
                        color={p.color}
                        isSelected={selectedPillar === p.name}
                        onClick={() => setSelectedPillar((prev) => (prev === p.name ? null : p.name))}
                    />
                ))}
            </div>

            <div style={{ height: 1, background: '#F3F4F6', margin: '32px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px 16px' }}>
                {pillars.slice(4, 8).map((p, i) => (
                    <ClickableDonutRing
                        key={i}
                        name={p.name}
                        score={p.score}
                        color={p.color}
                        isSelected={selectedPillar === p.name}
                        onClick={() => setSelectedPillar((prev) => (prev === p.name ? null : p.name))}
                    />
                ))}
            </div>

            {selectedPillar && dims.length > 0 && (
                <div style={{ marginTop: 32, animation: 'fadeInDim 0.25s ease' }}>
                    <div style={{ height: 1, background: '#E5E7EB', marginBottom: 20 }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div>
                            <p style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Dimension Breakdown</p>
                            <p style={{ fontSize: 16, fontWeight: 700, color: PILLAR_COLORS[selectedPillar] || '#00338D' }}>{selectedPillar}</p>
                        </div>
                        <button
                            onClick={() => setSelectedPillar(null)}
                            style={{ background: '#F3F4F6', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: '#6B7280', cursor: 'pointer' }}
                        >
                            Close ×
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                        {dims.map((dim, i) => {
                            const sc = dim.score >= 80 ? '#22c55e' : dim.score >= 70 ? '#f59e0b' : '#ef4444';
                            const rl = dim.score >= 80 ? 'Low Risk' : dim.score >= 70 ? 'Medium' : 'High Risk';
                            const color = PILLAR_COLORS[selectedPillar] || '#00338D';

                            return (
                                <div key={i} style={{ background: '#F9FAFB', borderRadius: 8, padding: '14px 16px', border: '1px solid #E5E7EB', borderLeft: `3px solid ${color}` }}>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 10, lineHeight: 1.4 }}>{dim.name}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                        <span style={{ fontSize: 20, fontWeight: 700, color: sc, fontFamily: 'Georgia, serif' }}>{dim.score}</span>
                                        <span style={{ fontSize: 10, fontWeight: 700, color: sc, background: `${sc}22`, padding: '2px 8px', borderRadius: 12 }}>{rl}</span>
                                    </div>
                                    <div style={{ height: 4, background: '#E5E7EB', borderRadius: 2, marginBottom: 4 }}>
                                        <div style={{ width: `${dim.score}%`, height: '100%', background: sc, borderRadius: 2, transition: 'width 0.5s ease' }} />
                                    </div>
                                    <span style={{ fontSize: 10, color: '#9CA3AF' }}>{dim.favorable}% favorable</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <style>{'@keyframes fadeInDim { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }'}</style>
        </div>
    );
};

// ─── RCI Gauge Component ─────────────────────────────────────────────────────
const RCIGauge = ({ score }) => {
    const [tooltip, setTooltip] = React.useState(null);

    const W = 190;
    const H = 105;
    const cx = W / 2;
    const cy = H - 8;
    const R = 72;
    const rInner = 48;
    const toRad = (deg) => (deg * Math.PI) / 180;

    const segments = [
        { from: 0, to: 60, color: '#ef4444', label: 'High Risk', desc: 'Below 60' },
        { from: 60, to: 70, color: '#f59e0b', label: 'Medium Risk', desc: '60 – 70' },
        { from: 70, to: 100, color: '#22c55e', label: 'Low Risk', desc: 'Above 70' }
    ];

    const arcPath = (fromScore, toScore, outerR, innerR) => {
        const a1 = toRad(180 - (fromScore / 100) * 180);
        const a2 = toRad(180 - (toScore / 100) * 180);
        const x1o = cx + outerR * Math.cos(a1);
        const y1o = cy - outerR * Math.sin(a1);
        const x2o = cx + outerR * Math.cos(a2);
        const y2o = cy - outerR * Math.sin(a2);
        const x1i = cx + innerR * Math.cos(a1);
        const y1i = cy - innerR * Math.sin(a1);
        const x2i = cx + innerR * Math.cos(a2);
        const y2i = cy - innerR * Math.sin(a2);
        return `M ${x1o} ${y1o} A ${outerR} ${outerR} 0 0 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${innerR} ${innerR} 0 0 0 ${x1i} ${y1i} Z`;
    };

    const scoreAngle = 180 - (score / 100) * 180;
    const scoreRad = toRad(scoreAngle);
    const needleLen = R - 8;
    const needleX = cx + needleLen * Math.cos(scoreRad);
    const needleY = cy - needleLen * Math.sin(scoreRad);

    const riskLabel = score >= 70 ? 'Low Risk' : score >= 60 ? 'Medium Risk' : 'High Risk';
    const riskCol = score >= 70 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

    return (
        <div className="premium-kpi-card" style={{ ...premiumCardStyle, minHeight: 186, borderTop: '4px solid #f97316', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px', alignSelf: 'flex-start' }}>Risk Culture Index</p>
            <div style={{ position: 'relative' }}>
                <svg width={W} height={H + 8} viewBox={`0 0 ${W} ${H + 8}`}>
                    <path d={arcPath(0, 100, R, rInner)} fill="#F3F4F6" />
                    {segments.map((s, i) => (
                        <path
                            key={i}
                            d={arcPath(s.from, s.to, R, rInner)}
                            fill={s.color}
                            opacity={tooltip?.label === s.label ? 1 : 0.82}
                            style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
                            onMouseEnter={(e) => setTooltip({ label: s.label, desc: s.desc, color: s.color, x: e.clientX, y: e.clientY })}
                            onMouseLeave={() => setTooltip(null)}
                        />
                    ))}
                    {[60, 70].map((v) => {
                        const a = toRad(180 - (v / 100) * 180);
                        return (
                            <line
                                key={v}
                                x1={cx + (rInner - 2) * Math.cos(a)}
                                y1={cy - (rInner - 2) * Math.sin(a)}
                                x2={cx + (R + 2) * Math.cos(a)}
                                y2={cy - (R + 2) * Math.sin(a)}
                                stroke="white"
                                strokeWidth={2}
                            />
                        );
                    })}
                    <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="#1F2937" strokeWidth={3} strokeLinecap="round" />
                    <circle cx={cx} cy={cy} r={7} fill="#1F2937" />
                    <circle cx={cx} cy={cy} r={3} fill="white" />
                    <text x={8} y={cy + 16} fontSize={9} fill="#6B7280" fontWeight={600}>High</text>
                    <text x={cx - 8} y={14} fontSize={9} fill="#6B7280" fontWeight={600}>Medium</text>
                    <text x={W - 26} y={cy + 16} fontSize={9} fill="#6B7280" fontWeight={600}>Low</text>
                </svg>

                {tooltip && (
                    <div style={{ position: 'fixed', top: tooltip.y - 60, left: tooltip.x - 60, background: '#1F2937', color: '#fff', borderRadius: 6, padding: '6px 12px', fontSize: 11, pointerEvents: 'none', zIndex: 999, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                        <div style={{ fontWeight: 700, color: tooltip.color, marginBottom: 2 }}>{tooltip.label}</div>
                        <div style={{ color: '#D1D5DB' }}>{tooltip.desc}</div>
                    </div>
                )}
            </div>

            <div style={{ marginTop: -4, textAlign: 'center' }}>
                <span style={{ fontSize: 30, fontWeight: 700, color: riskCol, fontFamily: 'Georgia, serif' }}>{score}</span>
            </div>
            <div style={{ marginTop: 4, background: `${riskCol}22`, borderRadius: 12, padding: '3px 14px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: riskCol }}>{riskLabel}</span>
            </div>

            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 3, alignSelf: 'flex-start' }}>
                {[
                    ['#22c55e', 'Low Risk', 'above 70'],
                    ['#f59e0b', 'Medium Risk', '60 – 70'],
                    ['#ef4444', 'High Risk', 'below 60']
                ].map(([c, l, d], i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: c, flexShrink: 0 }} />
                        <span style={{ fontSize: 10, color: '#374151', fontWeight: 600 }}>{l}</span>
                        <span style={{ fontSize: 10, color: '#9CA3AF' }}>— {d}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const LeaderDashboard = () => {
    const [pillarsData, setPillarsData] = useState([]);
    const [radarData, setRadarData] = useState([]);
    const [dimensionData, setDimensionData] = useState({});
    const [functionData, setFunctionData] = useState({});
    const [kpiData, setKpiData] = useState({
        rci: 0,
        respondents: 0,
        totalQuestions: 0,
        strongControls: { count: 0, items: [] },
        weakControls: { count: 0, items: [] }
    });
    const [employeeLeaderData, setEmployeeLeaderData] = useState([]);
    const [selectedControl, setSelectedControl] = useState(null);
    const [toneAtTopIndex, setToneAtTopIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [leaderChartLoading, setLeaderChartLoading] = useState(true);
    const [activeDashboardView, setActiveDashboardView] = useState('overview');

    const reportingData = [
        { name: 'HR Department', value: 6 },
        { name: 'Manager', value: 8 },
        { name: 'Digital Incident Reporting Tool', value: 4 },
        { name: 'Anonymous', value: 3 },
        { name: 'I choose not to report', value: 4 }
    ];
    const PIE_COLORS = ['#00338D', '#0091DA', '#00C896', '#FFB020', '#A78BFA'];

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/data/soft_control_data1.xlsx');
                if (!res.ok) throw new Error('Excel not found');
                const buf = await res.arrayBuffer();
                const wb = XLSX.read(buf, { type: 'array' });

                let loadedPillars = [];
                if (wb.SheetNames.includes('SOFT CONTROL SCORECARD')) {
                    const rows = XLSX.utils.sheet_to_json(wb.Sheets['SOFT CONTROL SCORECARD']);
                    rows.forEach((row) => {
                        const name = normSC(String(row.SoftControl || '').trim());
                        const score = parseFloat(row.AvgScore100);
                        if (name && !Number.isNaN(score) && score > 0 && name !== 'SoftControl') {
                            loadedPillars.push({ name, score: Math.round(score), fill: PILLAR_COLORS[name] || '#00338D' });
                        }
                    });
                }
                setPillarsData(loadedPillars);

                let rci = 0;
                let respondents = 0;
                let totalQuestions = 0;
                if (wb.SheetNames.includes('Culture_Risk_Index')) {
                    const rows = XLSX.utils.sheet_to_json(wb.Sheets.Culture_Risk_Index, { header: 1 });
                    rows.forEach((row) => {
                        if (row[0] === 'Total Respondents' && typeof row[1] === 'number') respondents = row[1];
                        if (row[0] === 'Total Questions' && typeof row[1] === 'number') totalQuestions = row[1];
                        if (typeof row[15] === 'number' && row[15] > 1) rci = Math.round(row[15]);
                    });
                }

                if (wb.SheetNames.includes('Functions')) {
                    const rows = XLSX.utils.sheet_to_json(wb.Sheets.Functions);
                    respondents = rows.filter((r) => r.RespondentID).length;
                }

                const sorted = [...loadedPillars].sort((a, b) => b.score - a.score);
                const strongTop3 = sorted.slice(0, 3);
                const weakBottom2 = sorted.slice(-2).reverse();

                setKpiData({
                    rci: rci || 77,
                    respondents,
                    totalQuestions,
                    strongControls: { count: 3, items: strongTop3.map((p) => p.name) },
                    weakControls: { count: 2, items: weakBottom2.map((p) => p.name) }
                });

                let loadedRadar = [];
                if (wb.SheetNames.includes('Radar Chart')) {
                    const rows = XLSX.utils.sheet_to_json(wb.Sheets['Radar Chart']);
                    let inData = false;
                    rows.forEach((row) => {
                        const vals = Object.values(row);
                        const first = String(vals[0]);
                        if (first === 'SoftControl') { inData = true; return; }
                        if (first === 'Role Modelling' && typeof vals[1] === 'number') inData = true;
                        if (inData && first && first !== 'SoftControl') {
                            loadedRadar.push({
                                metric: first,
                                score: parseFloat(row.__EMPTY_2) || 0,
                                lowRisk: parseFloat(row.Score) || 100,
                                mediumRisk: parseFloat(row.__EMPTY) || 80,
                                highRisk: parseFloat(row.__EMPTY_1) || 70
                            });
                        }
                    });
                }
                if (loadedRadar.length === 0) {
                    loadedRadar = loadedPillars.map((p) => ({
                        metric: p.name,
                        score: p.score,
                        lowRisk: 100,
                        mediumRisk: 80,
                        highRisk: 70
                    }));
                }
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
                            if (found) {
                                found.score = Math.round(sc);
                                found.favorable = fp;
                            }
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
                setKpiData({
                    rci: 77,
                    respondents: 25,
                    totalQuestions: 32,
                    strongControls: { count: 2, items: ['Discussability', 'Enforcement'] },
                    weakControls: { count: 3, items: ['Call Someone to Account', 'Achievability', 'Clarity'] }
                });
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

                setEmployeeLeaderData(
                    leaderScores.map((item) => ({
                        control: PARAM_MAP[item.Parameter] || item.Parameter,
                        leader: Math.round(item.LeadershipScore_0_100),
                        employee: empMap[PARAM_MAP[item.Parameter]] || 0
                    }))
                );
            } catch {
                setEmployeeLeaderData([
                    { control: 'Role Modelling', employee: 78, leader: 84 },
                    { control: 'Discussability', employee: 81, leader: 85 },
                    { control: 'Achievability', employee: 75, leader: 79 },
                    { control: 'Enforcement', employee: 78, leader: 82 },
                    { control: 'Clarity', employee: 76, leader: 80 },
                    { control: 'Transparency', employee: 76, leader: 83 },
                    { control: 'Commitment', employee: 77, leader: 81 },
                    { control: 'Call Someone to Account', employee: 73, leader: 78 }
                ]);
            } finally {
                setLeaderChartLoading(false);
            }
        };

        load();
    }, []);

    useEffect(() => {
        const scrollToRecommendations = () => {
            const el = document.getElementById('recommendations-section');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        window.addEventListener('leader-dashboard-scroll-recommendations', scrollToRecommendations);
        return () => window.removeEventListener('leader-dashboard-scroll-recommendations', scrollToRecommendations);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl font-bold text-kpmg-navy">Loading Dashboard Data...</div>
            </div>
        );
    }

    const targetPopulation = kpiData.respondents + 225;
    const coverageRate = targetPopulation > 0 ? Math.round((kpiData.respondents / targetPopulation) * 100) : 0;
    const coverageColor = coverageRate >= 60 ? '#22c55e' : coverageRate >= 30 ? '#f59e0b' : '#ef4444';

    const scrollToDashboardSection = (view) => {
        setActiveDashboardView(view);
        const sectionMap = {
            overview: 'dashboard-overview',
            'soft-controls': 'soft-controls-anchor',
            analytics: 'analytics-anchor',
            'question-insights': 'question-insights-anchor',
        };
        const section = document.getElementById(sectionMap[view]);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="space-y-6 text-slate-900">
            <style>{`
                .dashboard-shell { position: relative; }
                .dashboard-shell::before {
                    content: '';
                    position: absolute;
                    inset: -40px -24px auto auto;
                    width: 320px;
                    height: 320px;
                    border-radius: 999px;
                    background: radial-gradient(circle, rgba(37,99,235,0.12), transparent 68%);
                    pointer-events: none;
                }
                .dashboard-topbar {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 16px;
                    padding: 0 4px 16px;
                    margin-bottom: 2px;
                    flex-wrap: wrap;
                }
                .dashboard-chip-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                    width: fit-content;
                    padding: 8px;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.82);
                    border: 1px solid rgba(232,237,247,0.96);
                    box-shadow: 0 12px 28px rgba(15,23,42,0.06);
                    backdrop-filter: blur(10px);
                }
                .dashboard-chip {
                    appearance: none;
                    border: 1px solid #eaedf4;
                    background: #f7f8fc;
                    color: #49526a;
                    border-radius: 999px;
                    padding: 10px 18px;
                    font-size: 13px;
                    font-weight: 600;
                    line-height: 1;
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
                    transition: all 0.25s ease;
                }
                .dashboard-chip.is-active {
                    background: linear-gradient(135deg, #111111, #242b42);
                    color: white;
                    box-shadow: 0 14px 30px rgba(15,23,42,0.16);
                    border-color: rgba(17,17,17,0.92);
                }
                .dashboard-chip:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 10px 20px rgba(15,23,42,0.08);
                }
                .dashboard-hero {
                    position: relative;
                    overflow: hidden;
                    border-radius: 36px;
                    padding: 28px 30px;
                    background:
                        radial-gradient(circle at top left, rgba(34,211,238,0.18), transparent 30%),
                        radial-gradient(circle at top right, rgba(109,40,217,0.16), transparent 32%),
                        linear-gradient(180deg, #ffffff 0%, #f6f8fd 100%);
                    border: 1px solid #e8edf7;
                    box-shadow: 0 22px 48px rgba(15, 23, 42, 0.06);
                }
                .dashboard-hero::after {
                    content: '';
                    position: absolute;
                    inset: auto -10% -55% 30%;
                    height: 240px;
                    background: radial-gradient(circle, rgba(14,165,233,0.18), transparent 62%);
                    pointer-events: none;
                }
                .premium-panel {
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
                }
                .premium-panel::before,
                .premium-kpi-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.42) 50%, transparent 80%);
                    transform: translateX(-130%);
                    transition: transform 0.8s ease;
                    pointer-events: none;
                }
                .premium-panel:hover,
                .premium-kpi-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 26px 44px rgba(15, 23, 42, 0.1);
                    border-color: rgba(99, 102, 241, 0.18);
                }
                .premium-panel:hover::before,
                .premium-kpi-card:hover::before { transform: translateX(130%); }
                .report-cta { position: relative; overflow: hidden; }
                .report-cta::before {
                    content: '';
                    position: absolute;
                    inset: -120% auto auto -40%;
                    width: 42%;
                    height: 320%;
                    background: linear-gradient(115deg, transparent, rgba(255,255,255,0.8), transparent);
                    transform: rotate(18deg) translateX(-180%);
                    transition: transform 0.85s ease;
                }
                .report-cta:hover::before { transform: rotate(18deg) translateX(420%); }
                @media (max-width: 768px) {
                    .dashboard-topbar { padding-bottom: 10px; }
                    .dashboard-hero { padding: 22px; border-radius: 28px; }
                    .dashboard-chip-row { width: 100%; justify-content: center; }
                }
            `}</style>

            <div className="dashboard-shell" id="dashboard-overview">
                <section className="dashboard-topbar">
                    <div className="dashboard-chip-row">
                        <button type="button" onClick={() => scrollToDashboardSection('overview')} className={`dashboard-chip ${activeDashboardView === 'overview' ? 'is-active' : ''}`}>Overview</button>
                        <button type="button" onClick={() => scrollToDashboardSection('soft-controls')} className={`dashboard-chip ${activeDashboardView === 'soft-controls' ? 'is-active' : ''}`}>Soft Controls</button>
                        <button type="button" onClick={() => scrollToDashboardSection('analytics')} className={`dashboard-chip ${activeDashboardView === 'analytics' ? 'is-active' : ''}`}>Analytics</button>
                        <button type="button" onClick={() => scrollToDashboardSection('question-insights')} className={`dashboard-chip ${activeDashboardView === 'question-insights' ? 'is-active' : ''}`}>Question Insights</button>
                    </div>
                </section>

                <section className="dashboard-hero">
                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <h2 className="text-[42px] leading-[1.02] font-semibold tracking-[-0.05em] text-[#121826] md:text-[54px]">
                                Leadership risk culture overview
                            </h2>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-[28px] border border-[#edf1f8] bg-white px-5 py-5 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">RCI</p>
                                <p className="mt-2 text-3xl font-bold text-[#0b1f3a]">{kpiData.rci}</p>
                                <p className="mt-1 text-xs text-slate-500">Current culture pulse</p>
                            </div>
                            <div className="rounded-[28px] border border-[#edf1f8] bg-white px-5 py-5 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Respondents</p>
                                <p className="mt-2 text-3xl font-bold text-[#0b1f3a]">{kpiData.respondents}</p>
                                <p className="mt-1 text-xs text-slate-500">Live participation count</p>
                            </div>
                            <div className="rounded-[28px] border border-[#edf1f8] bg-white px-5 py-5 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Coverage Rate</p>
                                <p className="mt-2 text-3xl font-bold" style={{ color: coverageColor }}>{coverageRate}%</p>
                                <p className="mt-1 text-xs text-slate-500">Respondents / target population</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <RCIGauge score={kpiData.rci} />

                <div className="premium-kpi-card" style={{ ...premiumCardStyle, minHeight: 186, borderTop: '4px solid #22c55e', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Strong Controls</p>
                        <div style={{ background: '#dcfce7', borderRadius: 20, padding: '2px 10px' }}><span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>Low Risk</span></div>
                    </div>
                    {(() => {
                        const total = 8;
                        const strong = kpiData.strongControls.count;
                        const size = 110;
                        const sw = 12;
                        const r = (size - sw) / 2;
                        const circ = 2 * Math.PI * r;
                        const filled = (strong / total) * circ;

                        return (
                            <div style={{ position: 'relative', width: size, height: size }}>
                                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={sw} />
                                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#22c55e" strokeWidth={sw} strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" />
                                </svg>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: 28, fontWeight: 700, color: '#16a34a', lineHeight: 1, fontFamily: 'Georgia, serif' }}>{strong}</span>
                                    <span style={{ fontSize: 10, color: '#9CA3AF' }}>of {total}</span>
                                </div>
                            </div>
                        );
                    })()}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: '100%' }}>
                        {kpiData.strongControls.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                                <span style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', lineHeight: 1.4 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="premium-kpi-card" style={{ ...premiumCardStyle, minHeight: 186, borderTop: '4px solid #ef4444', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Weak Controls</p>
                        <div style={{ background: '#fee2e2', borderRadius: 20, padding: '2px 10px' }}><span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626' }}>High Risk</span></div>
                    </div>
                    {(() => {
                        const total = 8;
                        const weak = kpiData.weakControls.count;
                        const size = 110;
                        const sw = 12;
                        const r = (size - sw) / 2;
                        const circ = 2 * Math.PI * r;
                        const filled = (weak / total) * circ;

                        return (
                            <div style={{ position: 'relative', width: size, height: size }}>
                                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={sw} />
                                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ef4444" strokeWidth={sw} strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" />
                                </svg>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: 28, fontWeight: 700, color: '#ef4444', lineHeight: 1, fontFamily: 'Georgia, serif' }}>{weak}</span>
                                    <span style={{ fontSize: 10, color: '#9CA3AF' }}>of {total}</span>
                                </div>
                            </div>
                        );
                    })()}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: '100%' }}>
                        {kpiData.weakControls.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
                                <span style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', lineHeight: 1.4 }}>{item}</span>
                            </div>
                        ))}
                        {kpiData.weakControls.items.length === 0 && <span style={{ fontSize: 11, color: '#9CA3AF' }}>All above threshold</span>}
                    </div>
                </div>

                <div className="premium-kpi-card" style={{ ...premiumCardStyle, minHeight: 186, borderTop: '4px solid #0091DA', display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Respondents</p>
                        <div style={{ background: '#e0f2fe', borderRadius: 20, padding: '2px 10px' }}><span style={{ fontSize: 11, fontWeight: 700, color: '#0091DA' }}>Live</span></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                        <span style={{ fontSize: 40, fontWeight: 700, color: '#0091DA', lineHeight: 1, fontFamily: 'Georgia, serif' }}>{kpiData.respondents}</span>
                        <span style={{ fontSize: 12, color: '#6B7280', paddingBottom: 4 }}>employees responded</span>
                    </div>
                    <div style={{ background: '#e0f2fe', borderRadius: 6, padding: '8px 10px', marginTop: 2 }}>
                        <p style={{ fontSize: 11, color: '#0369a1', margin: 0, lineHeight: 1.5 }}>Survey responses collected this cycle</p>
                    </div>
                </div>

                <div className="premium-kpi-card" style={{ ...premiumCardStyle, minHeight: 186, borderTop: '4px solid #f59e0b', display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Flagged Questions</p>
                        <div style={{ background: '#fef3c7', borderRadius: 20, padding: '2px 10px' }}><span style={{ fontSize: 11, fontWeight: 700, color: '#d97706' }}>Review</span></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                        <span style={{ fontSize: 40, fontWeight: 700, color: '#f59e0b', lineHeight: 1, fontFamily: 'Georgia, serif' }}>4</span>
                        <span style={{ fontSize: 12, color: '#6B7280', paddingBottom: 4 }}>questions</span>
                    </div>
                    <div style={{ background: '#fffbeb', borderRadius: 6, padding: '8px 10px', marginTop: 2 }}>
                        <p style={{ fontSize: 11, color: '#92400e', margin: 0, lineHeight: 1.5 }}>Require attention from risk leads before next cycle</p>
                    </div>
                </div>

                <div className="premium-kpi-card" style={{ ...premiumCardStyle, minHeight: 186, borderTop: '4px solid #00338D', display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Recommended Actions</p>
                        <div style={{ background: '#eff6ff', borderRadius: 20, padding: '2px 10px' }}><span style={{ fontSize: 11, fontWeight: 700, color: '#00338D' }}>Action</span></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                        <span style={{ fontSize: 40, fontWeight: 700, color: '#00338D', lineHeight: 1, fontFamily: 'Georgia, serif' }}>6</span>
                        <span style={{ fontSize: 12, color: '#6B7280', paddingBottom: 4 }}>actions</span>
                    </div>
                    <div style={{ background: '#eff6ff', borderRadius: 6, padding: '8px 10px', marginTop: 2 }}>
                        <p style={{ fontSize: 11, color: '#1e40af', margin: 0, lineHeight: 1.5 }}>Prioritised improvements identified for this cycle</p>
                    </div>
                </div>
            </div>

            <div id="soft-controls-anchor" className={`${premiumPanelClass} border-t-4 border-t-kpmg-blue p-6`}>
                <h2 className="text-lg font-bold text-kpmg-navy mb-6">Soft Control Performance</h2>
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pillarsData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" tickMargin={10} height={80} />
                            <YAxis domain={[0, 100]} />
                            <RechartsTooltip />
                            <Bar dataKey="score" barSize={36} radius={[4, 4, 0, 0]}>
                                {pillarsData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4 mt-4 justify-center text-xs">
                    {pillarsData.map((p, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div style={{ background: p.fill }} className="w-3 h-3 rounded-sm" />
                            <span>{p.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div id="soft-controls-thresholds">
                <SpiderChartWithDimensions
                    radarData={radarData}
                    selectedControl={selectedControl}
                    setSelectedControl={setSelectedControl}
                    dimensionData={dimensionData}
                />
            </div>

              {/* ── Key Question Insights ── */}
              <div id="question-insights-anchor">
                <QuestionInsightsSection />
            </div>

            <div id="analytics-anchor" className={`${premiumPanelClass} border-t-4 border-t-kpmg-blue p-6`}>
                <h2 className="text-lg font-bold text-kpmg-navy mb-2">Incident Reporting Preferences</h2>
                <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>How employees prefer to report risk incidents</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
                    <div style={{ flex: '0 0 280px', height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={reportingData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={75} outerRadius={120} paddingAngle={3} label={false}>
                                    {reportingData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                </Pie>
                                <RechartsTooltip formatter={(v, n) => [`${Math.round((v / reportingData.reduce((a, b) => a + b.value, 0)) * 100)}%`, n]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 220 }}>
                        {reportingData.map((entry, i) => {
                            const total = reportingData.reduce((a, b) => a + b.value, 0);
                            const p = Math.round((entry.value / total) * 100);
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 12, height: 12, borderRadius: 3, background: PIE_COLORS[i], flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{entry.name}</span>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: PIE_COLORS[i] }}>{p}%</span>
                                        </div>
                                        <div style={{ height: 4, background: '#F3F4F6', borderRadius: 2 }}>
                                            <div style={{ width: `${p}%`, height: '100%', background: PIE_COLORS[i], borderRadius: 2 }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div id="leadership-alignment" className={`${premiumPanelClass} border-t-4 border-t-kpmg-blue p-6`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-kpmg-navy">Leadership vs Employee Alignment</h2>
                    {toneAtTopIndex && (
                        <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded">
                            <span className="text-sm text-gray-500">Tone at Top Index </span>
                            <span className="text-lg font-bold text-kpmg-navy">{toneAtTopIndex}</span>
                        </div>
                    )}
                </div>

                {leaderChartLoading ? (
                    <div className="flex justify-center items-center h-40"><p className="text-gray-400 font-medium">Loading leader scores...</p></div>
                ) : (
                    <div className="h-[340px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={employeeLeaderData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }} barGap={6} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="control" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" tickMargin={10} height={80} />
                                <YAxis domain={[0, 100]} />
                                <RechartsTooltip />
                                <Legend />
                                <Bar dataKey="employee" name="Employee Score" fill="#4b85637e" barSize={32} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="leader" name="Leader Score" fill="#5e60a3ff" barSize={32} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            <FunctionRadarProfile />

            <div id="soft-controls-function">
                <DonutFunctionSection functionData={functionData} dimensionData={dimensionData} />
            </div>

            <RecommendationsSection />
        </div>
    );
};

export default LeaderDashboard;
