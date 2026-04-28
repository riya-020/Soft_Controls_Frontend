import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, Legend, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';

const PILLAR_COLORS = {
    'Role Modelling': '#1447E6',
    'Discussability': '#2563EB',
    'Achievability': '#4F46E5',
    'Enforcement': '#6D28D9',
    'Clarity': '#9333EA',
    'Transparency': '#C026D3',
    'Commitment': '#DB2777',
    'Call Someone to Account': '#EC4899',
};

const bandColor = s => s >= 80 ? '#22c55e' : s >= 70 ? '#f59e0b' : '#ef4444';
const bandBg = s => s >= 80 ? '#dcfce7' : s >= 70 ? '#fef3c7' : '#fee2e2';
const bandLabel = s => s >= 80 ? 'Low Risk' : s >= 70 ? 'Medium Risk' : 'High Risk';
const bandIcon = s => s >= 80 ? 'Low Risk' : s >= 70 ? 'Medium Risk' : 'High Risk';

// ─── Radar Tooltip ─────────────────────────────────────────────────────────
const CustomRadarTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const data = (payload.find(p => p.dataKey === 'score') || payload[0]).payload;
    return (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', minWidth: 210 }}>
            <p style={{ fontWeight: 700, color: '#001B41', marginBottom: 8, borderBottom: '1px solid #f0f0f0', paddingBottom: 6 }}>{data.metric}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#002060', fontSize: 13, marginBottom: 10 }}>
                <span>Actual Score</span><span>{data.score}</span>
            </div>
            <div style={{ fontSize: 12, color: '#4B5563', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[['#92D050', 'Low Risk', 'above', data.mediumRisk], ['#FFC000', 'Medium Risk', '', `${data.highRisk}–${data.mediumRisk}`], ['#FF0000', 'High Risk', 'below', data.highRisk]].map(([c, l, p, v], i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 10, height: 10, background: c, display: 'inline-block', borderRadius: 2 }} />
                        <span>{l} — {p} {v}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Angle Axis Tick ─────────────────────────────────────────────────────────
const CustomAngleAxisTick = React.memo(({ x, y, payload, cx, cy, selectedControl, setSelectedControl, setSelectedDim }) => {
    const isSelected = selectedControl === payload.value;
    const color = PILLAR_COLORS[payload.value] || '#00338D';
    const dx = x - cx, dy = y - cy, len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = dx / len, ny = dy / len;
    return (
        <g onClick={() => { setSelectedControl(isSelected ? null : payload.value); setSelectedDim(null); }} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r={isSelected ? 9 : 6} fill={isSelected ? color : '#fff'} stroke={color} strokeWidth={isSelected ? 3 : 2} />
            <text x={x + nx * 8} y={y + ny * 8}
                textAnchor={nx > 0.1 ? 'start' : nx < -0.1 ? 'end' : 'middle'}
                dominantBaseline={ny > 0.1 ? 'hanging' : ny < -0.1 ? 'auto' : 'middle'}
                fontSize={12} fontWeight={isSelected ? 700 : 500} fill={isSelected ? color : '#4B5563'}
                dy={ny > 0.1 ? 14 : ny < -0.1 ? -14 : 0} dx={nx > 0.1 ? 14 : nx < -0.1 ? -14 : 0}>
                {payload.value}
            </text>
        </g>
    );
});

// ─── Hover Tooltip ─────────────────────────────────────────────────────────
const HoverTooltip = React.forwardRef(({ text, visible }, ref) => {
    if (!visible || !text) return null;
    return (
        <div ref={ref} style={{
            position: 'fixed', top: 0, left: 0,
            background: '#1E293B', color: '#fff', borderRadius: 8,
            padding: '10px 14px', fontSize: 12, lineHeight: 1.6,
            maxWidth: 280, zIndex: 9999, pointerEvents: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            transform: 'translateY(-50%)',
            display: 'none', // hidden by default, shown by ref
        }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>
                📐 What this means to your organisation
            </p>
            {text}
        </div>
    );
});

// ─── Memoized Radar Chart ───────────────────────────────────────────────────
const StableRadarChart = React.memo(({ radarData, selectedControl, setSelectedControl, setSelectedDim, CustomAngleAxisTick, CustomRadarTooltip }) => {
    return (
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="metric" tick={(props) => <CustomAngleAxisTick {...props} setSelectedControl={setSelectedControl} setSelectedDim={setSelectedDim} selectedControl={selectedControl} />} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickCount={4} />
                <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#5e72e4"
                    strokeWidth={2}
                    fill="#5e72e4"
                    fillOpacity={0.05}
                    dot={{ r: 2.5, fill: '#5e72e4' }}
                    isAnimationActive={false}
                />
                <Radar
                    name="Benchmark"
                    dataKey="mediumRisk"
                    stroke="#cbd5e1"
                    strokeDasharray="3 3"
                    fill="none"
                    isAnimationActive={false}
                />
                <RechartsTooltip content={<CustomRadarTooltip />} isAnimationActive={false} />
            </RadarChart>
        </ResponsiveContainer>
    );
});

// ─── Drill-Down Panel ──────────────────────────────────────────────────────
const DimensionDrillDown = ({ dim, meta, onClose, controlColor }) => {
    if (!dim || !meta) return null;
    const score = dim.score;
    const sc = bandColor(score);
    const sb = bandBg(score);
    const rl = bandLabel(score);

    const riskStatement = score >= 80 ? meta.lowRisk : score >= 70 ? meta.medRisk : meta.highRisk;

    return (
        <div style={{ marginTop: 20, padding: '16px 20px', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ flex: 1, paddingRight: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>{dim.name}</h3>
                    <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0', fontStyle: 'italic', lineHeight: 1.3 }}>"{meta.question}"</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: sc, lineHeight: 1 }}>{score}</div>
                    <div style={{ fontSize: 9, fontWeight: 800, background: sb, color: sc, padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginTop: 3 }}>{rl}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                <div style={{ padding: '10px 14px', background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 }}>Actual Score</p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: sc, margin: 0 }}>{score}</p>
                </div>
                <div style={{ padding: '10px 14px', background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 }}>Favorable</p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: '#22c55e', margin: 0 }}>{dim.favorable}%</p>
                </div>
                <div style={{ padding: '10px 14px', background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 }}>Action Required</p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: score < 70 ? '#ef4444' : '#64748b', margin: 0 }}>{score < 70 ? 'High' : 'Low'}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ padding: '12px 14px', background: '#fff', borderRadius: 10, border: `1px solid ${controlColor}15`, borderLeft: `4px solid ${controlColor}` }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: controlColor, textTransform: 'uppercase', marginBottom: 4 }}>📐 What this means</p>
                    <p style={{ fontSize: 12, color: '#334155', lineHeight: 1.5, margin: 0 }}>{meta.what}</p>
                </div>
                <div style={{ padding: '12px 14px', background: '#fff', borderRadius: 10, border: '1px solid #f1f5f9', borderLeft: '4px solid #64748b' }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>💼 Business Impact</p>
                    <p style={{ fontSize: 12, color: '#334155', lineHeight: 1.5, margin: 0 }}>{meta.impact}</p>
                </div>
            </div>

            {riskStatement && (
                <div style={{ padding: '12px 14px', background: `${sc}10`, borderRadius: 10, border: `1px solid ${sc}20`, marginBottom: 16 }}>
                    <p style={{ fontSize: 9, fontWeight: 800, color: sc, textTransform: 'uppercase', marginBottom: 4 }}>Core Insight — {rl}</p>
                    <p style={{ fontSize: 12, color: '#0f172a', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>{riskStatement}</p>
                </div>
            )}

            <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                <span>←</span> Back to Breakdown
            </button>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────
const SpiderChartWithDimensions = ({ radarData, selectedControl, setSelectedControl, dimensionData }) => {
    const [selectedDim, setSelectedDim] = useState(null);
    const [dimMeta, setDimMeta] = useState({});
    const [hoveredDim, setHoveredDim] = useState(null);
    const drillDownRef = useRef(null);
    const tooltipRef = useRef(null);

    // Load FinalQuestions metadata from Excel
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/data/soft_control_data1.xlsx');
                if (!res.ok) return;
                const buf = await res.arrayBuffer();
                const wb = XLSX.read(buf, { type: 'array' });
                if (!wb.SheetNames.includes('FinalQuestions')) return;
                const rows = XLSX.utils.sheet_to_json(wb.Sheets['FinalQuestions']);
                const meta = {};
                rows.forEach(row => {
                    const dim = String(row['Dimensions'] || '').trim();
                    if (!dim || meta[dim]) return;
                    meta[dim] = {
                        question: String(row['QuestionText'] || '').trim(),
                        what: String(row['What it means to your organization'] || '').trim(),
                        impact: String(row['Business Impact'] || '').trim(),
                        highRisk: String(row['High Risk Statements'] || '').trim(),
                        medRisk: String(row['Med Risk Statements'] || '').trim(),
                        lowRisk: String(row['Low Risk Statements'] || '').trim(),
                    };
                });
                setDimMeta(meta);
            } catch (e) {
                console.warn('[Spider] Could not load FinalQuestions:', e);
            }
        };
        load();
    }, []);

    // Reset drill-down when control changes
    useEffect(() => { setSelectedDim(null); }, [selectedControl]);

    // Scroll to drill-down when a dim is selected
    useEffect(() => {
        if (selectedDim && drillDownRef.current) {
            setTimeout(() => {
                drillDownRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 80);
        }
    }, [selectedDim]);

    const getMetaForDim = (name) =>
        dimMeta[name]
        || dimMeta[name?.trim()]
        || Object.entries(dimMeta).find(([k]) => k.trim() === name?.trim())?.[1]
        || null;

    const handleHover = (name, e) => {
        setHoveredDim(name);
        if (tooltipRef.current) {
            tooltipRef.current.style.display = name ? 'block' : 'none';
            if (name && e) {
                tooltipRef.current.style.left = `${e.clientX + 16}px`;
                tooltipRef.current.style.top = `${e.clientY - 10}px`;
            }
        }
    };

    const handleMouseMove = (e) => {
        if (tooltipRef.current && hoveredDim) {
            tooltipRef.current.style.left = `${e.clientX + 16}px`;
            tooltipRef.current.style.top = `${e.clientY - 10}px`;
        }
    };

    const dims = selectedControl ? (dimensionData[selectedControl] || []) : [];
    const controlColor = PILLAR_COLORS[selectedControl] || '#00338D';

    return (
        <div className="bg-white border border-gray-200 border-t-4 border-t-kpmg-navy p-6 shadow-card rounded-b-md">

            {/* Hover tooltip */}
            <HoverTooltip
                ref={tooltipRef}
                text={hoveredDim ? getMetaForDim(hoveredDim)?.what : null}
                visible={!!hoveredDim}
            />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>

                {/* Spider Chart */}
                <div style={{ flex: '1 1 450px', minWidth: 300 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', textAlign: 'center', marginBottom: 2 }}>Soft Control Performance vs Risk Thresholds</h2>
                    <p style={{ fontSize: 11, color: '#64748b', textAlign: 'center', marginBottom: 6 }}>Click a label to view dimension breakdown</p>
                    <div style={{ width: '100%', height: 300 }}>
                        <StableRadarChart
                            radarData={radarData}
                            selectedControl={selectedControl}
                            setSelectedControl={setSelectedControl}
                            setSelectedDim={setSelectedDim}
                            CustomAngleAxisTick={CustomAngleAxisTick}
                            CustomRadarTooltip={CustomRadarTooltip}
                        />
                    </div>
                </div>

                {/* Dimension Panel */}
                <div style={{ flex: '0 0 260px', minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: selectedControl ? 'flex-start' : 'center', alignItems: selectedControl ? 'stretch' : 'center' }}>
                    {!selectedControl ? (
                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '24px 12px', border: '1px dashed #e2e8f0', borderRadius: 12 }}>
                            <div style={{ fontSize: 24, marginBottom: 8 }}>👆</div>
                            <p style={{ fontSize: 12, fontWeight: 500, color: '#64748b', lineHeight: 1.5 }}>Select a soft control to see dimension details</p>
                        </div>
                    ) : (
                        <div style={{ animation: 'fadeInDim 0.2s ease' }}>
                            {/* Panel header */}
                            <div style={{ background: controlColor, borderRadius: '8px 8px 0 0', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 1 }}>Breakdown</p>
                                    <p style={{ fontSize: 13, color: '#fff', fontWeight: 700, margin: 0 }}>{selectedControl}</p>
                                </div>
                                <button onClick={() => { setSelectedControl(null); setSelectedDim(null); }}
                                    style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 4, color: '#fff', fontSize: 16, cursor: 'pointer', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>×</button>
                            </div>

                            {/* Dimension rows */}
                            <div style={{ border: `1px solid #e2e8f0`, borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
                                {dims.length === 0
                                    ? <div style={{ padding: 12, color: '#94a3b8', fontSize: 12, textAlign: 'center' }}>No data available</div>
                                    : dims.map((dim, i) => {
                                        const isActive = selectedDim?.name === dim.name;
                                        const isHov = hoveredDim === dim.name;
                                        // Using consistent theme color for dimension bars
                                        const barColor = controlColor;
                                        return (
                                            <div key={i}
                                                onClick={() => setSelectedDim(isActive ? null : dim)}
                                                onMouseEnter={e => handleHover(dim.name, e)}
                                                onMouseMove={handleMouseMove}
                                                onMouseLeave={() => handleHover(null)}
                                                style={{ padding: '10px 14px', background: isActive ? `${controlColor}08` : isHov ? '#f8fafc' : '#fff', borderBottom: i < dims.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer', transition: 'all 0.1s' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                                    <p style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: '#334155', margin: 0, flex: 1, lineHeight: 1.3 }}>{dim.name}</p>
                                                    <span style={{ fontSize: 13, fontWeight: 700, color: barColor, flexShrink: 0 }}>{dim.score}</span>
                                                </div>
                                                <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2, marginBottom: 2 }}>
                                                    <div style={{ width: `${dim.score}%`, height: '100%', background: barColor, borderRadius: 2, transition: 'width 0.4s ease', opacity: 0.8 }} />
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{bandLabel(dim.score)}</span>
                                                    {dim.favorable > 0 && <span style={{ fontSize: 9, color: '#cbd5e1' }}>{dim.favorable}% fav.</span>}
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Drill-Down — full width, auto-scrolls into view */}
            {selectedControl && selectedDim && (
                <div ref={drillDownRef}>
                    <DimensionDrillDown
                        dim={selectedDim}
                        meta={getMetaForDim(selectedDim.name)}
                        controlColor={controlColor}
                        onClose={() => setSelectedDim(null)}
                    />
                </div>
            )}

            <style>{`
                @keyframes fadeInDim { from { opacity:0; transform:translateX(12px); } to { opacity:1; transform:translateX(0); } }
                @keyframes fadeInUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
            `}</style>
        </div>
    );
};

export default SpiderChartWithDimensions;
