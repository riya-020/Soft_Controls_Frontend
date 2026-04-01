import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, Legend, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';

const PILLAR_COLORS = {
    'Role Modelling':          '#B5C833',
    'Discussability':          '#8CC05A',
    'Achievability':           '#63B06E',
    'Enforcement':             '#45A07A',
    'Clarity':                 '#338F86',
    'Transparency':            '#437F8A',
    'Commitment':              '#54708C',
    'Call Someone to Account': '#545083',
};

const bandColor = s => s >= 80 ? '#22c55e' : s >= 70 ? '#f59e0b' : '#ef4444';
const bandBg    = s => s >= 80 ? '#dcfce7' : s >= 70 ? '#fef3c7' : '#fee2e2';
const bandLabel = s => s >= 80 ? 'Low Risk'  : s >= 70 ? 'Medium Risk' : 'High Risk';
const bandIcon  = s => s >= 80 ? '✅'        : s >= 70 ? '⚠️'          : '🔴';

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
                {[['#92D050','Low Risk','above',data.mediumRisk],['#FFC000','Medium Risk','',`${data.highRisk}–${data.mediumRisk}`],['#FF0000','High Risk','below',data.highRisk]].map(([c,l,p,v],i)=>(
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 10, height: 10, background: c, display: 'inline-block', borderRadius: 2 }}/>
                        <span>{l} — {p} {v}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Hover Tooltip ─────────────────────────────────────────────────────────
const HoverTooltip = ({ text, visible, x, y }) => {
    if (!visible || !text) return null;
    return (
        <div style={{
            position: 'fixed', top: y - 10, left: x + 16,
            background: '#1E293B', color: '#fff', borderRadius: 8,
            padding: '10px 14px', fontSize: 12, lineHeight: 1.6,
            maxWidth: 280, zIndex: 9999, pointerEvents: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            transform: 'translateY(-50%)',
        }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>
                📐 What this means to your organisation
            </p>
            {text}
        </div>
    );
};

// ─── Drill-Down Panel ──────────────────────────────────────────────────────
const DimensionDrillDown = ({ dim, meta, onClose, controlColor }) => {
    if (!dim || !meta) return null;
    const score = dim.score;
    const sc    = bandColor(score);
    const sb    = bandBg(score);
    const rl    = bandLabel(score);
    const icon  = bandIcon(score);

    const riskStatement = score >= 80 ? meta.lowRisk : score >= 70 ? meta.medRisk : meta.highRisk;

    return (
        <div style={{ marginTop: 24, animation: 'fadeInUp 0.25s ease' }}>
            <div style={{ height: 1, background: '#E5E7EB', marginBottom: 20 }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, padding: '16px 18px', borderRadius: 12, background: `${controlColor}08`, border: `1px solid ${controlColor}25` }}>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Dimension Deep Dive</p>
                    <p style={{ fontSize: 17, fontWeight: 800, color: '#1E293B', margin: '0 0 6px' }}>{dim.name}</p>
                    {meta.question && (
                        <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>"{meta.question}"</p>
                    )}
                </div>
                <div style={{ textAlign: 'right', marginLeft: 20, flexShrink: 0 }}>
                    <div style={{ fontSize: 38, fontWeight: 900, color: sc, lineHeight: 1 }}>{score}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: sb, color: sc, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{rl}</div>
                </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                    { label: 'Score',         value: `${score}`,            color: sc,        bg: sb        },
                    { label: 'Favorable',      value: `${dim.favorable}%`,  color: '#22c55e', bg: '#dcfce7' },
                    { label: 'Not Favorable',  value: `${Math.round(100 - dim.favorable)}%`, color: '#ef4444', bg: '#fee2e2' },
                ].map((s, i) => (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: s.bg, border: `1px solid ${s.color}20`, textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: s.color, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, marginBottom: 6 }}>{s.label}</div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* 2-col: What it means + Business Impact */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div style={{ padding: '16px 18px', borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>📐 What this means to your organisation</p>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, margin: 0 }}>{meta.what || '—'}</p>
                </div>
                <div style={{ padding: '16px 18px', borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>💼 Business Impact</p>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, margin: 0 }}>{meta.impact || '—'}</p>
                </div>
            </div>

            {/* Risk interpretation — only current band */}
            {riskStatement && (
                <div style={{ padding: '16px 18px', borderRadius: 12, background: `${sc}08`, border: `1.5px solid ${sc}30`, marginBottom: 16 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: sc, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                        {icon} {rl} — What this score means
                    </p>
                    <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: 0 }}>{riskStatement}</p>
                </div>
            )}

            {/* Back button */}
            <button onClick={onClose}
                style={{ width: '100%', padding: 11, background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#64748B', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#1E293B'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#64748B'; }}>
                ← Back to dimensions
            </button>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────
const SpiderChartWithDimensions = ({ radarData, selectedControl, setSelectedControl, dimensionData }) => {
    const [selectedDim,  setSelectedDim]  = useState(null);
    const [dimMeta,      setDimMeta]      = useState({});
    const [hoveredDim,   setHoveredDim]   = useState(null);   // dim name on hover
    const [tooltipPos,   setTooltipPos]   = useState({ x: 0, y: 0 });
    const drillDownRef = useRef(null);

    // Load FinalQuestions metadata from Excel
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/data/soft_control_data1.xlsx');
                if (!res.ok) return;
                const buf = await res.arrayBuffer();
                const wb  = XLSX.read(buf, { type: 'array' });
                if (!wb.SheetNames.includes('FinalQuestions')) return;
                const rows = XLSX.utils.sheet_to_json(wb.Sheets['FinalQuestions']);
                const meta = {};
                rows.forEach(row => {
                    const dim = String(row['Dimensions'] || '').trim();
                    if (!dim || meta[dim]) return;
                    meta[dim] = {
                        question: String(row['QuestionText']                       || '').trim(),
                        what:     String(row['What it means to your organization'] || '').trim(),
                        impact:   String(row['Business Impact']                    || '').trim(),
                        highRisk: String(row['High Risk Statements']               || '').trim(),
                        medRisk:  String(row['Med Risk Statements']                || '').trim(),
                        lowRisk:  String(row['Low Risk Statements']                || '').trim(),
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

    const CustomAngleAxisTick = ({ x, y, payload, cx, cy }) => {
        const isSelected = selectedControl === payload.value;
        const color = PILLAR_COLORS[payload.value] || '#00338D';
        const dx = x - cx, dy = y - cy, len = Math.sqrt(dx*dx + dy*dy) || 1;
        const nx = dx/len, ny = dy/len;
        return (
            <g onClick={() => { setSelectedControl(isSelected ? null : payload.value); setSelectedDim(null); }} style={{ cursor: 'pointer' }}>
                <circle cx={x} cy={y} r={isSelected ? 9 : 6} fill={isSelected ? color : '#fff'} stroke={color} strokeWidth={isSelected ? 3 : 2} />
                <text x={x+nx*8} y={y+ny*8}
                    textAnchor={nx>0.1?'start':nx<-0.1?'end':'middle'}
                    dominantBaseline={ny>0.1?'hanging':ny<-0.1?'auto':'middle'}
                    fontSize={12} fontWeight={isSelected?700:500} fill={isSelected?color:'#4B5563'}
                    dy={ny>0.1?14:ny<-0.1?-14:0} dx={nx>0.1?14:nx<-0.1?-14:0}>
                    {payload.value}
                </text>
            </g>
        );
    };

    const dims         = selectedControl ? (dimensionData[selectedControl] || []) : [];
    const controlColor = PILLAR_COLORS[selectedControl] || '#00338D';

    return (
        <div className="bg-white border border-gray-200 border-t-4 border-t-kpmg-navy p-6 shadow-card rounded-b-md">

            {/* Hover tooltip */}
            <HoverTooltip
                text={hoveredDim ? getMetaForDim(hoveredDim)?.what : null}
                visible={!!hoveredDim}
                x={tooltipPos.x}
                y={tooltipPos.y}
            />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>

                {/* Spider Chart */}
                <div style={{ flex: '1 1 400px' }}>
                    <h2 className="text-lg font-bold text-center mb-1">Soft Control Performance vs Risk Thresholds</h2>
                    <p style={{ fontSize: 12, color: '#6B7280', textAlign: 'center', marginBottom: 8 }}>Click a soft control label to view its dimension breakdown</p>
                    <div style={{ width: '100%', height: 440 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="62%" data={radarData}>
                                <PolarGrid stroke="#E5E7EB" gridType="polygon" />
                                <PolarAngleAxis dataKey="metric" tick={(props) => <CustomAngleAxisTick {...props} />} />
                                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickCount={6} />
                                <Radar name="Low Risk"    dataKey="lowRisk"    fill="#92D050" fillOpacity={1} stroke="none" />
                                <Radar name="Medium Risk" dataKey="mediumRisk" fill="#FFC000" fillOpacity={1} stroke="none" />
                                <Radar name="High Risk"   dataKey="highRisk"   fill="#FF0000" fillOpacity={1} stroke="none" />
                                <Radar name="Score"       dataKey="score"      stroke="#002060" strokeWidth={3} fill="none" />
                                <RechartsTooltip content={<CustomRadarTooltip />} />
                                <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: 16 }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Dimension Panel */}
                <div style={{ flex: '0 0 290px', minHeight: 440, display: 'flex', flexDirection: 'column', justifyContent: selectedControl ? 'flex-start' : 'center', alignItems: selectedControl ? 'stretch' : 'center' }}>
                    {!selectedControl ? (
                        <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '32px 16px' }}>
                            <div style={{ fontSize: 36, marginBottom: 12 }}>👆</div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', lineHeight: 1.6 }}>Click any soft control on the radar to see its dimension breakdown</p>
                        </div>
                    ) : (
                        <div style={{ animation: 'fadeInDim 0.25s ease' }}>
                            {/* Panel header */}
                            <div style={{ background: controlColor, borderRadius: '6px 6px 0 0', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Dimension Breakdown</p>
                                    <p style={{ fontSize: 15, color: '#fff', fontWeight: 700, margin: 0 }}>{selectedControl}</p>
                                </div>
                                <button onClick={() => { setSelectedControl(null); setSelectedDim(null); }}
                                    style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 4, color: '#fff', fontSize: 18, cursor: 'pointer', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, lineHeight: 1 }}>×</button>
                            </div>

                            {dims.length > 0 && (
                                <div style={{ background: `${controlColor}12`, border: `1px solid ${controlColor}25`, borderTop: 'none', padding: '6px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>Hover to preview · Click to drill down ↓</span>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: controlColor }}>Avg: {Math.round(dims.reduce((a,d)=>a+d.score,0)/dims.length)}</span>
                                </div>
                            )}

                            {/* Dimension rows */}
                            <div style={{ border: `1px solid ${controlColor}`, borderTop: 'none', borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
                                {dims.length === 0
                                    ? <div style={{ padding: 16, color: '#9CA3AF', fontSize: 13, textAlign: 'center' }}>No dimension data available</div>
                                    : dims.map((dim, i) => {
                                        const sc       = bandColor(dim.score);
                                        const rl       = bandLabel(dim.score);
                                        const isActive = selectedDim?.name === dim.name;
                                        const isHov    = hoveredDim === dim.name;
                                        return (
                                            <div key={i}
                                                onClick={() => setSelectedDim(isActive ? null : dim)}
                                                onMouseEnter={e => { setHoveredDim(dim.name); setTooltipPos({ x: e.clientX, y: e.clientY }); }}
                                                onMouseMove={e  => setTooltipPos({ x: e.clientX, y: e.clientY })}
                                                onMouseLeave={() => setHoveredDim(null)}
                                                style={{ padding: '12px 16px', background: isActive ? `${controlColor}10` : isHov ? '#F1F5F9' : i%2===0?'#fff':'#F9FAFB', borderBottom: i<dims.length-1?'1px solid #F3F4F6':'none', cursor: 'pointer', transition: 'background 0.12s', borderLeft: isActive ? `3px solid ${controlColor}` : '3px solid transparent' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                                    <p style={{ fontSize: 12, fontWeight: isActive ? 700 : 600, color: isActive ? controlColor : '#374151', margin: 0, flex: 1, paddingRight: 8, lineHeight: 1.4 }}>{dim.name}</p>
                                                    <span style={{ fontSize: 16, fontWeight: 700, color: sc, flexShrink: 0 }}>{dim.score}</span>
                                                </div>
                                                <div style={{ height: 4, background: '#E5E7EB', borderRadius: 2, marginBottom: 4 }}>
                                                    <div style={{ width: `${dim.score}%`, height: '100%', background: sc, borderRadius: 2, transition: 'width 0.5s ease' }} />
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span style={{ fontSize: 10, color: sc, fontWeight: 600 }}>{rl}</span>
                                                    {dim.favorable > 0 && <span style={{ fontSize: 10, color: '#9CA3AF' }}>{dim.favorable}% favorable</span>}
                                                </div>
                                                {isActive && <div style={{ fontSize: 10, color: controlColor, fontWeight: 600, marginTop: 4 }}>▼ Details shown below</div>}
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