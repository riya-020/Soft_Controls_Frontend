// ─── Introduction Page ────────────────────────────────────────────────────────
export function IntroductionPage() {
    const controls = [
        { name: 'Clarity',        desc: 'Clear expectations and responsibilities' },
        { name: 'Role Modelling', desc: 'Leadership demonstrating desired behaviour' },
        { name: 'Commitment',     desc: 'Employee ownership and responsibility' },
        { name: 'Transparency',   desc: 'Open communication and information sharing' },
        { name: 'Discussability', desc: 'Comfort discussing risks and concerns' },
        { name: 'Enforcement',    desc: 'Consistent application of policies' },
        { name: 'Achievability',  desc: 'Targets are practical and attainable' },
        { name: 'Call Someone to Account', desc: 'Peer accountability for non-compliant behaviour' },
    ];

    return (
        <div style={{
            padding: '50px', boxSizing: 'border-box', border: '1px solid #d9d9d9',
            borderTop: '6px solid #00338D', width: '210mm', minHeight: '297mm',
            pageBreakAfter: 'always', fontFamily: 'Arial, sans-serif', background: '#fff',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #00338D', paddingBottom: 10, marginBottom: 28 }}>
                <div style={{ fontSize: 13, color: '#00338D', fontWeight: 'bold' }}>Soft Risk Culture Report</div>
                <div style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>Introduction</div>
            </div>

            <h2 style={{ color: '#00338D', fontSize: 24, marginBottom: 16 }}>Introduction to Soft Risk Culture</h2>

            <p style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 14, color: '#374151' }}>
                Organizational risk culture plays a critical role in determining how individuals perceive, discuss,
                and respond to risk within their daily activities. While formal governance structures such as policies,
                procedures and internal controls provide a framework for managing risks, the effectiveness of these
                mechanisms is largely influenced by behavioural and cultural factors within the organization.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 24, color: '#374151' }}>
                The Soft Controls Deep Dive assessment evaluates underlying cultural drivers that influence
                decision-making, accountability, transparency and openness across teams. By analysing these
                behavioural dimensions, organizations can better understand how risk awareness is embedded in
                everyday operations and identify opportunities to strengthen their overall control environment.
            </p>

            <div style={{ borderLeft: '4px solid #00338D', background: '#eff6ff', padding: '12px 16px', marginBottom: 28 }}>
                <p style={{ fontSize: 13, color: '#1e40af', margin: 0, lineHeight: 1.7 }}>
                    The assessment focuses on key behavioural drivers that influence how employees understand
                    expectations, communicate concerns and take responsibility for risk-related decisions.
                </p>
            </div>

            <h3 style={{ color: '#00338D', fontSize: 17, marginBottom: 14 }}>Key Soft Control Dimensions</h3>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ background: '#00338D', color: 'white', padding: '10px 12px', textAlign: 'left', fontSize: 13, width: '35%' }}>Soft Control</th>
                        <th style={{ background: '#00338D', color: 'white', padding: '10px 12px', textAlign: 'left', fontSize: 13 }}>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {controls.map((c, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f0f4ff' }}>
                            <td style={{ padding: '10px 12px', border: '1px solid #d1d5db', fontWeight: 600, fontSize: 13 }}>{c.name}</td>
                            <td style={{ padding: '10px 12px', border: '1px solid #d1d5db', fontSize: 13, color: '#374151' }}>{c.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Recommendations Page ─────────────────────────────────────────────────────
export function RecommendationsPage({ recommendations }) {
    const defaultRecs = [
        { theme: 'Discussability Forums',    action: 'Establish structured risk discussion forums across teams',           impact: 'Improves transparency and open dialogue',                        priority: 'High' },
        { theme: 'Leadership Role Modelling',action: 'Strengthen tone-at-the-top messaging on risk management',           impact: 'Encourages behavioural alignment across employees',               priority: 'High' },
        { theme: 'Policy Awareness',         action: 'Enhance communication of risk policies and procedures',             impact: 'Improves clarity of responsibilities and expectations',           priority: 'Medium' },
        { theme: 'Enforcement',              action: 'Introduce scenario-based risk management training',                 impact: 'Builds employee confidence in managing risks',                    priority: 'Medium' },
        { theme: 'Transparency',             action: 'Promote awareness of speak-up and escalation channels',            impact: 'Strengthens psychological safety for reporting concerns',         priority: 'High' },
        { theme: 'Accountability Framework', action: 'Embed risk ownership within performance objectives',               impact: 'Reinforces accountability and behavioural consistency',           priority: 'Medium' },
    ];

    const recs = recommendations?.length > 0 ? recommendations : defaultRecs;
    const priorityColor = p => p === 'High' ? '#C62828' : p === 'Medium' ? '#F9A825' : '#2E7D32';
    const priorityBg    = p => p === 'High' ? '#ffebee' : p === 'Medium' ? '#fff8e1' : '#e8f5e9';

    return (
        <div style={{
            padding: '50px', boxSizing: 'border-box', border: '1px solid #d9d9d9',
            borderTop: '6px solid #00338D', width: '210mm', minHeight: '297mm',
            pageBreakAfter: 'auto', fontFamily: 'Arial, sans-serif', background: '#fff',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #00338D', paddingBottom: 10, marginBottom: 28 }}>
                <div style={{ fontSize: 13, color: '#00338D', fontWeight: 'bold' }}>Soft Risk Culture Report</div>
                <div style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>Recommendations</div>
            </div>

            <h2 style={{ color: '#00338D', fontSize: 24, marginBottom: 10 }}>Key Recommendations</h2>
            <p style={{ fontSize: 13, color: '#374151', marginBottom: 28, lineHeight: 1.7 }}>
                Based on the Soft Controls Deep Dive assessment, the following recommendations are proposed
                to strengthen the organization's risk culture and enhance behavioural drivers that support
                effective governance and decision-making.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Arial, sans-serif' }}>
                <thead>
                    <tr>
                        {['Theme', 'Recommendation', 'Expected Impact', 'Priority'].map((h, i) => (
                            <th key={i} style={{ background: '#00338D', color: 'white', textAlign: 'left', padding: '12px', fontSize: 13, letterSpacing: 0.3 }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {recs.map((r, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#e8f0ff' }}>
                            <td style={{ padding: '11px 12px', borderBottom: '1px solid #e5e7eb', fontSize: 13, fontWeight: 600, color: '#00338D' }}>{r.theme}</td>
                            <td style={{ padding: '11px 12px', borderBottom: '1px solid #e5e7eb', fontSize: 13, color: '#374151' }}>{r.action}</td>
                            <td style={{ padding: '11px 12px', borderBottom: '1px solid #e5e7eb', fontSize: 13, color: '#374151' }}>{r.impact}</td>
                            <td style={{ padding: '11px 12px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>
                                <span style={{ background: priorityBg(r.priority), color: priorityColor(r.priority), padding: '4px 12px', borderRadius: 4, fontWeight: 700, fontSize: 12 }}>
                                    {r.priority}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer */}
            <div style={{ position: 'absolute', bottom: 24, left: 50, right: 50, display: 'flex', justifyContent: 'space-between', fontSize: 11, borderTop: '1px solid #ccc', paddingTop: 8, color: '#666' }}>
                <span>Confidential</span>
                <span>Soft Control Assessment</span>
                <span>© {new Date().getFullYear()} KPMG</span>
            </div>
        </div>
    );
}
