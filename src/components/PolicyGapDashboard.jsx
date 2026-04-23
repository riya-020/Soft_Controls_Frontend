import { useState, useEffect } from 'react';

const RISK_CONFIG = {
    High:   { bg: '#FEF2F2', border: '#FCA5A5', badge: '#EF4444', badgeBg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
    Medium: { bg: '#FFFBEB', border: '#FCD34D', badge: '#F59E0B', badgeBg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
    Low:    { bg: '#F0FDF4', border: '#86EFAC', badge: '#22C55E', badgeBg: '#DCFCE7', text: '#14532D', dot: '#22C55E' },
};

const ALIGN_CONFIG = {
    'Aligned':           { color: '#16A34A', bg: '#DCFCE7', icon: '✓' },
    'Partially Aligned': { color: '#D97706', bg: '#FEF3C7', icon: '◑' },
    'Not Aligned':       { color: '#DC2626', bg: '#FEE2E2', icon: '✕' },
};

export default function PolicyGapDashboard() {
    const [data,          setData]          = useState(null);
    const [loading,       setLoading]       = useState(true);
    const [error,         setError]         = useState(null);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [closing,       setClosing]       = useState(false);

    useEffect(() => {
        fetch('http://localhost:8000/gap-analysis')
            .then(r => {
                if (!r.ok) throw new Error('Gap analysis not found');
                return r.json();
            })
            .then(json => { setData(json); setLoading(false); })
            .catch(e  => { setError(e.message); setLoading(false); });
    }, []);

    const openPolicy = (policy) => {
        setClosing(false);
        setSelectedPolicy(policy);
    };

    const closeModal = () => {
        setClosing(true);
        setTimeout(() => { setSelectedPolicy(null); setClosing(false); }, 220);
    };

    // Risk counts
    const counts = { High: 0, Medium: 0, Low: 0 };
    (data?.analysis || []).forEach(p => { if (counts[p.risk_level] !== undefined) counts[p.risk_level]++; });

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', color: '#6B7280', fontSize: 14 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #E5E7EB', borderTop: '2px solid #00338D', animation: 'spin 0.8s linear infinite', marginRight: 10 }} />
            Loading policy analysis…
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error) return (
        <div style={{ padding: '24px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, color: '#991B1B', fontSize: 13 }}>
            Could not load gap analysis. Run <code>POST /process-gap-analysis</code> first.
        </div>
    );

    return (
        <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

            {/* ── Section header ── */}
            <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#00338D', margin: '0 0 4px' }}>
                    Policy Compliance Gap Analysis
                </h2>
                <p style={{ fontSize: 12.5, color: '#6B7280', margin: 0 }}>
                    Click any policy card to view expected behaviour, actual behaviour, and recommended actions.
                </p>
            </div>

            {/* ── Summary strip ── */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                {[
                    { label: 'High Risk',   count: counts.High,   ...RISK_CONFIG.High   },
                    { label: 'Medium Risk', count: counts.Medium, ...RISK_CONFIG.Medium },
                    { label: 'Low Risk',    count: counts.Low,    ...RISK_CONFIG.Low    },
                ].map(({ label, count, badgeBg, badge, text }) => (
                    <div key={label} style={{
                        flex: 1, background: badgeBg,
                        border: `1px solid ${badge}`,
                        borderRadius: 10, padding: '14px 18px',
                        display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                        <span style={{ fontSize: 28, fontWeight: 800, color: badge, lineHeight: 1 }}>{count}</span>
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: text, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
                            <div style={{ fontSize: 10.5, color: text, opacity: 0.75 }}>policies</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Overall summary ── */}
            {data?.overall_summary && (
                <div style={{
                    background: '#EEF3F8', borderLeft: '4px solid #00338D',
                    borderRadius: '0 8px 8px 0', padding: '12px 16px', marginBottom: 24,
                }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#00338D', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 5 }}>
                        Executive Summary
                    </div>
                    <p style={{ fontSize: 12.5, color: '#1F2937', lineHeight: 1.65, margin: 0 }}>
                        {data.overall_summary}
                    </p>
                </div>
            )}

            {/* ── Policy cards grid ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 14,
            }}>
                {(data?.analysis || []).map((policy, i) => {
                    const rc = RISK_CONFIG[policy.risk_level]         || RISK_CONFIG.Medium;
                    const ac = ALIGN_CONFIG[policy.alignment_status]  || ALIGN_CONFIG['Partially Aligned'];
                    return (
                        <div
                            key={i}
                            onClick={() => openPolicy(policy)}
                            style={{
                                background: '#fff',
                                border: `1px solid ${rc.border}`,
                                borderTop: `3px solid ${rc.badge}`,
                                borderRadius: 10,
                                padding: '14px 16px',
                                cursor: 'pointer',
                                transition: 'transform 0.15s, box-shadow 0.15s',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                position: 'relative',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                            }}
                        >
                            {/* Policy name */}
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#00338D', marginBottom: 8, lineHeight: 1.3, paddingRight: 20 }}>
                                {policy.policy_name}
                            </div>

                            {/* Badges row */}
                            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                                <span style={{
                                    background: rc.badgeBg, color: rc.text,
                                    border: `1px solid ${rc.badge}`,
                                    padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                                }}>
                                    {policy.risk_level} Risk
                                </span>
                                <span style={{
                                    background: ac.bg, color: ac.color,
                                    padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                                }}>
                                    {ac.icon} {policy.alignment_status}
                                </span>
                            </div>

                            {/* Gap summary preview */}
                            <p style={{
                                fontSize: 11, color: '#6B7280', lineHeight: 1.5, margin: '0 0 10px',
                                display: '-webkit-box', WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>
                                {policy.gap_summary}
                            </p>

                            {/* Click hint */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: '#00338D', fontWeight: 600 }}>
                                <span>View details</span>
                                <span style={{ fontSize: 12 }}>→</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Modal ── */}
            {selectedPolicy && (
                <div
                    onClick={closeModal}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 1000,
                        background: 'rgba(0,0,0,0.45)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '20px',
                        animation: closing ? 'fadeOut 0.2s ease forwards' : 'fadeIn 0.2s ease forwards',
                    }}
                >
                    <style>{`
                        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
                        @keyframes slideUp   { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
                        @keyframes slideDown { from { opacity: 1; transform: translateY(0);    } to { opacity: 0; transform: translateY(24px); } }
                    `}</style>

                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: '#fff',
                            borderRadius: 14,
                            width: '100%', maxWidth: 640,
                            maxHeight: '88vh',
                            overflow: 'hidden',
                            display: 'flex', flexDirection: 'column',
                            boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
                            animation: closing ? 'slideDown 0.2s ease forwards' : 'slideUp 0.22s ease forwards',
                        }}
                    >
                        {/* Modal header */}
                        {(() => {
                            const rc = RISK_CONFIG[selectedPolicy.risk_level]        || RISK_CONFIG.Medium;
                            const ac = ALIGN_CONFIG[selectedPolicy.alignment_status] || ALIGN_CONFIG['Partially Aligned'];
                            return (
                                <>
                                    <div style={{
                                        background: '#00338D', padding: '18px 22px',
                                        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                                        gap: 12,
                                    }}>
                                        <div>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 }}>
                                                Policy Analysis
                                            </div>
                                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 10px', lineHeight: 1.3 }}>
                                                {selectedPolicy.policy_name}
                                            </h3>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <span style={{ background: rc.badgeBg, color: rc.text, padding: '3px 10px', borderRadius: 4, fontSize: 10.5, fontWeight: 700 }}>
                                                    {selectedPolicy.risk_level} Risk
                                                </span>
                                                <span style={{ background: ac.bg, color: ac.color, padding: '3px 10px', borderRadius: 4, fontSize: 10.5, fontWeight: 700 }}>
                                                    {ac.icon} {selectedPolicy.alignment_status}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={closeModal}
                                            style={{
                                                background: 'rgba(255,255,255,0.15)', border: 'none',
                                                color: '#fff', width: 32, height: 32, borderRadius: 8,
                                                fontSize: 16, cursor: 'pointer', flexShrink: 0,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* Modal body — scrollable */}
                                    <div style={{ overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                                        {/* Policy summary */}
                                        <p style={{ fontSize: 12.5, color: '#374151', lineHeight: 1.65, margin: 0, padding: '10px 14px', background: '#F8FAFF', borderRadius: 8, borderLeft: '3px solid #00338D' }}>
                                            {selectedPolicy.policy_summary}
                                        </p>

                                        {/* Expected vs Actual — side by side */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

                                            {/* Expected behavior */}
                                            <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, padding: '12px 14px' }}>
                                                <div style={{ fontSize: 10, fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>
                                                    ✓ Expected Behavior
                                                </div>
                                                <ul style={{ margin: 0, paddingLeft: 16 }}>
                                                    {(selectedPolicy.expected_behavior || []).map((b, i) => (
                                                        <li key={i} style={{ fontSize: 11.5, color: '#166534', lineHeight: 1.6, marginBottom: 4 }}>{b}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Actual behavior */}
                                            <div style={{ background: '#FFF7ED', border: '1px solid #FCD34D', borderRadius: 8, padding: '12px 14px' }}>
                                                <div style={{ fontSize: 10, fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>
                                                    ◑ Actual Behavior
                                                </div>
                                                <p style={{ fontSize: 11.5, color: '#92400E', lineHeight: 1.6, margin: 0 }}>
                                                    {selectedPolicy.actual_behavior}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Gap summary */}
                                        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '12px 14px' }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: '#B91C1C', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 6 }}>
                                                Gap Summary
                                            </div>
                                            <p style={{ fontSize: 12, color: '#7F1D1D', lineHeight: 1.6, margin: 0 }}>
                                                {selectedPolicy.gap_summary}
                                            </p>
                                        </div>

                                        {/* Key drivers */}
                                        {(selectedPolicy.key_drivers || []).length > 0 && (
                                            <div>
                                                <div style={{ fontSize: 10, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>
                                                    Key Drivers
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                    {selectedPolicy.key_drivers.map((d, i) => (
                                                        <span key={i} style={{
                                                            background: '#EEF3F8', color: '#00338D',
                                                            border: '1px solid #BFDBFE',
                                                            padding: '4px 10px', borderRadius: 5,
                                                            fontSize: 11, fontWeight: 600,
                                                        }}>
                                                            {d}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Directional action */}
                                        {selectedPolicy.directional_action && (
                                            <div style={{ background: '#EEF3F8', borderLeft: '4px solid #00338D', borderRadius: '0 8px 8px 0', padding: '12px 14px' }}>
                                                <div style={{ fontSize: 10, fontWeight: 700, color: '#00338D', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 6 }}>
                                                    Directional Action
                                                </div>
                                                <p style={{ fontSize: 12, color: '#1E3A5F', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                                                    {selectedPolicy.directional_action}
                                                </p>
                                            </div>
                                        )}

                                    </div>

                                    {/* Modal footer */}
                                    <div style={{
                                        padding: '12px 22px', borderTop: '1px solid #E5E7EB',
                                        display: 'flex', justifyContent: 'flex-end',
                                    }}>
                                        <button
                                            onClick={closeModal}
                                            style={{
                                                background: '#00338D', color: '#fff',
                                                border: 'none', padding: '9px 24px',
                                                borderRadius: 8, fontSize: 13, fontWeight: 600,
                                                cursor: 'pointer', transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#002776'}
                                            onMouseLeave={e => e.currentTarget.style.background = '#00338D'}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}
