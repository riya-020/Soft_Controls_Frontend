import { useNavigate } from 'react-router-dom';

const REPORT_CARDS = [
    {
        title: 'Soft Controls Deep Dive Report',
        desc: 'A comprehensive breakdown of all 8 soft controls, including dimension-level scores, risk ratings, and trend analysis.',
        icon: '📋',
    },
    {
        title: 'Leadership vs Employee Gap Report',
        desc: 'Highlights divergence between leadership perception and employee experience across all soft control dimensions.',
        icon: '📊',
    },
    {
        title: 'Risk Culture Index Summary',
        desc: 'Executive summary of the overall Risk Culture Index with key findings, risk areas, and recommended actions.',
        icon: '🎯',
    },
];

const ReportsSection = () => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Header */}
            <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', margin: '0 0 4px' }}>Reports</h2>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
                    Generate and download risk culture reports for leadership review and board presentations.
                </p>
            </div>

            {/* Generate Report CTA */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderTop: '3px solid #004A9F', borderRadius: 12, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: '0 0 6px' }}>Full Risk Culture Report</h3>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0, maxWidth: 480, lineHeight: 1.6 }}>
                        Generate a complete, formatted report covering all soft controls, dimensions, leadership alignment, and recommendations.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/report')}
                    style={{
                        background: '#004A9F', color: '#fff', border: 'none',
                        borderRadius: 10, padding: '12px 24px',
                        fontSize: 14, fontWeight: 600, cursor: 'pointer',
                        transition: 'background 0.15s',
                        whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#003580'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#004A9F'; }}
                >
                    Generate Report →
                </button>
            </div>

            {/* Downloadable report cards */}
            <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>
                    Downloadable Reports
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {REPORT_CARDS.map((card, i) => (
                        <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
                                <div style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>{card.icon}</div>
                                <div>
                                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', margin: '0 0 4px' }}>{card.title}</h4>
                                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>{card.desc}</p>
                                </div>
                            </div>
                            <button
                                disabled
                                style={{
                                    background: '#F3F4F6', color: '#9CA3AF',
                                    border: '1px solid #E5E7EB', borderRadius: 8,
                                    padding: '8px 16px', fontSize: 12, fontWeight: 600,
                                    cursor: 'not-allowed', whiteSpace: 'nowrap', flexShrink: 0,
                                }}
                            >
                                Coming Soon
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsSection;
