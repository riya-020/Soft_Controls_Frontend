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
        "Clarity – How clearly roles, responsibilities and behavioural expectations are communicated to employees.",
        "Role Modelling – Whether leadership consistently demonstrates the desired risk-conscious behaviour.",
        "Commitment – The degree to which employees take ownership and responsibility for risk management.",
        "Transparency – How openly information, misconduct and consequences are shared across the organisation.",
        "Discussability – How comfortably employees raise, discuss and escalate risks, concerns and dilemmas.",
        "Call Someone to Account – Whether employees hold each other accountable for actions and outcomes.",
        "Enforcement – How consistently policies, procedures and consequences are applied across the organisation.",
        "Achievability – Whether targets and expectations are realistic and attainable for employees.",
    ];

    return (
        <div style={{
            width: '794px',
            height: '1123px',
            overflow: 'hidden',
            padding: '28px',
            fontFamily: 'Arial',
            background: '#fff',
            boxSizing: 'border-box',
            pageBreakAfter: 'always',
            pageBreakInside: 'avoid',
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
            borderTop: '6px solid #00338D', width: '794px', height: '1123px',
            overflow: 'hidden', pageBreakAfter: 'always', pageBreakInside: 'avoid',
            fontFamily: 'Arial, sans-serif', background: '#fff',
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

// ─── Functional Risk Culture Insights Pages ───────────────────────────────────
// 1 function per page → 6 functions = 6 pages.
// 4 sections stacked VERTICALLY, full width. Professional report style.

const FI = {
    brand:       '#00338D',
    brandLight:  '#DBEAFE',
    borderLight: '#E5E7EB',
    text1:       '#1F2937',
    text2:       '#374151',
    text3:       '#6B7280',
    white:       '#FFFFFF',
};

const SECTION_META = [
    { key: 'ObservedRiskPattern',       label: 'Observed Risk Pattern',        bg: '#EEF2FF', borderClr: '#4F46E5', labelClr: '#3730A3' },
    { key: 'WhyRiskIsConcentratedHere', label: 'Why Risk Is Concentrated Here', bg: '#FFFBEB', borderClr: '#D97706', labelClr: '#92400E' },
    { key: 'FunctionalGap',             label: 'Functional Gap',                bg: '#F0FDF4', borderClr: '#16A34A', labelClr: '#14532D' },
    { key: 'BusinessImpact',            label: 'Business Impact',               bg: '#FFF1F2', borderClr: '#E11D48', labelClr: '#9F1239' },
];

function FIPageHeader() {
    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: `2px solid ${FI.brand}`,
            paddingBottom: 8, marginBottom: 22,
        }}>
            <span style={{ fontSize: 12, color: FI.brand, fontWeight: 700 }}>
                Soft Risk Culture Report
            </span>
            <span style={{ fontSize: 11, color: FI.text3, fontWeight: 600 }}>
                Functional Risk Culture Insights
            </span>
        </div>
    );
}

function FIPageFooter({ pageNum }) {
    return (
        <div style={{
            position: 'absolute', bottom: 20, left: 48, right: 48,
            display: 'flex', justifyContent: 'space-between',
            fontSize: 10, color: FI.text3,
            borderTop: `1px solid ${FI.borderLight}`, paddingTop: 6,
        }}>
            <span>Confidential</span>
            <span>Soft Control Assessment</span>
            <span>Page {pageNum}</span>
        </div>
    );
}

function FunctionPage({ item, pageNum, isFirst }) {
    return (
        <div style={{
            position: 'relative',
            padding: '36px 48px 64px',
            boxSizing: 'border-box',
            width: '210mm',
            height: '297mm',
            overflow: 'hidden',
            fontFamily: 'Arial, sans-serif',
            background: FI.white,
            pageBreakBefore: 'always',
            pageBreakAfter: 'always',
            pageBreakInside: 'avoid',
            borderTop: `6px solid ${FI.brand}`,
        }}>
            <FIPageHeader />

            {/* Section intro — first page only */}
            {isFirst && (
                <div style={{ marginBottom: 18 }}>
                    <h2 style={{
                        color: FI.brand, fontSize: 18, fontWeight: 700,
                        margin: '0 0 5px', letterSpacing: '-0.01em',
                    }}>
                        Functional Risk Culture Insights
                    </h2>
                    <p style={{ fontSize: 11, color: FI.text3, margin: '0 0 14px', lineHeight: 1.55 }}>
                        The following insights are inferred from organisation-wide behavioural patterns.
                        They do not represent direct measurement of individual functions or employees.
                    </p>
                    <div style={{ height: 1, background: FI.borderLight }} />
                </div>
            )}

            {/* Function name heading */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                marginBottom: 18,
            }}>
                <div style={{
                    background: FI.brand, color: FI.white,
                    padding: '6px 22px', borderRadius: 3,
                    fontSize: 15, fontWeight: 700, letterSpacing: 0.4,
                    flexShrink: 0,
                }}>
                    {item.Function}
                </div>
                <div style={{ flex: 1, height: 2, background: FI.brandLight }} />
            </div>

            {/* 4 sections — stacked vertically, full width */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {SECTION_META.map(({ key, label, bg, borderClr, labelClr }) => (
                    <div key={key} style={{
                        background:   bg,
                        borderLeft:   `4px solid ${borderClr}`,
                        borderRadius: '0 5px 5px 0',
                        padding:      '10px 16px',
                    }}>
                        {/* Label row */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            marginBottom: 6,
                        }}>
                            <div style={{
                                width: 6, height: 6, borderRadius: '50%',
                                background: borderClr, flexShrink: 0,
                            }} />
                            <span style={{
                                fontSize: 10, fontWeight: 700, color: labelClr,
                                textTransform: 'uppercase', letterSpacing: 0.8,
                            }}>
                                {label}
                            </span>
                        </div>
                        {/* Body */}
                        <p style={{
                            fontSize: 11, color: FI.text1,
                            lineHeight: 1.65, margin: 0,
                            fontFamily: 'Arial, sans-serif',
                        }}>
                            {item[key] || '—'}
                        </p>
                    </div>
                ))}
            </div>

            <FIPageFooter pageNum={pageNum} />
        </div>
    );
}

export function FunctionalInsightsPages({ data }) {
    if (!data || data.length === 0) return null;

    return (
        <>
            {data.map((item, idx) => (
                <FunctionPage
                    key={item.Function || idx}
                    item={item}
                    pageNum={`FI-${idx + 1}`}
                    isFirst={idx === 0}
                />
            ))}
        </>
    );
}