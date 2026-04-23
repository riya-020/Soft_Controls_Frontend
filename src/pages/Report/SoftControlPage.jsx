// SoftControlPage.jsx — TWO A4 pages per soft control, PDF-safe rendering
// Design tokens centralised — edit T to retheme the entire report

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  brand:        '#00338D',
  brandLight:   '#DBEAFE',
  brandFaint:   '#F0F4FF',
  text1:        '#1F2937',
  text2:        '#1F2937',
  text3:        '#6B7280',
  text4:        '#9CA3AF',
  border:       '#E5E7EB',
  borderLight:  '#F3F4F6',
  rowAlt:       '#F9FAFB',
  surface:      '#F8FAFC',
  white:        '#FFFFFF',
  riskHigh:     '#B71C1C',
  riskMed:      '#E65100',
  riskLow:      '#1B5E20',
  perfGreenBg:  '#E8F5E9',
  perfGreenTxt: '#1B5E20',
  perfAmberBg:  '#FFF3E0',
  perfAmberTxt: '#E65100',
  perfRedBg:    '#FFEBEE',
  perfRedTxt:   '#B71C1C',
  sevHigh:      '#B71C1C',
  sevMed:       '#E65100',
  sevLow:       '#1B5E20',
  accentInsight:   '#4F46E5',
  accentGap:       '#F59E0B',
  accentGapBg:     '#FFFBEB',
  accentInsightBg: '#F0F4FF',
  impactBg:     '#EFF6FF',
  impactBorder: '#DBEAFE',
  impactTxt:    '#1D4ED8',
  impactVal:    '#1E40AF',

  // Rec card section colours
  whatWhyBg:     '#FFF7ED',
  whatWhyBorder: '#FB923C',
  whatWhyLbl:    '#C2410C',
  howBg:         '#EFF6FF',
  howBorder:     '#3B82F6',
  howLbl:        '#1D4ED8',
  impactBg2:     '#F0FDF4',
  impactBorder2: '#16A34A',
  impactLbl2:    '#14532D',
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const riskColor = r =>
    r?.toLowerCase().includes('high')   ? T.riskHigh :
    r?.toLowerCase().includes('medium') ? T.riskMed  : T.riskLow;

const perfColors = c =>
    c === 'green' ? { bg: T.perfGreenBg, text: T.perfGreenTxt } :
    c === 'amber' ? { bg: T.perfAmberBg, text: T.perfAmberTxt } :
                    { bg: T.perfRedBg,   text: T.perfRedTxt   };

const sevColor = s =>
    s === 'High'   ? T.sevHigh :
    s === 'Medium' ? T.sevMed  : T.sevLow;

