import React from 'react';

const ReportTemplate = React.forwardRef(({
    pillarsData,
    dimensionData,
    employeeLeaderData,
    kpiData
}, ref) => {

    const getColor = (score) => {
        if (score >= 80) return '#22c55e'; // Green - Low Risk
        if (score >= 70) return '#f59e0b'; // Amber - Medium Risk
        return '#ef4444'; // Red - High Risk
    };

    const getRiskLabel = (score) => {
        if (score >= 80) return 'Low Risk';
        if (score >= 70) return 'Medium Risk';
        return 'High Risk';
    };

    const getPerformanceLabel = (score) => {
        if (score >= 80) return 'Strong';
        if (score >= 70) return 'Moderate';
        return 'Weak';
    };

    const currentYear = new Date().getFullYear();

    return (
        <div ref={ref} style={{ width: '210mm', background: 'white', color: '#333' }}>

            {/* ─── PAGE 1: TITLE PAGE ─── */}
            <div style={{ width: '210mm', height: '297mm', background: '#00338D', color: 'white', position: 'relative', overflow: 'hidden', pageBreakAfter: 'always' }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                <div style={{ padding: '120px 60px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', lineHeight: 1.2 }}>Soft Controls<br />Deep Dive Report</h1>
                    <p style={{ fontSize: '20px', color: '#0091DA', marginBottom: '80px' }}>Organisational Risk Culture Assessment</p>

                    <div style={{ width: '80px', height: '4px', background: 'white', marginBottom: '40px' }} />

                    <div style={{ display: 'flex', gap: '60px' }}>
                        <div>
                            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>PREPARED FOR</p>
                            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Leadership Team</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>PREPARED BY</p>
                            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Risk Advisory</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>DATE</p>
                            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{currentYear}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── PAGE 2: INTRODUCTION ─── */}
            <div style={{ width: '210mm', height: '297mm', padding: '40px 60px', pageBreakAfter: 'always', boxSizing: 'border-box', position: 'relative' }}>
                <div style={{ borderBottom: '2px solid #00338D', paddingBottom: '16px', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#00338D', margin: 0 }}>Introduction to Soft Risk Culture</h2>
                </div>

                <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                    Organizational risk culture plays a critical role in determining how individuals perceive, discuss, and respond to risk within their daily activities. While formal governance structures such as policies, procedures and internal controls provide a framework for managing risks, the effectiveness of these mechanisms is largely influenced by behavioural and cultural factors within the organization.
                </p>
                <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                    The Soft Controls Deep Dive assessment evaluates underlying cultural drivers that influence decision-making, accountability, transparency and openness across teams. By analysing these behavioural dimensions, organizations can better understand how risk awareness is embedded in everyday operations and identify opportunities to strengthen their overall control environment.
                </p>
                <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '40px' }}>
                    The assessment focuses on key behavioural drivers that influence how employees understand expectations, communicate concerns and take responsibility for risk-related decisions.
                </p>

                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#001B41', marginBottom: '20px' }}>Key Soft Control Dimensions</h3>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: '#E0F2FE', borderTop: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB' }}>
                            <th style={{ padding: '12px', textAlign: 'left', width: '30%', color: '#001B41', fontWeight: 'bold' }}>Soft Control</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#001B41', fontWeight: 'bold' }}>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { name: 'Clarity', desc: 'Clear expectations and responsibilities' },
                            { name: 'Role Modelling', desc: 'Leadership demonstrating desired behaviour' },
                            { name: 'Commitment', desc: 'Employee ownership and responsibility' },
                            { name: 'Transparency', desc: 'Open communication and information sharing' },
                            { name: 'Discussability', desc: 'Comfort discussing risks and concerns' },
                            { name: 'Call Someone to Account', desc: 'Ownership of actions and outcomes' },
                            { name: 'Enforcement', desc: 'Consistent application of policies' },
                            { name: 'Achievability', desc: 'Targets are practical and attainable' }
                        ].map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #D1D5DB' }}>
                                <td style={{ padding: '12px', color: '#374151' }}>{row.name}</td>
                                <td style={{ padding: '12px', color: '#4B5563' }}>{row.desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ position: 'absolute', bottom: '40px', left: '60px', right: '60px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9CA3AF' }}>
                    <span>Confidential</span>
                    <span>Soft Control Assessment</span>
                    <span>Page 2</span>
                </div>
            </div>

            {/* ─── DYNAMIC PAGES: ONE FOR EACH PILLAR ─── */}
            {pillarsData.map((pillar, index) => {
                const scName = pillar.name;
                const dims = dimensionData[scName] || [];
                const elData = employeeLeaderData.find(d => d.control === scName) || { leader: 0, employee: 0 };
                const leaderScore = elData.leader || 0;
                const employeeScore = elData.employee || 0;

                const riskColor = getColor(pillar.score);
                const riskLabel = getRiskLabel(pillar.score);

                return (
                    <div key={index} style={{ width: '210mm', height: '297mm', padding: '40px 60px', pageBreakAfter: 'always', boxSizing: 'border-box', position: 'relative' }}>

                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #00338D', paddingBottom: '12px', marginBottom: '30px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#00338D' }}>Soft Risk Culture Report</span>
                            <span style={{ fontSize: '14px', color: '#374151' }}>{scName}</span>
                        </div>

                        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#00338D', marginBottom: '20px' }}>{scName}</h2>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                            <span style={{ fontSize: '64px', fontWeight: 'bold', color: '#00338D', lineHeight: 1 }}>{pillar.score}</span>
                            <div style={{ background: riskColor, color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                                {riskLabel}
                            </div>
                        </div>

                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#001B41', marginBottom: '12px' }}>Definition</h3>
                        <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '30px', color: '#374151' }}>
                            This soft control reflects behavioural drivers that influence how openly employees discuss risks, concerns and mistakes. Strong {scName.toLowerCase()} improves organisational learning and strengthens governance.
                        </p>

                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#001B41', marginBottom: '16px' }}>Dimension Performance</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ background: '#00338D', color: 'white' }}>
                                    <th style={{ padding: '10px 14px', textAlign: 'left', width: '70%' }}>Dimension</th>
                                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Performance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dims.map((dim, i) => {
                                    const dimRiskColor = getColor(dim.score);
                                    const dimPerfLabel = getPerformanceLabel(dim.score);
                                    return (
                                        <tr key={i} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <td style={{ padding: '10px 14px', color: '#374151' }}>{dim.name}</td>
                                            <td style={{ padding: '10px 14px', color: 'white', background: dimRiskColor, fontWeight: 'bold' }}>
                                                {dimPerfLabel}
                                            </td>
                                        </tr>
                                    )
                                })}
                                {dims.length === 0 && (
                                    <tr>
                                        <td colSpan="2" style={{ padding: '14px', textAlign: 'center', color: '#6B7280' }}>No dimensions found for this soft control.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#001B41', marginBottom: '16px' }}>Leader vs Employee Perception</h3>
                        <div style={{ marginBottom: '30px' }}>
                            <div style={{ background: '#00338D', color: 'white', padding: '10px 16px', width: `${Math.max(leaderScore, 10)}%`, minWidth: '200px', marginBottom: '8px' }}>
                                Leader Score: {leaderScore}
                            </div>
                            <div style={{ background: '#F59E0B', color: 'white', padding: '10px 16px', width: `${Math.max(employeeScore, 10)}%`, minWidth: '200px' }}>
                                Employee Score: {employeeScore}
                            </div>
                        </div>

                        <div style={{ position: 'absolute', bottom: '40px', left: '60px', right: '60px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9CA3AF' }}>
                            <span>Confidential</span>
                            <span>Soft Control Assessment</span>
                            <span>Page {index + 3}</span>
                        </div>
                    </div>
                );
            })}

            {/* ─── FINAL PAGE: RECOMMENDATIONS ─── */}
            <div style={{ width: '210mm', height: '296mm', padding: '40px 60px', boxSizing: 'border-box', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #00338D', paddingBottom: '12px', marginBottom: '30px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#00338D' }}>Soft Risk Culture Report</span>
                    <span style={{ fontSize: '14px', color: '#374151' }}>Recommendations</span>
                </div>

                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#00338D', marginBottom: '20px' }}>Key Recommendations</h2>

                <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '40px', color: '#374151' }}>
                    Based on the Soft Controls Deep Dive assessment, the following recommendations are proposed to strengthen the organization's risk culture and enhance behavioural drivers that support effective governance and decision-making.
                </p>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: '#3b0ca3', color: 'white' }}>
                            <th style={{ padding: '12px', textAlign: 'left', width: '20%' }}>Theme</th>
                            <th style={{ padding: '12px', textAlign: 'left', width: '35%' }}>Recommendation</th>
                            <th style={{ padding: '12px', textAlign: 'left', width: '35%' }}>Expected Impact</th>
                            <th style={{ padding: '12px', textAlign: 'left', width: '10%' }}>Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { theme: 'Discussability Forums', rec: 'Establish structured risk discussion forums across teams', impact: 'Improves transparency and open dialogue', pri: 'High' },
                            { theme: 'Leadership Role Modelling', rec: 'Strengthen tone-at-the-top messaging on risk management', impact: 'Encourages behavioural alignment across employees', pri: 'High' },
                            { theme: 'Policy Awareness', rec: 'Enhance communication of risk policies and procedures', impact: 'Improves clarity of responsibilities and expectations', pri: 'Medium' },
                            { theme: 'Enforcement', rec: 'Introduce scenario-based risk management training', impact: 'Builds employee confidence in managing risks', pri: 'Medium' },
                            { theme: 'Transparency', rec: 'Promote awareness of speak-up and escalation channels', impact: 'Strengthens psychological safety for reporting concerns', pri: 'High' },
                            { theme: 'Accountability Framework', rec: 'Embed risk ownership within performance objectives', impact: 'Reinforces accountability and behavioural consistency', pri: 'Medium' },
                        ].map((row, i) => (
                            <tr key={i} style={{ background: i % 2 === 0 ? '#F3F4F6' : '#DBEAFE' }}>
                                <td style={{ padding: '12px', color: '#374151' }}>{row.theme}</td>
                                <td style={{ padding: '12px', color: '#374151' }}>{row.rec}</td>
                                <td style={{ padding: '12px', color: '#374151' }}>{row.impact}</td>
                                <td style={{ padding: '12px', color: '#374151' }}>{row.pri}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ position: 'absolute', bottom: '40px', left: '60px', right: '60px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9CA3AF' }}>
                    <span>Confidential</span>
                    <span>Soft Control Assessment</span>
                    <span>Page {pillarsData.length + 3}</span>
                </div>
            </div>
        </div>
    );
});

export default ReportTemplate;