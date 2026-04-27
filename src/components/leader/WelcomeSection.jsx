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

const SoftControlModal = ({ control, dimensionData, onClose }) => {
    const dims = dimensionData[control.name] || [];
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(15,23,42,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24,
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#fff', borderRadius: 16,
                    width: '100%', maxWidth: 520,
                    maxHeight: '80vh', overflow: 'auto',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
                    padding: '24px',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Soft Control</p>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', margin: 0 }}>{control.name}</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 10, color: '#6B7280', margin: '0 0 2px' }}>Score</p>
                        <p style={{ fontSize: 28, fontWeight: 800, color: '#004A9F', margin: 0, lineHeight: 1 }}>{control.score}</p>
                    </div>
                </div>

                <div style={{ height: 1, background: '#E5E7EB', marginBottom: 16 }} />

                {dims.length > 0 ? (
                    <>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Dimension Breakdown</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {dims.map((dim, i) => {
                                const sc = dim.score >= 80 ? '#22c55e' : dim.score >= 70 ? '#f59e0b' : '#ef4444';
                                return (
                                    <div key={i} style={{ background: '#F7FAFC', borderRadius: 10, padding: '12px 14px', border: '1px solid #E5E7EB' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>{dim.name}</span>
                                            <span style={{ fontSize: 16, fontWeight: 700, color: sc }}>{dim.score}</span>
                                        </div>
                                        <div style={{ height: 4, background: '#E5E7EB', borderRadius: 2 }}>
                                            <div style={{ width: `${dim.score}%`, height: '100%', background: sc, borderRadius: 2 }} />
                                        </div>
                                        {dim.favorable > 0 && (
                                            <p style={{ fontSize: 11, color: '#6B7280', margin: '4px 0 0' }}>{dim.favorable}% favorable</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', padding: '16px 0' }}>No dimension data available.</p>
                )}

                <button
                    onClick={onClose}
                    style={{
                        marginTop: 20, width: '100%', padding: '10px',
                        background: '#004A9F', color: '#fff', border: 'none',
                        borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const WelcomeSection = ({ pillarsData, dimensionData }) => {
    const [selectedControl, setSelectedControl] = useState(null);

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Header */}
            <div>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', margin: '0 0 6px' }}>
                    Good morning, Leader 👋
                </h1>
                <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
                    Welcome to your Risk Culture Dashboard — here's an overview of what you'll find inside.
                </p>
            </div>

            {/* Welcome text */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderLeft: '4px solid #004A9F', borderRadius: '0 12px 12px 0', padding: '20px 24px' }}>
                <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.8, margin: 0 }}>
                    {WELCOME_TEXT}
                </p>
            </div>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {INFO_CARDS.map((card, i) => (
                    <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderTop: '3px solid #004A9F', borderRadius: 12, padding: '20px' }}>
                        <div style={{ fontSize: 24, marginBottom: 10 }}>{card.icon}</div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', margin: '0 0 8px' }}>{card.title}</h3>
                        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
                    </div>
                ))}
            </div>

            {/* Soft Controls Grid */}
            {pillarsData && pillarsData.length > 0 && (
                <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: '0 0 12px' }}>
                        Soft Controls Overview
                    </h2>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px' }}>
                        Click any control to view its score and dimension breakdown.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                        {pillarsData.map((control, i) => {
                            const sc = control.score >= 80 ? '#22c55e' : control.score >= 70 ? '#f59e0b' : '#ef4444';
                            const rl = control.score >= 80 ? 'Low Risk' : control.score >= 70 ? 'Medium' : 'High Risk';
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedControl(control)}
                                    style={{
                                        background: '#FFFFFF', border: '1px solid #E5E7EB',
                                        borderTop: `3px solid ${sc}`,
                                        borderRadius: 12, padding: '16px',
                                        cursor: 'pointer', textAlign: 'left',
                                        transition: 'box-shadow 0.15s, transform 0.15s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,74,159,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#1F2937', margin: '0 0 8px', lineHeight: 1.4 }}>{control.name}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ fontSize: 24, fontWeight: 800, color: sc }}>{control.score}</span>
                                        <span style={{ fontSize: 10, fontWeight: 700, color: sc, background: `${sc}18`, padding: '2px 8px', borderRadius: 20 }}>{rl}</span>
                                    </div>
                                    <div style={{ height: 4, background: '#F3F4F6', borderRadius: 2 }}>
                                        <div style={{ width: `${control.score}%`, height: '100%', background: sc, borderRadius: 2 }} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {selectedControl && (
                <SoftControlModal
                    control={selectedControl}
                    dimensionData={dimensionData || {}}
                    onClose={() => setSelectedControl(null)}
                />
            )}
        </div>
    );
};

export default WelcomeSection;
