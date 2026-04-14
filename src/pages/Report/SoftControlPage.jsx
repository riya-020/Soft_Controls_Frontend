// SoftControlPage.jsx — TWO A4 pages per soft control, PDF-safe rendering

const A4 = {
    position: 'relative',
    padding: '36px 48px 64px',
    boxSizing: 'border-box',
    width: '210mm',
    height: '297mm',
    overflow: 'hidden',
    fontFamily: 'Arial, sans-serif',
    background: '#ffffff',
    pageBreakAfter: 'always',
    pageBreakInside: 'avoid',
    borderTop: '6px solid #00338D',
};

const riskColor = r =>
    r?.toLowerCase().includes('high')   ? '#B71C1C' :
    r?.toLowerCase().includes('medium') ? '#E65100' : '#1B5E20';

const perfColors = c =>
    c === 'green' ? { bg: '#E8F5E9', text: '#1B5E20' } :
    c === 'amber' ? { bg: '#FFF3E0', text: '#E65100' } :
                    { bg: '#FFEBEE', text: '#B71C1C' };

const PageHeader = ({ title }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '2px solid #00338D', paddingBottom: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: '#00338D', fontWeight: 700 }}>Soft Risk Culture Report</span>
        <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>{title}</span>
    </div>
);

const PageFooter = ({ pageNum }) => (
    <div style={{ position: 'absolute', bottom: 20, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between',
        fontSize: 10, color: '#9CA3AF', borderTop: '1px solid #E5E7EB', paddingTop: 6 }}>
        <span>Confidential</span>
        <span>Soft Control Assessment</span>
        <span>Page {pageNum}</span>
    </div>
);

const H3 = ({ children }) => (
    <h3 style={{ color: '#00338D', fontSize: 13, fontWeight: 700,
        margin: '18px 0 8px', paddingBottom: 4, borderBottom: '1px solid #DBEAFE' }}>
        {children}
    </h3>
);

