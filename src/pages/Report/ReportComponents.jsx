// ─── Introduction Page ────────────────────────────────────────────────────────
export function IntroductionPage() {

    const bullets = [
        "The International Standards for the Professional Practice of Internal Auditing stipulates that the internal auditor must pay explicit attention to soft controls.",
        "It is fundamental to risk management and employee conduct.",
        "Increasing regulatory attention is being paid to (risk) culture and conduct.",
        "In the Institute of Internal Auditors (IIA) surveys, over 50% of CAEs see organisational culture as an inherent high risk.",
        "Integrity is positively related to financial performance.",
        "Over 90% of CEOs and CFOs believe improving culture improves company value."
    ];

    const softControls = [
        "Incentives and Enforcement – Measures how employees are held accountable for misconduct and rewarded for risk-conscious behaviour.",
        "Comfort to Report – How safe employees feel when addressing misconduct or risky behaviour.",
        "Openness to Discuss Dilemmas – Frequency of discussions around ethical dilemmas.",
        "Transparency – How clearly misconduct and consequences are communicated.",
        "Clarity and Communication – How expectations for behaviour are communicated.",
        "Tone at the Top and Role Modelling – Whether leadership sets a strong example.",
        "Support of Employees – Whether employees are encouraged to use resources appropriately.",
        "Enabling Environment – Resources and support available to meet expectations."
    ];

    return (
        <div style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '28px',
            fontFamily: 'Arial',
            background: '#fff',
            boxSizing: 'border-box',
            pageBreakAfter: 'avoid',
            border: '1px solid #d9d9d9',
            borderTop: '6px solid #00338D',
        }}>

            {/* HEADER */}
            <h2 style={{
                color: '#00338D',
                borderBottom: '3px solid #00338D',
                paddingBottom: '6px',
                marginBottom: '14px'
            }}>
                INTRODUCTION
            </h2>

            {/* TOP SECTION */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>

                {/* TEXT BOX */}
                <div style={{
                    flex: 1,
                    border: '1px solid #ddd',
                    padding: '12px',
                    borderRadius: '6px'
                }}>
                    <h3 style={{ color: '#00338D', fontSize: '13px', marginBottom: '6px' }}>
                        IMPORTANCE OF CULTURE & BEHAVIOUR
                    </h3>

                    <p style={{ fontSize: '11.5px', lineHeight: 1.5 }}>
                        Organisational culture plays a critical role in shaping employee behaviour and risk outcomes.
                        Increased regulatory focus has highlighted the need for measurable and auditable cultural drivers.
                    </p>

                    <p style={{ fontSize: '11.5px', lineHeight: 1.5 }}>
                        Internal audit functions provide assurance by evaluating behavioural controls and identifying
                        root causes behind control failures.
                    </p>

                    <ul style={{ fontSize: '11.5px', paddingLeft: '14px', marginTop: '6px' }}>
                        {bullets.slice(0, 3).map((b, i) => (
                            <li key={i}>{b}</li>
                        ))}
                    </ul>
                </div>

                {/* IMAGE 1 */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    background: '#f9fafc',
                    padding: '8px'
                }}>
                    <img
                        src="/RiskCulture.webp"
                        alt="Risk Culture"
                        style={{ width: '100%', maxHeight: '160px', objectFit: 'contain' }}
                    />
                </div>
            </div>

            {/* BLUE STRIP */}
            <div style={{
                background: '#00338D',
                color: 'white',
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '14px'
            }}>
                <p style={{ fontSize: '11.5px', lineHeight: 1.5, margin: 0 }}>
                    Our approach integrates <b>entity-level governance</b>, <b>process-level behavioural controls</b>,
                    and <b>root cause analysis</b> to assess how culture influences decision-making and risk management.
                </p>
            </div>

            {/* BOTTOM SECTION */}
            <div style={{ display: 'flex', gap: '16px' }}>

                {/* SOFT CONTROLS GRID */}
                <div style={{ flex: 1.3 }}>
                    <h3 style={{ color: '#00338D', marginBottom: '8px', fontSize: '13px' }}>
                        THE 8 SOFT CONTROLS
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px'
                    }}>
                        {softControls.map((s, i) => {
                            const [title, desc] = s.split(' – ');
                            return (
                                <div key={i} style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    background: '#F9FAFB'
                                }}>
                                    <div style={{
                                        fontSize: '11.5px',
                                        fontWeight: 'bold',
                                        color: '#00338D'
                                    }}>
                                        {title}
                                    </div>
                                    <div style={{
                                        fontSize: '10.5px',
                                        color: '#374151',
                                        lineHeight: 1.3
                                    }}>
                                        {desc}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* IMAGE 2 + INSIGHT BOX */}
                <div style={{
                    flex: 0.7,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <div style={{
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        padding: '8px',
                        background: '#f9fafc'
                    }}>
                        <img
                            src="/Softcontrol.png"
                            alt="Soft Controls"
                            style={{ width: '100%', maxHeight: '180px', objectFit: 'contain' }}
                        />
                    </div>

                    <div style={{
                        marginTop: '8px',
                        padding: '10px',
                        borderRadius: '6px',
                        background: '#EEF3F8',
                        borderLeft: '4px solid #00338D'
                    }}>
                        <div style={{
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: '#00338D',
                            marginBottom: '4px'
                        }}>
                            Key Insight
                        </div>
                        <div style={{
                            fontSize: '10.5px',
                            color: '#374151',
                            lineHeight: 1.4
                        }}>
                            A strong risk culture enables organisations to proactively identify,
                            assess, and respond to risks. Embedding these soft controls ensures
                            consistency in behaviour, accountability, and long-term value creation.
                        </div>
                    </div>
                </div>
            </div>

            {/* KPMG + RISK CULTURE SIDE BY SIDE */}
            <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '10px'
            }}>

                {/* LEFT: KPMG MODEL */}
                <div style={{
                    flex: 1,
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    padding: '10px',
                    background: '#FAFAFA'
                }}>
                    <h3 style={{
                        color: '#00338D',
                        fontSize: '12.5px',
                        marginBottom: '5px'
                    }}>
                        KPMG's Soft Controls Model
                    </h3>

                    <p style={{
                        fontSize: '10px',
                        lineHeight: 1.35,
                        color: '#374151',
                        margin: 0
                    }}>
                        It is necessary to consider the human factors that influence culture to truly understand
                        what is happening within an organisation. KPMG integrates soft controls into audit
                        methodologies to identify, measure, and monitor behavioural drivers.
                    </p>

                    <p style={{
                        fontSize: '10px',
                        lineHeight: 1.35,
                        color: '#374151',
                        marginTop: '4px'
                    }}>
                        The KPMG Risk Culture Model provides firms with a framework to evaluate their risk culture,
                        assess the top priorities and implement changes to adapt to emerging risks and focus areas.
                        Following rigorous scientific analysis on 150 cases of misconduct within organisations, it was
                        found that there are eight cultural factors that are highly influential in driving behavioural
                        patterns within organisations.
                    </p>

                    <p style={{
                        fontSize: '10px',
                        lineHeight: 1.35,
                        color: '#374151',
                        marginTop: '4px',
                        marginBottom: 0
                    }}>
                        Based on research by Prof. Dr. Muel Kaptein, this model has been applied globally to
                        strengthen risk culture and governance frameworks.
                    </p>
                </div>

                {/* RIGHT: STRENGTHENING RISK CULTURE */}
                <div style={{
                    flex: 1,
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    padding: '10px',
                    background: '#433ede'
                }}>
                    <h3 style={{
                        color: '#ffffff',
                        fontSize: '14px',
                        marginBottom: '5px',
                        marginTop: 0
                    }}>
                        Strengthening your Risk Culture
                    </h3>

                    <p style={{
                        fontSize: '13px',
                        lineHeight: 1.3,
                        color: '#ffffff',
                        marginBottom: '6px',
                        marginTop: '4px',
                    }}>
                        Increasing regulatory scrutiny and evolving risks are key drivers for organisations to
                        enhance their risk culture. Impactful management is not possible without effective
                        measurement. It is essential that KPIs and metrics continuously evolve to meet the
                        changing demands of both existing and emerging risks.
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '5px',
                        marginTop: '7px',
                    }}>
                        {[
                            { text: 'Reduced fraud & integrity risk', icon: '🛡️' },
                            { text: 'Enhanced public reputation',     icon: '🌍' },
                            { text: 'Improved compliance',            icon: '📜' },
                            { text: 'Promotes innovation',            icon: '💡' },
                            { text: 'Increased financial performance', icon: '📈' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '13px',
                                color: '#e2f5f3'
                            }}>
                                <span>{item.icon}</span>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


// ─── Recommendations Page ─────────────────────────────────────────────────────
export function RecommendationsPage({ recommendations }) {
    const defaultRecs = [
        { theme: 'Discussability Forums',   action: 'Establish structured risk discussion forums across teams',        impact: 'Improves transparency and open dialogue',                  priority: 'High'   },
        { theme: 'Leadership Role Modelling', action: 'Strengthen tone-at-the-top messaging on risk management',      impact: 'Encourages behavioural alignment across employees',         priority: 'High'   },
        { theme: 'Policy Awareness',        action: 'Enhance communication of risk policies and procedures',          impact: 'Improves clarity of responsibilities and expectations',     priority: 'Medium' },
        { theme: 'Enforcement',             action: 'Introduce scenario-based risk management training',              impact: 'Builds employee confidence in managing risks',              priority: 'Medium' },
        { theme: 'Transparency',            action: 'Promote awareness of speak-up and escalation channels',          impact: 'Strengthens psychological safety for reporting concerns',   priority: 'High'   },
        { theme: 'Accountability Framework', action: 'Embed risk ownership within performance objectives',            impact: 'Reinforces accountability and behavioural consistency',     priority: 'Medium' },
    ];

    const recs = recommendations?.length > 0 ? recommendations : defaultRecs;
    const priorityColor = p => p === 'High' ? '#C62828' : p === 'Medium' ? '#F9A825' : '#2E7D32';
    const priorityBg    = p => p === 'High' ? '#ffebee' : p === 'Medium' ? '#fff8e1' : '#e8f5e9';

    return (
        <div style={{
            padding: '50px', boxSizing: 'border-box', border: '1px solid #d9d9d9',
            borderTop: '6px solid #00338D', width: '210mm', minHeight: '297mm',
            pageBreakAfter: 'auto', fontFamily: 'Arial, sans-serif', background: '#fff',
            position: 'relative',
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