// ─── SHARED A4 SHELL ──────────────────────────────────────────────────────────
const A4 = {
    position:        'relative',
    padding:         '28px 44px 56px',
    boxSizing:       'border-box',
    width:           '210mm',
    height:          '297mm',
    overflow:        'hidden',
    fontFamily:      'Arial, sans-serif',
    fontSize:        12,
    color:           '#1F2937',
    background:      T.white,
    pageBreakAfter:  'always',
    pageBreakInside: 'avoid',
    borderTop:       `6px solid ${T.brand}`,
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const PageHeader = ({ title }) => (
    <div style={{
        display:       'flex',
        justifyContent:'space-between',
        alignItems:    'center',
        borderBottom:  `2px solid ${T.brand}`,
        paddingBottom: 8,
        marginBottom:  20,
    }}>
        <span style={{ fontSize: 12, color: T.brand, fontWeight: 700 }}>
            Soft Risk Culture Report
        </span>
        <span style={{ fontSize: 12, color: T.text2, fontWeight: 700 }}>
            {title}
        </span>
    </div>
);

const PageFooter = ({ pageNum }) => (
    <div style={{
        position:       'absolute',
        bottom:         20,
        left:           48,
        right:          48,
        display:        'flex',
        justifyContent: 'space-between',
        fontSize:       10,
        color:          T.text4,
        borderTop:      `1px solid ${T.border}`,
        paddingTop:     6,
    }}>
        <span>Confidential</span>
        <span>Soft Control Assessment</span>
        <span>Page {pageNum}</span>
    </div>
);

const H3 = ({ children }) => (
    <h3 style={{
        color:         T.brand,
        fontSize:      15,
        fontWeight:    700,
        margin:        '14px 0 7px',
        paddingBottom: 4,
        borderBottom:  `1px solid ${T.brandLight}`,
    }}>
        {children}
    </h3>
);

const MetaLabel = ({ children, color = T.brand }) => (
    <div style={{
        fontSize:      10,
        fontWeight:    700,
        color,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom:  5,
    }}>
        {children}
    </div>
);

const Callout = ({ bg, borderColor, children, mb = 12 }) => (
    <div style={{
        background:   bg,
        borderRadius: '0 6px 6px 0',
        padding:      '10px 14px',
        borderLeft:   `4px solid ${borderColor}`,
        marginBottom: mb,
    }}>
        {children}
    </div>
);

const BulletLine = ({ bullet, color, children, mb = 5, last = false }) => (
    <div style={{ display: 'flex', gap: 8, marginBottom: last ? 0 : mb }}>
        <span style={{ color, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{bullet}</span>
        <span style={{ fontSize: 12, color: T.text1, lineHeight: 1.7 }}>{children}</span>
    </div>
);

// ─── PAGE A ───────────────────────────────────────────────────────────────────
const PageA = ({ title, score, risk, leaderScore, employeeScore, dimensions, insights, pageNum }) => (
    <div style={A4}>
        <PageHeader title={title} />

        <div style={{ display: 'flex', gap: 20, marginBottom: 16, alignItems: 'flex-start' }}>
            <div style={{ flex: '0 0 auto' }}>
                <h2 style={{ color: T.brand, fontSize: 20, fontWeight: 700, margin: '0 0 10px' }}>
                    {title}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 48, fontWeight: 700, color: T.brand, lineHeight: 1 }}>
                        {score}
                    </span>
                    <div>
                        <span style={{
                            display: 'inline-block', background: riskColor(risk),
                            color: T.white, padding: '5px 16px', borderRadius: 20,
                            fontWeight: 700, fontSize: 11, marginBottom: 4,
                        }}>
                            {risk}
                        </span>
                        <div style={{ fontSize: 10, color: T.text3 }}>
                            Employee Perception Score (out of 100)
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                flex: 1, background: T.surface,
                borderLeft: `3px solid ${T.brand}`,
                borderRadius: '0 4px 4px 0',
                padding: '10px 14px', alignSelf: 'stretch',
            }}>
                <MetaLabel>Definition</MetaLabel>
                <p style={{ fontSize: 11, color: T.text2, lineHeight: 1.65, margin: 0 }}>
                    This soft control reflects the behavioural drivers that influence how openly employees
                    discuss risks, concerns and mistakes. Strong performance in{' '}
                    <strong>{title}</strong> improves organisational learning and strengthens the overall
                    governance environment.
                </p>
            </div>
        </div>

        <H3>Executive Insight Summary</H3>
        {insights?.executiveSummary?.length > 0 ? (
            <Callout bg={T.accentInsightBg} borderColor={T.accentInsight}>
                {insights.executiveSummary.map((line, i) => (
                    <BulletLine key={i} bullet="•" color={T.accentInsight} last={i === insights.executiveSummary.length - 1}>
                        {line}
                    </BulletLine>
                ))}
            </Callout>
        ) : (
            <p style={{ fontSize: 11, color: T.text4, marginBottom: 14 }}>No executive summary available.</p>
        )}

        <H3>Leader vs Employee Gap Analysis</H3>
        {insights?.gapAnalysis ? (
            <Callout bg={T.accentGapBg} borderColor={T.accentGap}>
                {insights.gapAnalysis.summary && (
                    <BulletLine bullet="•" color={T.accentGap} mb={6}>
                        {insights.gapAnalysis.summary}
                    </BulletLine>
                )}
                {insights.gapAnalysis.points?.filter(Boolean).map((point, i) => (
                    <BulletLine key={i} bullet="•" color={T.accentGap} mb={4}
                        last={i === insights.gapAnalysis.points.filter(Boolean).length - 1}>
                        {point}
                    </BulletLine>
                ))}
            </Callout>
        ) : (
            <p style={{ fontSize: 11, color: T.text4, marginBottom: 14 }}>No gap analysis available.</p>
        )}

        <H3>Dimension Performance</H3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
                <tr style={{ background: T.brand }}>
                    {[
                        { label: 'Dimension',   w: '60%', align: 'left'   },
                        { label: 'Score',       w: '15%', align: 'center' },
                        { label: 'Performance', w: '25%', align: 'center' },
                    ].map(({ label, w, align }, i) => (
                        <th key={i} style={{ color: T.white, padding: '8px 10px', textAlign: align, fontWeight: 700, fontSize: 11, width: w }}>
                            {label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {dimensions.map((d, i) => {
                    const pc = perfColors(d.color);
                    return (
                        <tr key={i} style={{ background: i % 2 === 0 ? T.white : T.rowAlt }}>
                            <td style={{ padding: '8px 10px', borderBottom: `1px solid ${T.border}`, color: T.text1, fontSize: 11 }}>
                                {d.name}
                            </td>
                            <td style={{ padding: '8px 10px', borderBottom: `1px solid ${T.border}`, textAlign: 'center', fontWeight: 700, color: T.brand, fontSize: 11 }}>
                                {d.score}
                            </td>
                            <td style={{ padding: '8px 10px', borderBottom: `1px solid ${T.border}`, textAlign: 'center' }}>
                                <span style={{ background: pc.bg, color: pc.text, padding: '2px 8px', borderRadius: 3, fontWeight: 700, fontSize: 10 }}>
                                    {d.performance}
                                </span>
                            </td>
                        </tr>
                    );
                })}
                {dimensions.length === 0 && (
                    <tr>
                        <td colSpan={3} style={{ padding: 14, textAlign: 'center', color: T.text4, fontSize: 11 }}>
                            No dimension data available
                        </td>
                    </tr>
                )}
            </tbody>
        </table>

        {insights?.dimensionInsights?.length > 0 && (
            <>
                <H3>Key Dimension Insights</H3>
                <Callout bg={T.surface} borderColor={T.brand} mb={0}>
                    {insights.dimensionInsights.map((line, i) => (
                        <BulletLine key={i} bullet="›" color={T.brand} mb={4}
                            last={i === insights.dimensionInsights.length - 1}>
                            {line}
                        </BulletLine>
                    ))}
                </Callout>
            </>
        )}

        <PageFooter pageNum={pageNum} />
    </div>
);

// ─── REC SECTION ROW — reusable coloured callout row ─────────────────────────
const RecSection = ({ bg, borderColor, labelColor, label, value }) => {
    if (!value) return null;
    return (
        <div style={{
            background:  bg,
            borderLeft:  `3px solid ${borderColor}`,
            borderRadius:'0 4px 4px 0',
            padding:     '7px 11px',
            marginBottom: 0,
        }}>
            <div style={{
                fontSize:      9,
                fontWeight:    700,
                color:         labelColor,
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                marginBottom:  4,
            }}>
                {label}
            </div>
            <div style={{ fontSize: 11, color: T.text2, lineHeight: 1.6 }}>
                {value}
            </div>
        </div>
    );
};

// ─── PAGE B ───────────────────────────────────────────────────────────────────
const PageB = ({ title, dimensions, recommendations, pageNum }) => (
    <div style={A4}>
        <PageHeader title={title} />

        {/* Survey Question Responses */}
        <H3>Survey Question Responses</H3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginBottom: 14 }}>
            <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    {[
                        { h: 'Survey Question', w: '70%', a: 'left'   },
                        { h: 'Favourable',      w: '15%', a: 'center' },
                        { h: 'Unfavourable',    w: '15%', a: 'center' },
                    ].map(({ h, w, a }, i) => (
                        <th key={i} style={{ padding: '7px 10px', textAlign: a, color: T.text3, fontWeight: 700, fontSize: 10, width: w }}>
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {dimensions.map((d, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${T.border}`, verticalAlign: 'top', background: i % 2 === 0 ? T.white : T.rowAlt }}>
                        <td style={{ padding: '9px 10px', color: T.text2, lineHeight: 1.55, fontSize: 11 }}>
                            {d.question || '—'}
                        </td>
                        <td style={{ padding: '9px 10px', textAlign: 'center', verticalAlign: 'middle' }}>
                            <span style={{ display: 'inline-block', background: T.perfGreenBg, color: T.perfGreenTxt, padding: '3px 7px', borderRadius: 4, fontWeight: 700, fontSize: 11, minWidth: 38, textAlign: 'center' }}>
                                {d.favorable}%
                            </span>
                        </td>
                        <td style={{ padding: '9px 10px', textAlign: 'center', verticalAlign: 'middle' }}>
                            <span style={{ display: 'inline-block', background: T.perfRedBg, color: T.perfRedTxt, padding: '3px 7px', borderRadius: 4, fontWeight: 700, fontSize: 11, minWidth: 38, textAlign: 'center' }}>
                                {d.unfavorable}%
                            </span>
                        </td>
                    </tr>
                ))}
                {dimensions.length === 0 && (
                    <tr>
                        <td colSpan={3} style={{ padding: 14, textAlign: 'center', color: T.text4, fontSize: 11 }}>No data</td>
                    </tr>
                )}
            </tbody>
        </table>

        {/* ── Recommendations ── */}
        <H3>
            Recommendations for {title}
            {recommendations.length === 0 && (
                <span style={{ fontSize: 10, color: T.text4, fontWeight: 400, marginLeft: 8 }}>
                    (API offline — no data)
                </span>
            )}
        </H3>

        {recommendations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {recommendations.map((rec, i) => {
                    const isHigh      = rec.severity === 'High';
                    const accentColor = isHigh ? T.sevHigh : T.sevMed;
                    const accentBg    = isHigh ? '#FFF5F5' : '#FFFBF0';
                    const accentBorder= isHigh ? '#FECACA' : '#FED7AA';

                    return (
                        <div key={i} style={{
                            border:       `1px solid ${accentBorder}`,
                            borderLeft:   `4px solid ${accentColor}`,
                            borderRadius: 6,
                            overflow:     'hidden',
                            background:   accentBg,
                        }}>
                            {/* ── Card header: title + severity badge ── */}
                            <div style={{
                                display:        'flex',
                                justifyContent: 'space-between',
                                alignItems:     'center',
                                padding:        '8px 12px',
                                borderBottom:   `1px solid ${accentBorder}`,
                                background:     T.borderLight,
                            }}>
                                <span style={{ fontWeight: 700, color: T.text1, fontSize: 12, flex: 1, paddingRight: 10, lineHeight: 1.4 }}>
                                    {rec.title}
                                </span>
                                <span style={{
                                    background:   sevColor(rec.severity),
                                    color:        T.white,
                                    padding:      '2px 10px',
                                    borderRadius: 10,
                                    fontSize:     10,
                                    fontWeight:   700,
                                    flexShrink:   0,
                                }}>
                                    {rec.severity}
                                </span>
                            </div>

                            {/* ── Two stacked sections ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

                                {/* How to Implement */}
                                <div style={{
                                    background:  T.howBg,
                                    borderBottom:`1px solid ${accentBorder}`,
                                    padding:     '8px 12px',
                                }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: T.howLbl, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>
                                        How to Implement
                                    </div>
                                    <div style={{ fontSize: 11, color: T.text2, lineHeight: 1.65 }}>
                                        {rec.how || rec.what || '—'}
                                    </div>
                                </div>

                                {/* Business Impact */}
                                <div style={{
                                    background: T.impactBg2,
                                    padding:    '8px 12px',
                                }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: T.impactLbl2, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>
                                        Business Impact
                                    </div>
                                    <div style={{ fontSize: 11, color: T.text2, lineHeight: 1.65 }}>
                                        {rec.business_impact || rec.impact || '—'}
                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div style={{
                border: `1px dashed ${T.border}`, borderRadius: 5,
                padding: 20, textAlign: 'center',
                color: T.text4, fontSize: 11, background: T.rowAlt,
            }}>
                Recommendations will appear here once the /recommendations API is online.
            </div>
        )}

        <PageFooter pageNum={pageNum} />
    </div>
);

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export default function SoftControlPage({
    title, score, risk, leaderScore, employeeScore,
    dimensions, recommendations, insights, pageNum,
}) {
    return (
        <>
            <PageA
                title={title} score={score} risk={risk}
                leaderScore={leaderScore} employeeScore={employeeScore}
                dimensions={dimensions} insights={insights}
                pageNum={pageNum}
            />
            <PageB
                title={title}
                dimensions={dimensions}
                recommendations={recommendations || []}
                pageNum={pageNum + 1}
            />
        </>
    );
}