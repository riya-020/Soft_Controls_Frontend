import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';

const QUESTION_META = {
    Q006: {
        insightSubtitle: 'Employees feel safe raising concerns openly without risk of negative consequences',
        color:  '#0091DA',
        highRisk: 'Employees struggle to raise concerns — risks may be suppressed and go unresolved.',
        medRisk:  'Willingness to speak up varies across teams — consistency needs strengthening.',
        lowRisk:  'A strong speak-up culture exists. Employees feel safe and supported.',
    },
    Q009: {
        insightSubtitle: 'Employees feel equipped with sufficient training to handle job-related risk effectively',
        color:  '#00A878',
        highRisk: 'Training gaps leave staff ill-equipped — errors and inconsistencies are likely.',
        medRisk:  'Training exists but may not fully address practical risk scenarios.',
        lowRisk:  'Training effectively equips employees to manage risks with confidence.',
    },
    Q016: {
        insightSubtitle: 'Employees feel confident and supported when making important decisions within their role',
        color:  '#C49A00',
        highRisk: 'Employees feel unsupported — decisions are deferred and accountability gaps emerge.',
        medRisk:  'Confidence exists in routine situations but drops under complexity or pressure.',
        lowRisk:  'Employees act decisively and feel empowered to own their decisions.',
    },
    Q025: {
        insightSubtitle: 'Team members feel motivated to take on challenges and handle them responsibly',
        color:  '#7C3AED',
        highRisk: 'Low motivation — employees assume risk ownership lies elsewhere.',
        medRisk:  'Ownership is situational — motivation varies across individuals and scenarios.',
        lowRisk:  'Strong ownership mindset drives proactive and responsible risk management.',
    },
    Q030: {
        insightSubtitle: 'Accountability concerns within teams are addressed promptly after they arise',
        color:  '#00338D',
        highRisk: 'Issues linger unresolved — recurring problems and eroded trust in controls.',
        medRisk:  'Most issues are addressed, but some delays weaken confidence in accountability.',
        lowRisk:  'Issues are handled promptly, reinforcing trust and effective control.',
    },
    Q031: {
        insightSubtitle: 'Employees feel comfortable reporting when colleagues breach policies or procedures',
        color:  '#0E7490',
        highRisk: 'Employees feel unsafe reporting — critical breaches stay hidden.',
        medRisk:  'Some reporting occurs, but fear persists in sensitive cases.',
        lowRisk:  'Employees confidently report non-compliance without fear of repercussion.',
    },
};

const TARGET_IDS  = ['Q006', 'Q009', 'Q016', 'Q025', 'Q030', 'Q031'];
const RESP_ORDER  = ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'];
const RESP_COLORS = {
    'Strongly Agree':    '#22c55e',
    'Agree':             '#86efac',
    'Neutral':           '#cbd5e1',
    'Disagree':          '#fbbf24',
    'Strongly Disagree': '#ef4444',
};

