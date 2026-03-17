import SoftControlCard from '../../components/SoftControlCard';
import { ExternalLink, ClipboardList, ShieldCheck } from 'lucide-react';

const EmployeeDashboard = () => {
    const pillars = [
        { title: 'Transparency', description: 'Degree to which management is open and clear about decisions and actions.', icon: '◎' },
        { title: 'Role Modelling', description: 'Extent to which leadership exemplifies the organization\'s core values and ethics.', icon: '◈' },
        { title: 'Commitment', description: 'Dedication from employees towards organizational goals and standards.', icon: '◆' },
        { title: 'Achievability', description: 'Ensuring that assigned tasks and objectives are realistic and attainable.', icon: '◇' },
        { title: 'Enforcement', description: 'Consistent application of rules and consequences across the organization.', icon: '▣' },
        { title: 'Accountability', description: 'Taking ownership of actions and resulting outcomes.', icon: '◉' },
        { title: 'Discussibility', description: 'Comfort level of employees in raising concerns and discussing issues openly.', icon: '◌' },
        { title: 'Clarity', description: 'Clear understanding of expectations, roles, and responsibilities.', icon: '◑' }
    ];

    const KPMG_COLORS = [
        '#00338D', '#005EB8', '#0091DA', '#00A3BF',
        '#43B02A', '#1D9E75', '#8246AF', '#470A68'
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* Hero Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #001B41 0%, #00338D 60%, #005EB8 100%)',
                borderRadius: 4,
                padding: '48px 56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 32,
                position: 'relative',
                overflow: 'hidden',
                flexWrap: 'wrap'
            }}>
                {/* Decorative background shape */}
                <div style={{
                    position: 'absolute', right: -60, top: -60,
                    width: 280, height: 280,
                    borderRadius: '50%',
                    border: '40px solid rgba(255,255,255,0.04)',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute', right: 80, bottom: -80,
                    width: 200, height: 200,
                    borderRadius: '50%',
                    border: '30px solid rgba(255,255,255,0.03)',
                    pointerEvents: 'none'
                }} />

                <div style={{ maxWidth: 560, position: 'relative' }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 2,
                        padding: '4px 12px',
                        marginBottom: 16
                    }}>
                        <ShieldCheck size={12} color="#6CACE4" />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6CACE4', fontFamily: 'Arial, sans-serif' }}>
                            Confidential · Internal Use Only
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: 28, fontWeight: 700, color: '#fff',
                        marginBottom: 12, letterSpacing: '-0.02em',
                        fontFamily: 'Georgia, serif', lineHeight: 1.25
                    }}>
                        Risk Culture Survey
                    </h1>
                    <p style={{
                        fontSize: 15, color: 'rgba(255,255,255,0.7)',
                        fontFamily: 'Arial, sans-serif', fontWeight: 400,
                        lineHeight: 1.7, margin: 0
                    }}>
                        Your responses provide valuable insights into our Soft Control Pillars
                        and support ongoing cultural improvements across the organization.
                    </p>
                </div>

                {/* CTA Button */}
                <a
                    href="https://forms.office.com/r/SNX6Wt7dRy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        background: '#fff',
                        color: '#00338D',
                        padding: '14px 28px',
                        fontFamily: 'Arial, sans-serif',
                        fontWeight: 700, fontSize: 14,
                        textDecoration: 'none',
                        borderRadius: 2,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        flexShrink: 0,
                        position: 'relative'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
                    }}
                >
                    <ClipboardList size={18} color="#00338D" />
                    Start Survey
                    <ExternalLink size={14} color="#005EB8" />
                </a>
            </div>

            {/* Stats Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16
            }}>
                {[
                    { value: '8', label: 'Soft Control Pillars', color: '#00338D' },
                    { value: '100%', label: 'Anonymous Responses', color: '#005EB8' },
                    { value: 'KPMG', label: 'Risk Culture Assessment', color: '#0091DA' }
                ].map((stat, i) => (
                    <div key={i} style={{
                        background: '#fff',
                        border: '1px solid #E5E7EB',
                        borderTop: `4px solid ${stat.color}`,
                        borderRadius: 4,
                        padding: '20px 24px',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: 28, fontWeight: 700, color: stat.color, margin: '0 0 4px', fontFamily: 'Georgia, serif' }}>{stat.value}</p>
                        <p style={{ fontSize: 12, color: '#6B7280', margin: 0, fontFamily: 'Arial, sans-serif', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Pillars Section */}
            <div>
                {/* Section Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 8, height: 8, background: '#00338D', borderRadius: 1, transform: 'rotate(45deg)' }} />
                        <h2 style={{
                            fontSize: 14, fontWeight: 700, color: '#00338D',
                            fontFamily: 'Arial, sans-serif',
                            letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0
                        }}>
                            The 8 Soft Control Pillars
                        </h2>
                        <div style={{ width: 8, height: 8, background: '#00338D', borderRadius: 1, transform: 'rotate(45deg)' }} />
                    </div>
                    <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
                </div>

                {/* Cards Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 16
                }}>
                    {pillars.map((pillar, idx) => (
                        <div
                            key={pillar.title}
                            style={{
                                background: '#fff',
                                border: '1px solid #E5E7EB',
                                borderTop: `4px solid ${KPMG_COLORS[idx]}`,
                                borderRadius: 4,
                                padding: '24px 20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                                cursor: 'default'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,27,65,0.1)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {/* Number badge */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{
                                    width: 28, height: 28,
                                    background: KPMG_COLORS[idx],
                                    borderRadius: 2,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 12, fontWeight: 700, color: '#fff',
                                    fontFamily: 'Arial, sans-serif',
                                    flexShrink: 0
                                }}>
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                                <div style={{
                                    width: 6, height: 6,
                                    borderRadius: '50%',
                                    background: KPMG_COLORS[idx],
                                    opacity: 0.3
                                }} />
                            </div>

                            {/* Title */}
                            <h3 style={{
                                fontSize: 15, fontWeight: 700,
                                color: '#001B41', margin: 0,
                                fontFamily: 'Georgia, serif',
                                letterSpacing: '-0.01em'
                            }}>
                                {pillar.title}
                            </h3>

                            {/* Divider */}
                            <div style={{ height: 2, width: 32, background: KPMG_COLORS[idx], borderRadius: 1 }} />

                            {/* Description */}
                            <p style={{
                                fontSize: 13, color: '#6B7280',
                                fontFamily: 'Arial, sans-serif',
                                lineHeight: 1.6, margin: 0
                            }}>
                                {pillar.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default EmployeeDashboard;