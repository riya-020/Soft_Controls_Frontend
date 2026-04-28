import { useState } from 'react';

const WELCOME_TEXT =
    "This assessment uses a soft controls framework to understand the behavioural drivers that influence decision-making, escalation, accountability, and risk-taking. By examining attitudes, observed behaviours, and real-world scenarios, the framework helps identify where strong intent does not consistently translate into practice. Thank you for your participation in the leadership interview and for enabling this assessment of organisational risk culture. Your perspective plays a key role in understanding how strategic intent translates into everyday decisions across the organization.";

const INFO_CARDS = [
    {
        title: 'Leadership Perspective',
        icon: '🎯',
        desc: 'Understand how leadership behaviours and decisions shape the overall risk culture across the organisation.',
    },
    {
        title: 'Employee Experience',
        icon: '👥',
        desc: 'Explore how employees perceive and experience the soft controls that drive day-to-day risk behaviour.',
    },
    {
        title: 'Comparison & Alignment',
        icon: '📊',
        desc: 'Identify gaps between leadership intent and employee experience to prioritise targeted interventions.',
    },
];

const SoftControlModal = ({ control, dimensionData, onClose, onNavigate }) => {
    const dims = dimensionData[control.name] || [];
    const sc = control.score >= 80 ? '#22c55e' : control.score >= 70 ? '#f59e0b' : '#ef4444';
    const rl = control.score >= 80 ? 'Low Risk' : control.score >= 70 ? 'Medium Risk' : 'High Risk';

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(15,23,42,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24,
                backdropFilter: 'blur(4px)'
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#fff', borderRadius: 16,
                    width: '100%', maxWidth: 500,
                    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
                    padding: '28px',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Strategic Insight</p>
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>{control.name}</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 32, fontWeight: 900, color: sc, lineHeight: 1 }}>{control.score}</div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: sc, background: `${sc}15`, padding: '2px 8px', borderRadius: 4, display: 'inline-block', marginTop: 4 }}>{rl}</div>
                    </div>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px', marginBottom: 20, border: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                        This soft control evaluates your organisation's {control.name.toLowerCase()} through <strong>{dims.length} critical dimensions</strong>:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 12 }}>
                        {dims.map((dim, idx) => (
                            <span key={idx} style={{
                                fontSize: 10, fontWeight: 600, color: '#00338D', background: '#fff',
                                padding: '4px 8px', borderRadius: 6, border: '1px solid #00338D20'
                            }}>
                                {dim.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1, padding: '12px',
                            background: '#fff', color: '#64748b', border: '1px solid #e2e8f0',
                            borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}
                    >
                        Back
                    </button>
                    <button
                        onClick={() => { onClose(); onNavigate(control.name); }}
                        style={{
                            flex: 2, padding: '12px',
                            background: '#00338D', color: '#fff', border: 'none',
                            borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                        }}
                    >
                        Analyze
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

const WelcomeSection = ({ pillarsData, dimensionData, onNavigateToOverview }) => {
    const [selectedControl, setSelectedControl] = useState(null);

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* 1. Header Area */}
            <div style={{
                background: 'linear-gradient(135deg, #00338D 0%, #005EB8 100%)',
                borderRadius: 20,
                padding: '40px 48px',
                color: '#fff',
                boxShadow: '0 12px 30px rgba(0,51,141,0.18)',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: 10
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                        Welcome, Leader
                    </h1>
                    <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', margin: 0, maxWidth: 700, lineHeight: 1.6, fontWeight: 400 }}>
                        Your specialized Risk Culture Dashboard. Explore insights into behavioral drivers and strategic alignment across your organization.
                    </p>
                </div>
                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute', right: -40, top: -40, width: 240, height: 240,
                    background: 'rgba(255,255,255,0.07)', borderRadius: '50%'
                }} />
                <div style={{
                    position: 'absolute', right: 80, bottom: -60, width: 160, height: 160,
                    background: 'rgba(255,255,255,0.03)', borderRadius: '50%'
                }} />
            </div>

            {/* 2. Key Objectives (Refactored from wordy text) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00338D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" /></svg>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Behavioural Drivers</h3>
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                        Analyze drivers influencing decision-making, escalation, and risk-taking across the organisation.
                    </p>
                </div>
                <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00338D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Intent vs. Practice</h3>
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                        Identify gaps where strategic intent does not consistently translate into everyday practice.
                    </p>
                </div>
                <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00338D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Strategic Alignment</h3>
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                        Leverage leadership insights to understand how intent shapes everyday decisions organisation-wide.
                    </p>
                </div>
            </div>

            {/* 3. Soft Controls Overview */}
            {pillarsData && pillarsData.length > 0 && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
                        <div>
                            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                                Soft Controls Overview
                            </h2>
                            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                                Interactive map of behavioral drivers. Click any control for a focused deep dive.
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                        {pillarsData.map((control, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedControl(control)}
                                style={{
                                    background: '#FFFFFF', border: '1px solid #e2e8f0',
                                    borderRadius: 12, padding: '24px 20px',
                                    cursor: 'pointer', textAlign: 'left',
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex', flexDirection: 'column', gap: 14,
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = '#00338D50';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 51, 141, 0.08)';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <span style={{ fontSize: 13, fontWeight: 750, color: '#0f172a', lineHeight: 1.4 }}>{control.name}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 'auto' }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: '#00338D', textTransform: 'uppercase', letterSpacing: '0.02em' }}>View Insight</span>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00338D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. Strategic Pillars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {INFO_CARDS.map((card, i) => {
                    const icons = [
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
                        <path d="M18 20V10M12 20V4M6 20v-6" />
                    ];
                    return (
                        <div key={i} style={{
                            background: '#FFFFFF',
                            border: '1px solid #e2e8f0',
                            borderRadius: 16,
                            padding: '24px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 16
                        }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 12, background: '#f8fafc',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#00338D'
                            }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {icons[i]}
                                </svg>
                            </div>
                            <div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{card.title}</h3>
                                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedControl && (
                <SoftControlModal
                    control={selectedControl}
                    dimensionData={dimensionData || {}}
                    onClose={() => setSelectedControl(null)}
                    onNavigate={onNavigateToOverview}
                />
            )}
        </div>
    );
};

export default WelcomeSection;
