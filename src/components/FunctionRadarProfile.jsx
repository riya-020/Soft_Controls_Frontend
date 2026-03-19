import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip as RechartsTooltip, Legend
} from 'recharts';

const METRICS = [
    'Achievability', 'Call someone to account', 'Clarity', 'Commitment',
    'Discussability', 'Enforcement', 'Role Modelling', 'Transparency'
];

// Fallback data computed from AllResponses + Functions sheets
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

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const diff = data.score - data.orgAvg;
        return (
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 6, padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: 200 }}>
                <p style={{ fontWeight: 700, color: '#001B41', marginBottom: 8, borderBottom: '1px solid #f0f0f0', paddingBottom: 6 }}>{data.metric}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
                        <span style={{ fontSize: 12, color: '#00338D', fontWeight: 600 }}>Selected Function</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#00338D' }}>{data.score}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
                        <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>Org Average</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>{data.orgAvg}</span>
                    </div>
                    <div style={{ marginTop: 4, paddingTop: 6, borderTop: '1px solid #f0f0f0' }}>
                        <span style={{ fontSize: 11, color: diff >= 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                            {diff >= 0 ? `▲ ${diff} above org avg` : `▼ ${Math.abs(diff)} below org avg`}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const FunctionRadarProfile = () => {
    const [functions,        setFunctions]        = useState(Object.keys(FALLBACK_FUNC_DATA));
    const [selectedFunction, setSelectedFunction] = useState('Audit');
    const [funcScores,       setFuncScores]       = useState(FALLBACK_FUNC_DATA);
    const [orgAverages,      setOrgAverages]      = useState(FALLBACK_ORG);
    const [isLoading,        setIsLoading]        = useState(true);
    const [error,            setError]            = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`/data/soft_control_data1.xlsx?v=${Date.now()}`);
                if (!res.ok) throw new Error('Failed to fetch Excel');
                const buf = await res.arrayBuffer();
                const wb  = XLSX.read(buf, { type: 'array' });

                // ── 1. Read org averages directly from SOFT CONTROL SCORECARD ──
                const computedOrg = {};
                if (wb.SheetNames.includes('SOFT CONTROL SCORECARD')) {
                    const rows = XLSX.utils.sheet_to_json(wb.Sheets['SOFT CONTROL SCORECARD']);
                    rows.forEach(row => {
                        const sc    = String(row['SoftControl'] || '').trim();
                        const score = parseFloat(row['AvgScore100']);
                        if (sc && sc !== 'SoftControl' && !isNaN(score) && score > 0) {
                            computedOrg[sc] = Math.round(score);
                        }
                    });
                }
                console.log('[RadarProfile] Org averages from SOFT CONTROL SCORECARD:', computedOrg);

                // ── 2. Build respondent → function map from Functions sheet ──
                const funcMap = {};
                if (wb.SheetNames.includes('Functions')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['Functions']).forEach(row => {
                        const rid = String(row['RespondentID'] || '').trim();
                        const fn  = String(row['Function']    || '').trim();
                        if (rid && fn) funcMap[rid] = fn;
                    });
                }

                // ── 3. Compute function x SC averages from AllResponses ──
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

                console.log('[RadarProfile] Computed from Excel — functions:', uniqueFunctions, '| org avgs:', computedOrg);
                if (uniqueFunctions.length > 0) {
                    setFunctions(uniqueFunctions);
                    setSelectedFunction(uniqueFunctions[0]);
                    setFuncScores(computedFuncScores);
                    setOrgAverages(Object.keys(computedOrg).length > 0 ? computedOrg : FALLBACK_ORG);
                }

            } catch (err) {
                console.error(err);
                setError(err.message);
                // fallbacks already set as initial state
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    // Build chartData from selected function
    const chartData = METRICS.map(metric => {
        const fnScores = funcScores[selectedFunction] || {};
        // case-insensitive lookup
        const scoreKey = Object.keys(fnScores).find(k => k.toLowerCase() === metric.toLowerCase());
        const orgKey   = Object.keys(orgAverages).find(k => k.toLowerCase() === metric.toLowerCase());
        return {
            metric,
            score:  scoreKey ? fnScores[scoreKey]   : 0,
            orgAvg: orgKey   ? orgAverages[orgKey]  : 75,
        };
    });

    const aboveAvg = chartData.filter(d => d.score >= d.orgAvg).length;
    const belowAvg = chartData.length - aboveAvg;

    if (isLoading) return (
        <div className="bg-white border border-gray-200 p-6 shadow-card rounded-md flex justify-center items-center h-64">
            <svg className="animate-spin h-6 w-6 text-kpmg-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
        </div>
    );

    return (
        <div className="bg-white border border-gray-200 border-t-4 border-t-kpmg-navy p-6 shadow-card rounded-b-md w-full">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div>
                    <h2 className="text-lg font-bold text-kpmg-navy">Soft Control Radar Profile</h2>
                    <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Function score vs organisation average</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ background: '#dcfce7', borderRadius: 20, padding: '4px 12px' }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>▲ {aboveAvg} above avg</span>
                        </div>
                        <div style={{ background: '#fee2e2', borderRadius: 20, padding: '4px 12px' }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626' }}>▼ {belowAvg} below avg</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', whiteSpace: 'nowrap' }}>Select Function:</label>
                        <div style={{ position: 'relative' }}>
                            <select value={selectedFunction} onChange={e => setSelectedFunction(e.target.value)}
                                style={{ appearance: 'none', background: '#fff', border: '1px solid #D1D5DB', borderRadius: 6, color: '#001B41', fontSize: 14, fontWeight: 600, padding: '8px 36px 8px 12px', cursor: 'pointer', minWidth: 160 }}>
                                {functions.map((f, i) => <option key={i} value={f}>{f}</option>)}
                            </select>
                            <div style={{ pointerEvents: 'none', position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="#00338D"><path d="M6 8L1 3h10z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && <div className="bg-yellow-50 text-yellow-700 p-3 border-l-4 border-yellow-400 mb-4 text-sm">Using fallback data: {error}</div>}

            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                {/* Radar */}
                <div style={{ flex: '1 1 400px', height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="68%" data={chartData}>
                            <PolarGrid stroke="#E5E7EB" gridType="polygon" />
                            <PolarAngleAxis dataKey="metric" tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 500 }} />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickCount={6} />
                            <Radar name="Org Average" dataKey="orgAvg" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 4" fill="#f59e0b" fillOpacity={0.08} />
                            <Radar name={selectedFunction || 'Function'} dataKey="score" stroke="#00338D" strokeWidth={2.5} fill="#0091DA" fillOpacity={0.35} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: 12 }}
                                formatter={v => <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>{v}</span>} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Score table */}
                <div style={{ flex: '0 0 220px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Score Breakdown</p>
                    {chartData.map((d, i) => {
                        const diff = d.score - d.orgAvg;
                        const color = diff >= 0 ? '#22c55e' : '#ef4444';
                        return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', background: i % 2 === 0 ? '#F9FAFB' : '#fff', borderRadius: 4 }}>
                                <span style={{ fontSize: 11, color: '#374151', fontWeight: 500, flex: 1 }}>{d.metric}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#00338D', minWidth: 24, textAlign: 'right' }}>{d.score}</span>
                                    <span style={{ fontSize: 10, fontWeight: 700, color, minWidth: 28, textAlign: 'right' }}>{diff >= 0 ? `+${diff}` : diff}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FunctionRadarProfile;