const getSignal = (pct) => {
    if (pct >= 70) return { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', dot: '#22c55e' };
    if (pct >= 50) return { bg: '#fffbeb', text: '#92400e', border: '#fde68a', dot: '#f59e0b' };
    return               { bg: '#fff1f2', text: '#be123c', border: '#fecdd3', dot: '#f43f5e' };
};

const ArcRing = ({ percent, color, size = 132 }) => {
    const sw     = 11;
    const r      = (size - sw) / 2;
    const circ   = 2 * Math.PI * r;
    const ARC    = 0.78;
    const arcLen = circ * ARC;
    const gap    = circ - arcLen;
    const fill   = Math.min(percent / 100, 1) * arcLen;
    const rot    = 90 + (1 - ARC) * 180;

    return (
        <svg width={size} height={size * 0.76} viewBox={`0 0 ${size} ${size}`}
            style={{ overflow: 'visible', display: 'block' }}>
            <circle cx={size/2} cy={size/2} r={r} fill="none"
                stroke={`${color}1a`} strokeWidth={sw}
                strokeDasharray={`${arcLen} ${gap}`} strokeLinecap="round"
                transform={`rotate(${rot} ${size/2} ${size/2})`}
            />
            <circle cx={size/2} cy={size/2} r={r} fill="none"
                stroke={color} strokeWidth={sw}
                strokeDasharray={`${fill} ${circ - fill}`} strokeLinecap="round"
                transform={`rotate(${rot} ${size/2} ${size/2})`}
                style={{ transition: 'stroke-dasharray 1.1s cubic-bezier(.4,0,.2,1)' }}
            />
            <text x={size/2} y={size/2 + 5} textAnchor="middle"
                fontSize={size * 0.21} fontWeight="800" fill={color}
                fontFamily="Georgia, serif">
                {percent}%
            </text>
            <text x={size/2} y={size/2 + 18} textAnchor="middle"
                fontSize={8} fontWeight="500" fill="#94a3b8"
                fontFamily="system-ui, sans-serif">
                favorable
            </text>
        </svg>
    );
};

const HoverBar = ({ distribution, total }) => {
    const [tooltip, setTooltip] = useState(null);
    const barRef = useRef(null);
    const present = RESP_ORDER.filter(r => distribution[r]);

    const handleMouseMove = (e, resp) => {
        const rect = barRef.current?.getBoundingClientRect();
        if (!rect) return;
        const count = distribution[resp] || 0;
        const pct   = Math.round((count / total) * 100);
        setTooltip({ resp, pct, count, x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div style={{ width: '100%', position: 'relative' }} ref={barRef}>
            <div style={{
                display: 'flex', height: 10, borderRadius: 999,
                overflow: 'hidden', gap: 2, background: '#f1f5f9', cursor: 'pointer',
            }}>
                {present.map(resp => {
                    const pct = ((distribution[resp] || 0) / total) * 100;
                    return (
                        <div key={resp}
                            style={{ width: `${pct}%`, background: RESP_COLORS[resp], flexShrink: 0, transition: 'width 0.9s ease' }}
                            onMouseMove={(e) => handleMouseMove(e, resp)}
                            onMouseLeave={() => setTooltip(null)}
                        />
                    );
                })}
            </div>
            {tooltip && (
                <div style={{
                    position: 'absolute', top: tooltip.y - 52,
                    left: Math.min(tooltip.x - 60, 160),
                    background: '#1e293b', color: '#fff', borderRadius: 8,
                    padding: '7px 11px', fontSize: 11, fontWeight: 600,
                    pointerEvents: 'none', zIndex: 50, whiteSpace: 'nowrap',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.22)', lineHeight: 1.6,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: RESP_COLORS[tooltip.resp], display: 'inline-block', flexShrink: 0 }} />
                        <span style={{ color: '#e2e8f0' }}>{tooltip.resp}</span>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: 10 }}>
                        <span style={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>{tooltip.pct}%</span>
                        {/* {'  '}({tooltip.count} of {total} respondents) */}
                    </div>
                    <div style={{ position: 'absolute', bottom: -5, left: 14, width: 10, height: 10, background: '#1e293b', transform: 'rotate(45deg)', borderRadius: 2 }} />
                </div>
            )}
        </div>
    );
};

const InsightCard = ({ data, index }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), index * 90);
        return () => clearTimeout(t);
    }, [index]);

    const { insightSubtitle, color, favorablePercent, avgScore, distribution, total, highRisk, medRisk, lowRisk } = data;
    const signal   = getSignal(favorablePercent);
    const riskStmt = favorablePercent >= 70 ? lowRisk : favorablePercent >= 50 ? medRisk : highRisk;

    return (
        <div style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.45s ease, transform 0.45s ease',
            background: '#ffffff', borderRadius: 20,
            border: '1px solid #e8edf7',
            borderTop: `3px solid ${color}`,
            boxShadow: '0 4px 18px rgba(15,23,42,0.05)',
            padding: '20px 20px 20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
            {/* Arc ring */}
            <ArcRing percent={favorablePercent} color={color} size={128} />

            {/* Avg score */}
            <p style={{ margin: '8px 0 16px', fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                Avg score&nbsp;
                <span style={{ fontWeight: 700, color: '#334155' }}>{avgScore}</span>
                <span style={{ color: '#cbd5e1' }}>/100</span>
            </p>

            {/* Divider */}
            <div style={{ width: '100%', height: 1, background: '#f1f5f9', marginBottom: 14 }} />

            {/* Subtitle only */}
            <p style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.55, textAlign: 'center', margin: '0 0 18px', width: '100%' }}>
                {insightSubtitle}
            </p>

            {/* Hover bar */}
            <HoverBar distribution={distribution} total={total} />

            {/* Insight box */}
            <div style={{
                marginTop: 16, width: '100%',
                background: signal.bg, border: `1px solid ${signal.border}`,
                borderLeft: `3px solid ${signal.dot}`, borderRadius: 10, padding: '10px 13px',
            }}>
                <p style={{ margin: 0, fontSize: 11.5, color: signal.text, fontWeight: 600, lineHeight: 1.55 }}>
                    {riskStmt}
                </p>
            </div>
        </div>
    );
};

