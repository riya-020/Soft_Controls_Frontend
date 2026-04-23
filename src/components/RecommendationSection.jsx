import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Lightbulb, ChevronDown, ChevronUp, Sparkles, RefreshCw } from 'lucide-react';

// ─── Normalize soft control names from API ────────────────────────────────────
const normSC = n => {
    const map = {
        'open_to_discussion':      'Discussability',
        'open to discussion':      'Discussability',
        'openness to discussion':  'Discussability',
        'discussability':          'Discussability',
        'discussibility':          'Discussability',
        'role_modelling':          'Role Modelling',
        'role modelling':          'Role Modelling',
        'call_someone_to_account': 'Call Someone to Account',
        'call someone to account': 'Call Someone to Account',
        'achievability':           'Achievability',
        'enforcement':             'Enforcement',
        'clarity':                 'Clarity',
        'transparency':            'Transparency',
        'commitment':              'Commitment',
    };
    return map[(n || '').toLowerCase().trim()] || n;
};

// ─── Risk level config ────────────────────────────────────────────────────────
const RISK_CONFIG = {
    High: {
        barColor:    '#ef4444',
        badgeBg:     '#fee2e2',
        badgeText:   '#b91c1c',
        headerBg:    '#fff5f5',
        headerBorder:'#fecaca',
    },
    Medium: {
        barColor:    '#f59e0b',
        badgeBg:     '#fef3c7',
        badgeText:   '#92400e',
        headerBg:    '#fffdf0',
        headerBorder:'#fde68a',
    },
};

// ─── Single recommendation card ───────────────────────────────────────────────
const RecommendationCard = ({ rec, index }) => {
    const [expanded, setExpanded] = useState(index === 0);

    const isHigh      = rec.severity === 'High';
    const accentColor = isHigh ? '#dc2626' : '#d97706';
    const accentBg    = isHigh ? '#fff8f8' : '#fffdf0';
    const accentBorder= isHigh ? '#fecaca' : '#fde68a';
    const accentLight = isHigh ? '#fee2e2' : '#fef3c7';

    return (
        <div style={{
            marginBottom: 10,
            borderRadius: 14,
            border: `1px solid ${accentBorder}`,
            borderLeft: `4px solid ${accentColor}`,
            background: accentBg,
            overflow: 'hidden',
            transition: 'box-shadow 0.2s, transform 0.2s',
        }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            {/* ── Title toggle ── */}
            <button
                onClick={() => setExpanded(e => !e)}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '13px 16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: 10,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: accentColor, flexShrink: 0,
                    }} />
                    <span style={{
                        fontWeight: 700, fontSize: 13.5, color: '#001B41',
                        lineHeight: 1.4, flex: 1, minWidth: 0,
                    }}>
                        {rec.title}
                    </span>
                    <span style={{
                        fontSize: 10, fontWeight: 700,
                        padding: '3px 10px', borderRadius: 20,
                        background: accentLight, color: accentColor,
                        flexShrink: 0, letterSpacing: '0.03em',
                    }}>
                        {rec.severity}
                    </span>
                </div>
                {expanded
                    ? <ChevronUp   size={15} color="#9ca3af" style={{ flexShrink: 0 }} />
                    : <ChevronDown size={15} color="#9ca3af" style={{ flexShrink: 0 }} />
                }
            </button>

            {/* ── Expanded body ── */}
            {expanded && (
                <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                    <div style={{ height: 1, background: accentBorder, marginBottom: 2 }} />

                    {/* What & Why */}
                    <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: '#fff7ed', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <AlertTriangle size={14} color="#f97316" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{
                                fontSize: 10, fontWeight: 700, color: '#9ca3af',
                                letterSpacing: '0.08em', textTransform: 'uppercase',
                                margin: '0 0 5px',
                            }}>
                                Key Observation
                            </p>
                            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75, margin: 0 }}>
                                {rec.what_and_why}
                            </p>
                        </div>
                    </div>

                    {/* How to Implement */}
                    <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: '#eff6ff', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <Lightbulb size={14} color="#3b82f6" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{
                                fontSize: 10, fontWeight: 700, color: '#9ca3af',
                                letterSpacing: '0.08em', textTransform: 'uppercase',
                                margin: '0 0 5px',
                            }}>
                                How to Implement
                            </p>
                            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75, margin: 0 }}>
                                {rec.how}
                            </p>
                        </div>
                    </div>

                    {/* Business Impact */}
                    <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: '#f0fdf4', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <TrendingUp size={14} color="#16a34a" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{
                                fontSize: 10, fontWeight: 700, color: '#9ca3af',
                                letterSpacing: '0.08em', textTransform: 'uppercase',
                                margin: '0 0 5px',
                            }}>
                                Business Impact
                            </p>
                            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75, margin: 0 }}>
                                {rec.business_impact}
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