// ─── PAGE A  —  Score / Definition / Executive Summary / Gap Analysis / Dimension table ────────
const PageA = ({ title, score, risk, leaderScore, employeeScore, dimensions, insights, pageNum }) => (
    <div style={A4}>
        <PageHeader title={title} />

        {/* Row 1: Title + Score (left) | Definition (right) */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 16, alignItems: 'flex-start' }}>
            {/* Left: title + score */}
            <div style={{ flex: '0 0 auto' }}>
                <h2 style={{ color: '#00338D', fontSize: 20, margin: '0 0 10px' }}>{title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 52, fontWeight: 700, color: '#00338D', lineHeight: 1 }}>{score}</span>
                    <div>
                        <span style={{ display: 'inline-block', background: riskColor(risk), color: 'white',
                            padding: '5px 16px', borderRadius: 20, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
                            {risk}
                        </span>
                        <div style={{ fontSize: 10, color: '#6B7280' }}>Employee Perception Score (out of 100)</div>
                    </div>
                </div>
            </div>

            {/* Right: Definition box */}
            <div style={{ flex: 1, background: '#F8FAFC', borderLeft: '3px solid #00338D',
                borderRadius: '0 4px 4px 0', padding: '10px 14px', alignSelf: 'stretch' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#00338D', textTransform: 'uppercase',
                    letterSpacing: 0.5, marginBottom: 5 }}>Definition</div>
                <p style={{ fontSize: 11, color: '#374151', lineHeight: 1.65, margin: 0 }}>
                    This soft control reflects the behavioural drivers that influence how openly employees discuss
                    risks, concerns and mistakes. Strong performance in <strong>{title}</strong> improves
                    organisational learning and strengthens the overall governance environment.
                </p>
            </div>
        </div>

        {/* Section 2: Executive Insight Summary */}
        <H3>Executive Insight Summary</H3>
        {insights?.executiveSummary?.length > 0 ? (
            <div style={{ background: '#F0F4FF', borderRadius: 6, padding: '8px 12px',
                borderLeft: '3px solid #4F46E5', marginBottom: 14 }}>
                {insights.executiveSummary.map((line, i) => (
                    <div key={i} style={{ display: 'flex', gap: 7,
                        marginBottom: i < insights.executiveSummary.length - 1 ? 5 : 0 }}>
                        <span style={{ color: '#4F46E5', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>•</span>
                        <span style={{ fontSize: 11, color: '#1E293B', lineHeight: 1.55 }}>{line}</span>
                    </div>
                ))}
            </div>
        ) : (
            <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 14 }}>No executive summary available.</p>
        )}

        {/* Section 3: Leader vs Employee Gap Analysis */}
        <H3>Leader vs Employee Gap Analysis</H3>
        {insights?.gapAnalysis ? (
            <div style={{ background: '#FFFBEB', borderRadius: 6, padding: '8px 12px',
                borderLeft: '3px solid #F59E0B', marginBottom: 14 }}>
                {insights.gapAnalysis.summary && (
                    <p style={{ margin: '0 0 7px', fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
                        {insights.gapAnalysis.summary}
                    </p>
                )}
                {insights.gapAnalysis.points?.filter(p => p).map((point, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                        <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>–</span>
                        <span style={{ fontSize: 10.5, color: '#6B7280', lineHeight: 1.5 }}>{point}</span>
                    </div>
                ))}
            </div>
        ) : (
            <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 14 }}>No gap analysis available.</p>
        )}

        {/* Section 4: Dimension Performance Table */}
        <H3>Dimension Performance</H3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
            <thead>
                <tr style={{ background: '#00338D' }}>
                    {[
                        { label: 'Dimension',   w: '60%', align: 'left'   },
                        { label: 'Score',       w: '15%', align: 'center' },
                        { label: 'Performance', w: '25%', align: 'center' },
                    ].map(({ label, w, align }, i) => (
                        <th key={i} style={{ color: 'white', padding: '8px 10px', textAlign: align,
                            fontWeight: 700, fontSize: 11, width: w }}>
                            {label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {dimensions.map((d, i) => {
                    const pc = perfColors(d.color);
                    return (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F9FAFB' }}>
                            <td style={{ padding: '8px 10px', borderBottom: '1px solid #E5E7EB', color: '#1F2937', fontSize: 11 }}>{d.name}</td>
                            <td style={{ padding: '8px 10px', borderBottom: '1px solid #E5E7EB', textAlign: 'center', fontWeight: 700, color: '#00338D' }}>{d.score}</td>
                            <td style={{ padding: '8px 10px', borderBottom: '1px solid #E5E7EB', textAlign: 'center' }}>
                                <span style={{ background: pc.bg, color: pc.text,
                                    padding: '2px 8px', borderRadius: 3, fontWeight: 700, fontSize: 10 }}>
                                    {d.performance}
                                </span>
                            </td>
                        </tr>
                    );
                })}
                {dimensions.length === 0 && (
                    <tr>
                        <td colSpan={3} style={{ padding: 14, textAlign: 'center', color: '#9CA3AF', fontSize: 11 }}>
                            No dimension data available
                        </td>
                    </tr>
                )}
            </tbody>
        </table>

        {/* Section 5: Key Dimension Insights */}
        {insights?.dimensionInsights?.length > 0 && (
            <>
                <H3>Key Dimension Insights</H3>
                <div style={{ background: '#F8FAFF', borderRadius: 6, padding: '8px 12px',
                    borderLeft: '3px solid #00338D' }}>
                    {insights.dimensionInsights.map((line, i) => (
                        <div key={i} style={{ display: 'flex', gap: 7,
                            marginBottom: i < insights.dimensionInsights.length - 1 ? 4 : 0 }}>
                            <span style={{ color: '#00338D', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{'>'}</span>
                            <span style={{ fontSize: 10.5, color: '#374151', lineHeight: 1.5 }}>{line}</span>
                        </div>
                    ))}
                </div>
            </>
        )}

        <PageFooter pageNum={pageNum} />
    </div>
);

// ─── PAGE B  —  Survey Questions + Recommendations ────────────────────────────
const PageB = ({ title, dimensions, recommendations, pageNum }) => {
    const sevColor = s => s === 'High' ? '#B71C1C' : s === 'Medium' ? '#E65100' : '#1B5E20';

    return (
        <div style={A4}>
            <PageHeader title={title} />

            <H3>Survey Question Responses</H3>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginBottom: 14 }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #D1D5DB' }}>
                        {[
                            { h: 'Survey Question', w: '70%', a: 'left'   },
                            { h: 'Favourable',      w: '15%', a: 'center' },
                            { h: 'Unfavourable',    w: '15%', a: 'center' },
                        ].map(({ h, w, a }, i) => (
                            <th key={i} style={{ padding: '7px 9px', textAlign: a, color: '#6B7280',
                                fontWeight: 600, fontSize: 10, width: w }}>
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dimensions.map((d, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #E5E7EB', verticalAlign: 'top' }}>
                            <td style={{ padding: '9px 9px', color: '#374151', lineHeight: 1.5, fontSize: 10.5 }}>{d.question || '—'}</td>
                            <td style={{ padding: '9px 9px', textAlign: 'center', verticalAlign: 'middle' }}>
                                <span style={{ display: 'inline-block', background: '#E8F5E9', color: '#1B5E20',
                                    padding: '3px 7px', borderRadius: 4, fontWeight: 700, fontSize: 10.5, minWidth: 38 }}>
                                    {d.favorable}%
                                </span>
                            </td>
                            <td style={{ padding: '9px 9px', textAlign: 'center', verticalAlign: 'middle' }}>
                                <span style={{ display: 'inline-block', background: '#FFEBEE', color: '#B71C1C',
                                    padding: '3px 7px', borderRadius: 4, fontWeight: 700, fontSize: 10.5, minWidth: 38 }}>
                                    {d.unfavorable}%
                                </span>
                            </td>
                        </tr>
                    ))}
                    {dimensions.length === 0 && (
                        <tr><td colSpan={3} style={{ padding: 14, textAlign: 'center', color: '#9CA3AF' }}>No data</td></tr>
                    )}
                </tbody>
            </table>

            <H3>
                Recommendations for {title}
                {recommendations.length === 0 && (
                    <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 400, marginLeft: 8 }}>(API offline — no data)</span>
                )}
            </H3>

            {recommendations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {recommendations.map((rec, i) => (
                        <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 5, overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                background: '#F3F4F6', padding: '7px 12px', borderBottom: '1px solid #E5E7EB' }}>
                                <span style={{ fontWeight: 700, color: '#1F2937', fontSize: 12 }}>{rec.title}</span>
                                <span style={{ background: sevColor(rec.severity), color: 'white',
                                    padding: '2px 10px', borderRadius: 10, fontSize: 10, fontWeight: 700 }}>{rec.severity}</span>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        {[{ label: 'Why', val: rec.why }, { label: 'What to do', val: rec.what }].map(({ label, val }, ci) => (
                                            <td key={ci} style={{ padding: '7px 12px', width: '50%', verticalAlign: 'top',
                                                borderBottom: '1px solid #E5E7EB',
                                                borderRight: ci === 0 ? '1px solid #E5E7EB' : 'none' }}>
                                                <div style={{ fontSize: 9, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 2 }}>{label}</div>
                                                <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.5 }}>{val || '—'}</div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        {[{ label: 'Who leads', val: rec.who }, { label: 'Timeline', val: rec.when }].map(({ label, val }, ci) => (
                                            <td key={ci} style={{ padding: '7px 12px', width: '50%', verticalAlign: 'top',
                                                borderRight: ci === 0 ? '1px solid #E5E7EB' : 'none' }}>
                                                <div style={{ fontSize: 9, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 2 }}>{label}</div>
                                                <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.5 }}>{val || '—'}</div>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                            {rec.impact && (
                                <div style={{ padding: '6px 12px', background: '#EFF6FF', borderTop: '1px solid #DBEAFE' }}>
                                    <span style={{ fontSize: 9, fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: 0.4 }}>Expected Impact: </span>
                                    <span style={{ fontSize: 11, color: '#1E40AF' }}>{rec.impact}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ border: '1px dashed #D1D5DB', borderRadius: 5, padding: '20px',
                    textAlign: 'center', color: '#9CA3AF', fontSize: 11, background: '#F9FAFB' }}>
                    Recommendations will appear here once the /recommendation API is online.
                </div>
            )}

            <PageFooter pageNum={pageNum} />
        </div>
    );
};

export default function SoftControlPage({ title, score, risk, leaderScore, employeeScore, dimensions, recommendations, insights, pageNum }) {
    return (
        <>
            <PageA title={title} score={score} risk={risk}
                leaderScore={leaderScore} employeeScore={employeeScore}
                dimensions={dimensions} insights={insights} pageNum={pageNum} />
            <PageB title={title} dimensions={dimensions}
                recommendations={recommendations || []} pageNum={pageNum + 1} />
        </>
    );
}