const SharedLegend = () => (
    <div style={{
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px 20px',
        padding: '11px 18px', background: '#fff', border: '1px solid #e8edf7',
        borderRadius: 12, marginBottom: 20,
    }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 4, flexShrink: 0 }}>
            Response scale
        </span>
        {RESP_ORDER.map(resp => (
            <div key={resp} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: RESP_COLORS[resp], flexShrink: 0 }} />
                <span style={{ fontSize: 11.5, color: '#475569', fontWeight: 600 }}>{resp}</span>
            </div>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 10.5, color: '#94a3b8', fontStyle: 'italic', flexShrink: 0 }}>
            Hover bar segments to see % breakdown
        </span>
    </div>
);

const QuestionInsightsSection = () => {
    const [insights, setInsights] = useState([]);
    const [loading,  setLoading]  = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/data/soft_control_data1.xlsx');
                if (!res.ok) throw new Error();
                const buf = await res.arrayBuffer();
                const wb  = XLSX.read(buf, { type: 'array' });
                const sheet = wb.SheetNames.includes('Responses') ? 'Responses' : 'AllResponses';
                const rows  = XLSX.utils.sheet_to_json(wb.Sheets[sheet]);

                const map = {};
                rows.forEach(row => {
                    const qid   = String(row.QuestionID || '').trim();
                    const resp  = String(row.Response   || '').trim();
                    const score = parseFloat(row.Score_100);
                    const fav   = typeof row.FavorableFlag === 'number'
                        ? row.FavorableFlag
                        : (resp === 'Strongly Agree' || resp === 'Agree' ? 1 : 0);
                    if (!qid || !resp) return;
                    if (!map[qid]) map[qid] = { sum: 0, cnt: 0, fav: 0, total: 0, dist: {} };
                    map[qid].total++;
                    map[qid].dist[resp] = (map[qid].dist[resp] || 0) + 1;
                    map[qid].fav += fav;
                    if (!isNaN(score)) { map[qid].sum += score; map[qid].cnt++; }
                });

                setInsights(TARGET_IDS.map(qid => {
                    const s = map[qid] || {};
                    const t = s.total || 0;
                    return {
                        qid, ...QUESTION_META[qid],
                        favorablePercent: t ? Math.round((s.fav / t) * 100) : 0,
                        avgScore:         s.cnt ? Math.round(s.sum / s.cnt) : 0,
                        distribution:     s.dist || {},
                        total: t,
                    };
                }));
            } catch {
                setInsights([
                    { qid:'Q006', favorablePercent:54, avgScore:78, total:26, distribution:{'Strongly Agree':10,'Agree':4,'Neutral':11,'Disagree':1} },
                    { qid:'Q009', favorablePercent:58, avgScore:75, total:26, distribution:{'Strongly Agree':10,'Agree':5,'Neutral':5,'Disagree':6} },
                    { qid:'Q016', favorablePercent:46, avgScore:69, total:26, distribution:{'Strongly Agree':7,'Agree':5,'Neutral':7,'Disagree':6,'Strongly Disagree':1} },
                    { qid:'Q025', favorablePercent:54, avgScore:72, total:26, distribution:{'Strongly Agree':5,'Agree':9,'Neutral':9,'Disagree':3} },
                    { qid:'Q030', favorablePercent:39, avgScore:67, total:26, distribution:{'Strongly Agree':5,'Agree':5,'Neutral':12,'Disagree':2,'Strongly Disagree':2} },
                    { qid:'Q031', favorablePercent:62, avgScore:76, total:26, distribution:{'Strongly Agree':9,'Agree':7,'Neutral':6,'Disagree':4} },
                ].map(d => ({ ...QUESTION_META[d.qid], ...d })));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 90 }}>
            <p style={{ color: '#94a3b8', fontWeight: 600 }}>Loading question insights…</p>
        </div>
    );

    return (
        <div style={{
            background: '#f8fafc', border: '1px solid #e8edf7',
            borderTop: '4px solid #00338D', borderRadius: 32,
            boxShadow: '0 18px 38px rgba(15,23,42,0.05)',
            padding: '28px 28px 32px',
        }}>
            {/* Section header — title only */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 4, height: 26, background: 'linear-gradient(180deg,#00338D,#0091DA)', borderRadius: 4, flexShrink: 0 }} />
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0b1f3a', margin: 0, letterSpacing: '-0.02em' }}>
                    Key Question Insights
                </h2>
            </div>

            <SharedLegend />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                {insights.map((insight, i) => (
                    <InsightCard key={insight.qid} data={insight} index={i} />
                ))}
            </div>
        </div>
    );
};

export default QuestionInsightsSection;