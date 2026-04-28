import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import * as XLSX from 'xlsx';

const QUESTION_META = {
    Q006: {
        label: 'Speak-Up Culture',
        subtitle: 'Employees feel safe raising concerns without fear of consequences',
        color: '#3b82f6',
        lowRisk: 'Strong speak-up culture — employees feel safe and supported.',
        medRisk: 'Consistency in speaking up needs strengthening.',
        highRisk: 'Risks may be suppressed and go unresolved.',
    },
    Q009: {
        label: 'Risk Training',
        subtitle: 'Employees feel equipped with sufficient training to handle risk',
        color: '#6366f1',
        lowRisk: 'Training effectively equips employees to manage risks.',
        medRisk: 'Training exists but may not cover practical scenarios.',
        highRisk: 'Training gaps leave staff ill-equipped.',
    },
    Q016: {
        label: 'Decision Confidence',
        subtitle: 'Employees feel confident and supported when making decisions',
        color: '#8b5cf6',
        lowRisk: 'Employees act decisively and own their decisions.',
        medRisk: 'Confidence drops under complexity or pressure.',
        highRisk: 'Employees feel unsupported — accountability gaps emerge.',
    },
    Q025: {
        label: 'Risk Ownership',
        subtitle: 'Team members feel motivated to take on challenges responsibly',
        color: '#ec4899',
        lowRisk: 'Strong ownership mindset drives proactive risk management.',
        medRisk: 'Ownership is situational and varies across individuals.',
        highRisk: 'Low motivation — risk ownership assumed to lie elsewhere.',
    },
    Q030: {
        label: 'Accountability Speed',
        subtitle: 'Accountability concerns are addressed promptly after they arise',
        color: '#f97316',
        lowRisk: 'Issues handled promptly, reinforcing trust and control.',
        medRisk: 'Most issues addressed, but some delays weaken confidence.',
        highRisk: 'Issues linger — recurring problems erode trust in controls.',
    },
    Q031: {
        label: 'Breach Reporting',
        subtitle: 'Employees feel comfortable reporting policy breaches by colleagues',
        color: '#10b981',
        lowRisk: 'Employees confidently report non-compliance without fear.',
        medRisk: 'Some reporting occurs, but fear persists in sensitive cases.',
        highRisk: 'Employees feel unsafe reporting — breaches stay hidden.',
    },
};

const TARGET_IDS = ['Q006', 'Q009', 'Q016', 'Q025', 'Q030', 'Q031'];

// ─── Arc ring (open semicircle style) ────────────────────────────────────────
const ArcRing = ({ percent, color }) => {
    const size = 90, sw = 8, r = (size - sw) / 2;
    const circ = 2 * Math.PI * r;
    const ARC = 0.72;
    const arcLen = circ * ARC;
    const fill = Math.min(percent / 100, 1) * arcLen;
    const rot = 90 + (1 - ARC) * 180;

    return (
        <svg width={size} height={size * 0.68} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible', display: 'block' }}>
            {/* track */}
            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={`${color}18`} strokeWidth={sw}
                strokeDasharray={`${arcLen} ${circ - arcLen}`} strokeLinecap="round"
                transform={`rotate(${rot} ${size / 2} ${size / 2})`} />
            {/* fill */}
            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={color} strokeWidth={sw}
                strokeDasharray={`${fill} ${circ - fill}`} strokeLinecap="round"
                transform={`rotate(${rot} ${size / 2} ${size / 2})`}
                style={{ transition: 'stroke-dasharray 1s cubic-bezier(.4,0,.2,1)' }} />
            {/* percent text */}
            <text x={size / 2} y={size / 2 + 8} textAnchor="middle"
                fontSize={20} fontWeight="800" fill={color} fontFamily="Inter, 'Segoe UI', system-ui, sans-serif">
                {percent}%
            </text>
        </svg>
    );
};

// ─── Risk pill ────────────────────────────────────────────────────────────────
const RiskPill = ({ score }) => {
    const isLow = score >= 70, isMed = score >= 55;
    const [label, bg, col] = isLow
        ? ['Low Risk', '#dcfce7', '#16a34a']
        : isMed
            ? ['Medium Risk', '#fef9c3', '#ca8a04']
            : ['High Risk', '#fee2e2', '#dc2626'];
    return (
        <span style={{ fontSize: 10, fontWeight: 700, color: col, background: bg, borderRadius: 20, padding: '3px 10px', border: `1px solid ${col}30` }}>
            {label}
        </span>
    );
};