// ─── Soft control parameter block ─────────────────────────────────────────────
const ParameterBlock = ({ param }) => {
    const rc = RISK_CONFIG[param.riskLevel] || RISK_CONFIG.Medium;
    const sorted = [...(param.recommendations || [])].sort(
        (a, b) => (a.severity === 'High' ? -1 : 1)
    );

    return (
        <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            overflow: 'hidden',
            background: '#ffffff',
            boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
        }}>
            {/* Block header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '13px 18px',
                background: rc.headerBg,
                borderBottom: `1px solid ${rc.headerBorder}`,
                flexWrap: 'wrap',
                gap: 10,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#001B41', margin: 0 }}>
                        {normSC(param.softControl)}
                    </h3>
                    <span style={{
                        fontSize: 11, fontWeight: 600,
                        padding: '2px 10px', borderRadius: 20,
                        background: rc.badgeBg, color: rc.badgeText,
                    }}>
                        {param.riskLevel} Risk
                    </span>
                </div>

                {/* Score + bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 500 }}>Score</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#001B41' }}>
                        {param.score}<span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 400 }}>/100</span>
                    </span>
                    <div style={{
                        width: 80, height: 6,
                        background: '#e5e7eb', borderRadius: 3, overflow: 'hidden',
                    }}>
                        <div style={{
                            width: `${param.score}%`, height: '100%',
                            background: rc.barColor, borderRadius: 3,
                            transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                        }} />
                    </div>
                </div>
            </div>

            {/* Cards */}
            <div style={{ padding: '14px 14px 6px' }}>
                {sorted.map((rec, j) => (
                    <RecommendationCard key={j} rec={rec} index={j} />
                ))}
            </div>
        </div>
    );
};

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const Skeleton = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[1, 2, 3].map(i => (
            <div key={i} style={{
                borderRadius: 16, border: '1px solid #e5e7eb',
                overflow: 'hidden', background: '#fff',
            }}>
                <div style={{ padding: '13px 18px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: 160, height: 16, background: '#e5e7eb', borderRadius: 6, animation: 'pulse 1.4s ease-in-out infinite' }} />
                    <div style={{ width: 80, height: 16, background: '#e5e7eb', borderRadius: 6, animation: 'pulse 1.4s ease-in-out infinite' }} />
                </div>
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[80, 60, 90].map((w, j) => (
                        <div key={j} style={{ width: `${w}%`, height: 12, background: '#f3f4f6', borderRadius: 4, animation: 'pulse 1.4s ease-in-out infinite' }} />
                    ))}
                </div>
            </div>
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
    </div>
);

// ─── Main export ──────────────────────────────────────────────────────────────
const RecommendationsSection = () => {
    const [data,        setData]        = useState(null);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);
    const [refreshing,  setRefreshing]  = useState(false);
    const [filter,      setFilter]      = useState('All');

    const fetchData = async (forceRefresh = false) => {
        setError(null);
        if (forceRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            const url = forceRefresh
                ? 'http://localhost:8000/recommendations?refresh=true'
                : 'http://localhost:8000/recommendations';
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const json = await res.json();
            if (json.error) throw new Error(json.error);
            setData(json);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) return (
        <div id="recommendations-section" style={{
            borderRadius: 20, border: '1px solid #e5e7eb',
            borderTop: '4px solid #00338D',
            background: 'linear-gradient(180deg,#fff 0%,#f6f9fd 100%)',
            padding: 24,
            boxShadow: '0 20px 45px rgba(15,23,42,0.07)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Sparkles size={18} color="#00338D" />
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#001B41', margin: 0 }}>
                    AI-Powered Recommendations
                </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{
                    width: 20, height: 20, border: '2.5px solid #00338D',
                    borderTopColor: 'transparent', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite', flexShrink: 0,
                }} />
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                    Analysing risk culture patterns...
                </p>
            </div>
            <Skeleton />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    // ── Error ─────────────────────────────────────────────────────────────────
    if (error) return (
        <div id="recommendations-section" style={{
            borderRadius: 20, border: '1px solid #fca5a5',
            borderTop: '4px solid #ef4444',
            background: '#fff', padding: 24,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Sparkles size={18} color="#ef4444" />
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#001B41', margin: 0 }}>
                    AI-Powered Recommendations
                </h2>
            </div>
            <div style={{ background: '#fff8f8', border: '1px solid #fca5a5', borderRadius: 12, padding: 16 }}>
                <p style={{ fontSize: 13, color: '#b91c1c', fontWeight: 600, margin: '0 0 4px' }}>
                    {error}
                </p>
                <p style={{ fontSize: 12, color: '#ef4444', margin: '0 0 12px' }}>
                    Ensure the backend server is running on port 8000.
                </p>
                <button
                    onClick={() => fetchData()}
                    style={{
                        fontSize: 12, fontWeight: 600, color: '#b91c1c',
                        background: '#fee2e2', border: '1px solid #fca5a5',
                        borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
                    }}
                >
                    Try again
                </button>
            </div>
        </div>
    );

    if (!data?.parameters) return null;

    // ── Filter ────────────────────────────────────────────────────────────────
    const filtered = filter === 'All'
        ? data.parameters
        : data.parameters.filter(p => p.riskLevel === filter);

    const sorted = [...filtered].sort((a, b) => a.score - b.score);

    const highCount   = data.parameters.filter(p => p.riskLevel === 'High').length;
    const mediumCount = data.parameters.filter(p => p.riskLevel === 'Medium').length;

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div id="recommendations-section" style={{
            borderRadius: 20,
            border: '1px solid #e5e7eb',
            borderTop: '4px solid #00338D',
            background: 'linear-gradient(180deg,#ffffff 0%,#f6f9fd 100%)',
            padding: 24,
            boxShadow: '0 20px 45px rgba(15,23,42,0.07)',
        }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Sparkles size={18} color="#00338D" />
                    <div>
                        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#001B41', margin: 0 }}>
                            AI-Powered Recommendations
                        </h2>
                      
                    </div>
                </div>

                {/* Refresh button removed — backend controls updates */}
            </div>

            {/* ── Executive Summary ── */}
            {data.executiveSummary && (
                <div style={{
                    background: '#eff6ff', border: '1px solid #bfdbfe',
                    borderRadius: 12, padding: '14px 16px', marginBottom: 18,
                }}>
                    <p style={{
                        fontSize: 10, fontWeight: 700, color: '#2563eb',
                        letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px',
                    }}>
                        Executive Summary · CEO Briefing
                    </p>
                    <p style={{ fontSize: 13, color: '#001B41', fontWeight: 500, lineHeight: 1.75, margin: 0 }}>
                        {data.executiveSummary}
                    </p>
                </div>
            )}

            {/* ── Filter pills ── */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
                {[
                    { label: 'All',    count: data.parameters.length },
                    { label: 'High',   count: highCount   },
                    { label: 'Medium', count: mediumCount },
                ].map(({ label, count }) => {
                    const active = filter === label;
                    const colors = label === 'High'
                        ? { bg: '#fee2e2', text: '#b91c1c', activeBg: '#dc2626' }
                        : label === 'Medium'
                        ? { bg: '#fef3c7', text: '#92400e', activeBg: '#d97706' }
                        : { bg: '#eff6ff', text: '#1d4ed8', activeBg: '#00338D' };
                    return (
                        <button
                            key={label}
                            onClick={() => setFilter(label)}
                            style={{
                                fontSize: 12, fontWeight: 600,
                                padding: '5px 13px', borderRadius: 20, cursor: 'pointer',
                                border: 'none',
                                background: active ? colors.activeBg : colors.bg,
                                color: active ? '#fff' : colors.text,
                                transition: 'all 0.15s',
                            }}
                        >
                            {label === 'All' ? 'All parameters' : `${label} risk`}
                            <span style={{
                                marginLeft: 6, fontSize: 11,
                                background: active ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)',
                                borderRadius: 10, padding: '1px 6px',
                            }}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ── Parameter blocks ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {sorted.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af', fontSize: 13 }}>
                        No parameters match this filter.
                    </div>
                ) : (
                    sorted.map((param, i) => (
                        <ParameterBlock key={i} param={param} />
                    ))
                )}
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default RecommendationsSection;