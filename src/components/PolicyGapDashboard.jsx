import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';

// ─── Config ───────────────────────────────────────────────────────────────────
const RISK_CFG = {
    High:   { bar: '#DC2626', badge: '#FEE2E2', badgeText: '#991B1B', ring: '#DC2626', label: 'High Risk'   },
    Medium: { bar: '#D97706', badge: '#FEF3C7', badgeText: '#92400E', ring: '#D97706', label: 'Medium Risk' },
    Low:    { bar: '#16A34A', badge: '#DCFCE7', badgeText: '#14532D', ring: '#16A34A', label: 'Low Risk'    },
};

const ALIGN_CFG = {
    'Aligned':           { color: '#16A34A', bg: '#F0FDF4', icon: '●', label: 'Aligned'           },
    'Partially Aligned': { color: '#D97706', bg: '#FFFBEB', icon: '◑', label: 'Partial'           },
    'Not Aligned':       { color: '#DC2626', bg: '#FEF2F2', icon: '○', label: 'Not Aligned'       },
};

// ─── Tiny components ──────────────────────────────────────────────────────────
const SectionLabel = ({ children, color = '#6B7280' }) => (
    <div style={{ fontSize: 9.5, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        {children}
    </div>
);

const Pill = ({ children, bg, color }) => (
    <span style={{ background: bg, color, fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20, display: 'inline-block' }}>
        {children}
    </span>
);

// ─── Risk heat bar (thin horizontal bar showing proportion) ──────────────────
const HeatBar = ({ high, medium, low }) => {
    const total = high + medium + low || 1;
    return (
        <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', gap: 1 }}>
            {high   > 0 && <div style={{ flex: high,   background: '#DC2626' }} />}
            {medium > 0 && <div style={{ flex: medium, background: '#D97706' }} />}
            {low    > 0 && <div style={{ flex: low,    background: '#16A34A' }} />}
        </div>
    );
};

// ─── Modal ────────────────────────────────────────────────────────────────────
const PolicyModal = ({ policy, onClose }) => {
    const rc = RISK_CFG[policy.risk_level]        || RISK_CFG.Medium;
    const ac = ALIGN_CFG[policy.alignment_status] || ALIGN_CFG['Partially Aligned'];

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(15,23,42,0.55)',
                backdropFilter: 'blur(3px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24,
                animation: 'bgFadeIn 0.18s ease',
            }}
        >
            <style>{`
                @keyframes bgFadeIn  { from{opacity:0} to{opacity:1} }
                @keyframes slideUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                .modal-scroll::-webkit-scrollbar { width: 5px; }
                .modal-scroll::-webkit-scrollbar-track { background: #F1F5F9; }
                .modal-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
            `}</style>

            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#fff', borderRadius: 16,
                    width: '100%', maxWidth: 660,
                    maxHeight: '90vh', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
                    animation: 'slideUp 0.22s ease',
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px 24px 16px',
                    borderBottom: '1px solid #F1F5F9',
                    background: 'linear-gradient(135deg, #001B41 0%, #00338D 100%)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                                Policy Detail
                            </div>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '0 0 4px', lineHeight: 1.3 }}>
                                {policy.policy_name}
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'rgba(255,255,255,0.12)', border: 'none',
                                color: '#fff', width: 30, height: 30,
                                borderRadius: 8, fontSize: 15, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0, transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                        >✕</button>
                    </div>
                </div>

                {/* Body */}
                <div className="modal-scroll" style={{ overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Gap summary — the most important thing first */}
                    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderLeft: '4px solid #DC2626', borderRadius: '0 8px 8px 0', padding: '12px 14px' }}>
                        <SectionLabel color="#B91C1C">Gap Summary</SectionLabel>
                        <p style={{ fontSize: 12.5, color: '#7F1D1D', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                            {policy.gap_summary}
                        </p>
                    </div>

                    {/* Expected vs Actual */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '12px 14px' }}>
                            <SectionLabel color="#15803D">✓ Expected Behaviour</SectionLabel>
                            <ul style={{ margin: 0, paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {(policy.expected_behavior || []).map((b, i) => (
                                    <li key={i} style={{ fontSize: 11.5, color: '#166534', lineHeight: 1.55 }}>{b}</li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 14px' }}>
                            <SectionLabel color="#B45309">◑ Actual Behaviour (Survey Signals)</SectionLabel>
                            <p style={{ fontSize: 11.5, color: '#92400E', lineHeight: 1.55, margin: 0 }}>
                                {policy.actual_behavior}
                            </p>
                        </div>
                    </div>

                    {/* Key drivers */}
                    {(policy.key_drivers || []).length > 0 && (
                        <div>
                            <SectionLabel>Key Drivers</SectionLabel>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                                {policy.key_drivers.map((d, i) => (
                                    <span key={i} style={{
                                        background: '#EEF3F8', color: '#00338D',
                                        border: '1px solid #BFDBFE',
                                        padding: '4px 11px', borderRadius: 6,
                                        fontSize: 11, fontWeight: 600,
                                    }}>{d}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Directional action */}
                    {policy.directional_action && (
                        <div style={{ background: '#EEF3F8', borderLeft: '4px solid #00338D', borderRadius: '0 10px 10px 0', padding: '12px 14px' }}>
                            <SectionLabel color="#00338D">→ Directional Action</SectionLabel>
                            <p style={{ fontSize: 12.5, color: '#1E3A5F', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                                {policy.directional_action}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '12px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#00338D', color: '#fff', border: 'none',
                            padding: '8px 22px', borderRadius: 8,
                            fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#002776'}
                        onMouseLeave={e => e.currentTarget.style.background = '#00338D'}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Policy row (table view) ──────────────────────────────────────────────────
const PolicyRow = ({ policy, index, onSelect }) => {
    const rc = RISK_CFG[policy.risk_level] || RISK_CFG.Medium;
    const [hovered, setHovered] = useState(false);

    return (
        <tr
            onClick={() => onSelect(policy)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                cursor: 'pointer',
                background: hovered ? '#F0F4FF' : index % 2 === 0 ? '#fff' : '#FAFBFF',
                transition: 'background 0.12s',
                borderBottom: '1px solid #F1F5F9',
            }}
        >
            {/* Risk indicator bar */}
            <td style={{ padding: '0 0 0 6px', width: 4 }}>
                <div style={{ width: 4, height: 52, background: rc.ring, borderRadius: 2 }} />
            </td>

            {/* Policy name + summary */}
            <td style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#001B41', lineHeight: 1.35, marginBottom: 4 }}>
                    {policy.policy_name}
                </div>
                <div style={{ fontSize: 11.5, color: '#6B7280', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {policy.gap_summary}
                </div>
            </td>

            {/* Key drivers */}
            <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {(policy.key_drivers || []).slice(0, 4).map((d, i) => (
                        <span key={i} style={{ background: '#EEF3F8', color: '#00338D', border: '1px solid #DBEAFE', padding: '3px 9px', borderRadius: 6, fontSize: 10.5, fontWeight: 600 }}>
                            {d}
                        </span>
                    ))}
                    {(policy.key_drivers || []).length > 4 && (
                        <span style={{ fontSize: 10, color: '#9CA3AF', padding: '3px 4px' }}>+{policy.key_drivers.length - 4}</span>
                    )}
                </div>
            </td>

            {/* Arrow */}
            <td style={{ padding: '14px 16px 14px 4px', textAlign: 'right' }}>
                <span style={{ fontSize: 16, color: hovered ? '#00338D' : '#CBD5E1', transition: 'color 0.12s' }}>→</span>
            </td>
        </tr>
    );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function PolicyGapDashboard() {
    const [data,           setData]           = useState(null);
    const [loading,        setLoading]        = useState(true);
    const [error,          setError]          = useState(null);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [filterRisk,     setFilterRisk]     = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/gap-analysis')
            .then(r => { if (!r.ok) throw new Error('Not found'); return r.json(); })
            .then(json => { setData(json); setLoading(false); })
            .catch(e  => { setError(e.message); setLoading(false); });
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 32, color: '#6B7280', fontSize: 13 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #E5E7EB', borderTop: '2px solid #00338D', animation: 'spin 0.8s linear infinite' }} />
            Loading policy analysis…
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    if (error) return (
        <div style={{ padding: 20, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#991B1B', fontSize: 13 }}>
            Could not load gap analysis. Run <code>POST /process-gap-analysis</code> first.
        </div>
    );

    const policies = data?.analysis || [];

    // Counts
    const counts = { High: 0, Medium: 0, Low: 0 };
    policies.forEach(p => { if (counts[p.risk_level] !== undefined) counts[p.risk_level]++; });

    // Alignment counts
    const alignCounts = { Aligned: 0, 'Partially Aligned': 0, 'Not Aligned': 0 };
    policies.forEach(p => { if (alignCounts[p.alignment_status] !== undefined) alignCounts[p.alignment_status]++; });

    // Filtered list
    const filtered = filterRisk === 'All'
        ? policies
        : policies.filter(p => p.risk_level === filterRisk);

    return (
        <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>

            {/* ── Header ── */}
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#001B41', margin: '0 0 3px', letterSpacing: '-0.02em' }}>
                        Policy Compliance Analysis
                    </h2>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                        {policies.length} policies assessed · Click any row to view full detail
                    </p>
                </div>
            </div>

            {/* ── Executive summary ── */}
            {data?.overall_summary && (
                <div style={{
                    background: '#F8FAFF', border: '1px solid #DBEAFE',
                    borderLeft: '4px solid #00338D',
                    borderRadius: '0 10px 10px 0',
                    padding: '12px 16px', marginBottom: 18,
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                }}>
                    <div style={{ flexShrink: 0, marginTop: 1 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: '#00338D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 13, color: '#fff' }}>↗</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#00338D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                            Executive Summary
                        </div>
                        <p style={{ fontSize: 12.5, color: '#1E3A5F', lineHeight: 1.65, margin: 0 }}>
                            {data.overall_summary}
                        </p>
                    </div>
                </div>
            )}

            {/* ── Filter pills ── */}
            <div style={{ display: 'flex', gap: 7, marginBottom: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#9CA3AF', marginRight: 2 }}>Filter:</span>
                {['All', 'High', 'Medium', 'Low'].map(f => {
                    const active = filterRisk === f;
                    const color  = f === 'High' ? '#DC2626' : f === 'Medium' ? '#D97706' : f === 'Low' ? '#16A34A' : '#00338D';
                    return (
                        <button
                            key={f}
                            onClick={() => setFilterRisk(f)}
                            style={{
                                padding: '4px 13px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                                border: `1px solid ${active ? color : '#E5E7EB'}`,
                                background: active ? color : '#fff',
                                color: active ? '#fff' : '#6B7280',
                                cursor: 'pointer', transition: 'all 0.12s',
                            }}
                        >
                            {f === 'All' ? `All (${policies.length})` : `${f} (${counts[f] ?? 0})`}
                        </button>
                    );
                })}
            </div>

            {/* ── Policy table ── */}
            <div style={{ border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                    <colgroup>
                        <col style={{ width: 4 }} />
                        <col style={{ width: '42%' }} />
                        <col />
                        <col style={{ width: 40 }} />
                    </colgroup>
                    <thead>
                        <tr style={{ background: '#F8FAFF', borderBottom: '2px solid #E5E7EB' }}>
                            <th style={{ padding: 0 }} />
                            <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10.5, fontWeight: 700, color: '#374151', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                Policy
                            </th>
                            <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10.5, fontWeight: 700, color: '#374151', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                Key Drivers
                            </th>
                            <th style={{ padding: 0 }} />
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '28px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                                    No policies match this filter.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((policy, i) => (
                                <PolicyRow
                                    key={i}
                                    policy={policy}
                                    index={i}
                                    onSelect={setSelectedPolicy}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Footer note ── */}
            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 10, textAlign: 'right' }}>
                Click any row to view full policy detail, expected vs actual behaviour, and recommended actions.
            </p>

            {/* ── View Report CTA ── */}
            <div style={{
                marginTop: 20,
                background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f5e9 100%)',
                border: '1px solid #c7d7fe',
                borderRadius: 16,
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
                flexWrap: 'wrap',
                fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: 'linear-gradient(135deg, #00338D, #0052cc)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, boxShadow: '0 4px 12px rgba(0,51,141,0.3)',
                    }}>
                        <FileText size={20} color="#fff" />
                    </div>
                    <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#00338D', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 3px' }}>
                            Final Step
                        </p>
                        <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>
                            Ready to generate your full report?
                        </p>
                        <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
                            View the complete Risk Culture Assessment report with all findings, scores, and recommendations.
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/report')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'linear-gradient(135deg, #00338D, #0052cc)',
                        color: '#fff', border: 'none', borderRadius: 10,
                        padding: '11px 20px', fontSize: 13, fontWeight: 700,
                        cursor: 'pointer', whiteSpace: 'nowrap',
                        transition: 'opacity 0.2s, transform 0.2s',
                        boxShadow: '0 4px 14px rgba(0,51,141,0.35)',
                        fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    View Full Report
                    <ArrowRight size={15} />
                </button>
            </div>

            {/* ── Modal ── */}
            {selectedPolicy && (
                <PolicyModal policy={selectedPolicy} onClose={() => setSelectedPolicy(null)} />
            )}
        </div>
    );
}