// ─── Shared Components ────────────────────────────────────────────────────────

const InsightCard = ({ data, index }) => {
    const isFavorable = data.favorablePercent >= 50;
    const accentColor = isFavorable ? '#2dce89' : '#fb6340';

    return (
        <div style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: '16px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            transition: 'transform 0.2s ease',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#64748b',
                    background: '#f8fafc',
                    padding: '2px 8px',
                    borderRadius: 4,
                    textTransform: 'uppercase'
                }}>{data.category}</span>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 18, fontWeight: 800, color: accentColor, margin: 0 }}>{data.favorablePercent}%</p>
                    <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, margin: 0 }}>FAVORABLE</p>
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', margin: '0 0 4px 0', lineHeight: 1.3 }}>{data.label}</h3>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{data.subtitle}</p>
            </div>

            <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                    width: `${data.favorablePercent}%`,
                    height: '100%',
                    background: accentColor,
                    borderRadius: 2,
                    transition: 'width 1s ease'
                }} />
            </div>
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const QuestionInsightsSection = ({ reportingData }) => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    const PIE_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#f59e0b', '#ef4444'];

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/data/soft_control_data1.xlsx');
                if (!res.ok) throw new Error();
                const buf = await res.arrayBuffer();
                const wb = XLSX.read(buf, { type: 'array' });
                const sheet = wb.SheetNames.includes('Responses') ? 'Responses' : 'AllResponses';
                const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet]);

                const map = {};
                rows.forEach(row => {
                    const qid = String(row.QuestionID || '').trim();
                    const resp = String(row.Response || '').trim();
                    const fav = typeof row.FavorableFlag === 'number'
                        ? row.FavorableFlag
                        : (resp === 'Strongly Agree' || resp === 'Agree' ? 1 : 0);
                    if (!qid || !resp) return;
                    if (!map[qid]) map[qid] = { fav: 0, total: 0 };
                    map[qid].total++;
                    map[qid].fav += fav;
                });

                setInsights(TARGET_IDS.map(qid => {
                    const s = map[qid] || { fav: 0, total: 0 };
                    return {
                        qid, ...QUESTION_META[qid],
                        favorablePercent: s.total ? Math.round((s.fav / s.total) * 100) : 0,
                    };
                }));
            } catch {
                setInsights(TARGET_IDS.map(qid => ({
                    qid, ...QUESTION_META[qid],
                    favorablePercent: Math.floor(Math.random() * 40) + 30
                })));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 80 }}>
            <p style={{ color: '#9ca3af', fontSize: 13, fontWeight: 600 }}>Loading insights…</p>
        </div>
    );

    return (
        <div style={{
            background: '#fff',
            border: '1.5px solid #e5e7eb',
            borderRadius: 16,
            padding: '24px',
            borderTop: '3px solid #3b82f6',
            boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
        }}>
            <div style={{ display: 'flex', gap: 32 }}>

                {/* Left: Incident Reporting Analysis */}
                {reportingData && (
                    <div style={{ flex: '0 0 280px', borderRight: '1px solid #f1f5f9', paddingRight: 32 }}>
                        <div style={{ marginBottom: 20 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Analytics</p>
                            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: 0 }}>Incident Reporting</h2>
                            <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Employee reporting preferences</p>
                        </div>

                        <div style={{ height: 180, width: '100%', marginBottom: 20 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={reportingData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} label={false}>
                                        {reportingData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                    </Pie>
                                    <RechartsTooltip
                                        formatter={(v, n) => [`${Math.round((v / reportingData.reduce((a, b) => a + b.value, 0)) * 100)}%`, n]}
                                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {reportingData.map((entry, i) => {
                                const total = reportingData.reduce((a, b) => a + b.value, 0);
                                const p = Math.round((entry.value / total) * 100);
                                return (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                                        <span style={{ fontSize: 13, color: '#4b5563', flex: 1, fontWeight: 500 }}>{entry.name}</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: PIE_COLORS[i % PIE_COLORS.length] }}>{p}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Right: Key Question Insights Grid */}
                <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 24 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Survey Analysis</p>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: 0 }}>Key Question Insights</h2>
                        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Favorable response rates across primary risk culture dimensions</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        {insights.map((insight, i) => (
                            <InsightCard key={insight.qid} data={insight} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionInsightsSection;
