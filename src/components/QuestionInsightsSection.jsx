import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const QUESTION_META = {
    Q006: {
        label: 'Speak-Up Culture',
        subtitle: 'Employees feel safe raising concerns without fear of consequences',
        color: '#3b82f6',
        lowRisk:  'Strong speak-up culture — employees feel safe and supported.',
        medRisk:  'Consistency in speaking up needs strengthening.',
        highRisk: 'Risks may be suppressed and go unresolved.',
    },
    Q009: {
        label: 'Risk Training',
        subtitle: 'Employees feel equipped with sufficient training to handle risk',
        color: '#6366f1',
        lowRisk:  'Training effectively equips employees to manage risks.',
        medRisk:  'Training exists but may not cover practical scenarios.',
        highRisk: 'Training gaps leave staff ill-equipped.',
    },
    Q016: {
        label: 'Decision Confidence',
        subtitle: 'Employees feel confident and supported when making decisions',
        color: '#8b5cf6',
        lowRisk:  'Employees act decisively and own their decisions.',
        medRisk:  'Confidence drops under complexity or pressure.',
        highRisk: 'Employees feel unsupported — accountability gaps emerge.',
    },
    Q025: {
        label: 'Risk Ownership',
        subtitle: 'Team members feel motivated to take on challenges responsibly',
        color: '#ec4899',
        lowRisk:  'Strong ownership mindset drives proactive risk management.',
        medRisk:  'Ownership is situational and varies across individuals.',
        highRisk: 'Low motivation — risk ownership assumed to lie elsewhere.',
    },
    Q030: {
        label: 'Accountability Speed',
        subtitle: 'Accountability concerns are addressed promptly after they arise',
        color: '#f97316',
        lowRisk:  'Issues handled promptly, reinforcing trust and control.',
        medRisk:  'Most issues addressed, but some delays weaken confidence.',
        highRisk: 'Issues linger — recurring problems erode trust in controls.',
    },
    Q031: {
        label: 'Breach Reporting',
        subtitle: 'Employees feel comfortable reporting policy breaches by colleagues',
        color: '#10b981',
        lowRisk:  'Employees confidently report non-compliance without fear.',
        medRisk:  'Some reporting occurs, but fear persists in sensitive cases.',
        highRisk: 'Employees feel unsafe reporting — breaches stay hidden.',
    },
};

const TARGET_IDS = ['Q006', 'Q009', 'Q016', 'Q025', 'Q030', 'Q031'];

// ─── Arc ring (open semicircle style) ────────────────────────────────────────
const ArcRing = ({ percent, color }) => {
    const size = 120, sw = 10, r = (size - sw) / 2;
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
                fontSize={26} fontWeight="800" fill={color} fontFamily="Inter, 'Segoe UI', system-ui, sans-serif">
                {percent}%
            </text>
        </svg>
    );
};

// ─── Risk pill ────────────────────────────────────────────────────────────────
const RiskPill = ({ score }) => {
    const isLow = score >= 70, isMed = score >= 55;
    const [label, bg, col] = isLow
        ? ['Low Risk',    '#dcfce7', '#16a34a']
        : isMed
        ? ['Medium Risk', '#fef9c3', '#ca8a04']
        : ['High Risk',   '#fee2e2', '#dc2626'];
    return (
        <span style={{ fontSize: 10, fontWeight: 700, color: col, background: bg, borderRadius: 20, padding: '3px 10px', border: `1px solid ${col}30` }}>
            {label}
        </span>
    );
};

// ─── Insight Card ─────────────────────────────────────────────────────────────
const InsightCard = ({ data, index }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), index * 80);
        return () => clearTimeout(t);
    }, [index]);

    const { label, subtitle, color, favorablePercent, avgScore } = data;
    const insightText = avgScore >= 70 ? data.lowRisk : avgScore >= 55 ? data.medRisk : data.highRisk;

    return (
        <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            background: '#fff',
            border: '1.5px solid #e5e7eb',
            borderRadius: 16,
            borderTop: `3px solid ${color}`,
            padding: '22px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
            textAlign: 'center',
        }}>
            {/* Label + risk pill */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
                <RiskPill score={avgScore} />
            </div>

            {/* Arc ring centered */}
            <ArcRing percent={favorablePercent} color={color} />

            {/* Favorable label */}
            <p style={{ fontSize: 12, color: '#6b7280', margin: 0, fontWeight: 500 }}>favorable responses</p>

            {/* Divider */}
            <div style={{ width: '100%', height: 1, background: '#f3f4f6' }} />

            {/* Subtitle */}
            <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, lineHeight: 1.5 }}>{subtitle}</p>

            {/* Insight callout */}
            <div style={{ background: `${color}0c`, borderRadius: 10, padding: '10px 14px', borderLeft: `3px solid ${color}`, width: '100%', textAlign: 'left' }}>
                <p style={{ fontSize: 12, color: '#374151', margin: 0, lineHeight: 1.5 }}>{insightText}</p>
            </div>
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const QuestionInsightsSection = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    const qid  = String(row.QuestionID || '').trim();
                    const resp = String(row.Response   || '').trim();
                    const score = parseFloat(row.Score_100);
                    const fav = typeof row.FavorableFlag === 'number'
                        ? row.FavorableFlag
                        : (resp === 'Strongly Agree' || resp === 'Agree' ? 1 : 0);
                    if (!qid || !resp) return;
                    if (!map[qid]) map[qid] = { sum: 0, cnt: 0, fav: 0, total: 0 };
                    map[qid].total++;
                    map[qid].fav += fav;
                    if (!isNaN(score)) { map[qid].sum += score; map[qid].cnt++; }
                });

                setInsights(TARGET_IDS.map(qid => {
                    const s = map[qid] || {};
                    const t = s.total || 0;
                    return {
                        qid, ...QUESTION_META[qid],
                        favorablePercent: t ? Math.round((s.fav / t) * 100) : 0,
                        avgScore: s.cnt ? Math.round(s.sum / s.cnt) : 0,
                    };
                }));
            } catch {
                setInsights([
                    { qid: 'Q006', favorablePercent: 54, avgScore: 78 },
                    { qid: 'Q009', favorablePercent: 58, avgScore: 75 },
                    { qid: 'Q016', favorablePercent: 46, avgScore: 69 },
                    { qid: 'Q025', favorablePercent: 54, avgScore: 72 },
                    { qid: 'Q030', favorablePercent: 39, avgScore: 67 },
                    { qid: 'Q031', favorablePercent: 62, avgScore: 76 },
                ].map(d => ({ ...QUESTION_META[d.qid], ...d })));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 80 }}>
            <p style={{ color: '#9ca3af', fontSize: 13, fontWeight: 600 }}>Loading question insights…</p>
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
            <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Survey Analysis</p>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: 0 }}>Key Question Insights</h2>
                <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Favorable response rates across key risk culture questions</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {insights.map((insight, i) => (
                    <InsightCard key={insight.qid} data={insight} index={i} />
                ))}
            </div>
        </div>
    );
};

export default QuestionInsightsSection;
