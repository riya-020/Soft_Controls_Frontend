export default function SoftControlPage({
    title, score, risk, leaderScore, employeeScore,
    dimensions, insights, flaggedQuestions, pageNum
}) {
    const riskClass = risk?.toLowerCase().includes('high') ? 'high'
        : risk?.toLowerCase().includes('medium') ? 'medium' : 'low';

    const riskBg = riskClass === 'high' ? '#C62828' : riskClass === 'medium' ? '#F9A825' : '#2E7D32';

    const dimColor = c => c === 'green' ? '#2E7D32' : c === 'amber' ? '#F9A825' : '#C62828';
    const dimBg = c => c === 'green' ? '#e8f5e9' : c === 'amber' ? '#fff8e1' : '#ffebee';

    return (
        <div style={{
            position: 'relative',
            padding: '40px 50px',
            boxSizing: 'border-box',
            border: '1px solid #d9d9d9',
            borderTop: '6px solid #00338D',
            width: '210mm',
            minHeight: '296mm',        // ✅ changed
            overflow: 'visible',       // ✅ changed
            fontFamily: 'Arial, sans-serif',
            background: '#fff',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #00338D', paddingBottom: 10, marginBottom: 24 }}>
                <div style={{ fontSize: 13, color: '#00338D', fontWeight: 'bold' }}>Soft Risk Culture Report</div>
                <div style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{title}</div>
            </div>

            <h2 style={{ color: '#00338D', marginBottom: 8, fontSize: 22 }}>{title}</h2>

            {/* Score + risk */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, margin: '16px 0 20px' }}>
                <span style={{ fontSize: 56, fontWeight: 700, color: '#00338D', lineHeight: 1 }}>{score}</span>
                <span style={{ background: riskBg, color: 'white', padding: '8px 20px', borderRadius: 20, fontWeight: 700, fontSize: 14 }}>{risk}</span>
            </div>

            {/* Definition */}
            <h3 style={{ color: '#00338D', fontSize: 15, marginBottom: 6 }}>Definition</h3>
            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 20 }}>
                This soft control reflects behavioural drivers that influence how openly employees discuss risks,
                concerns and mistakes. Strong performance in this area improves organisational learning and
                strengthens the overall governance environment.
            </p>

            {/* Dimensions */}
            <h3 style={{ color: '#00338D', fontSize: 15, marginBottom: 8 }}>Dimension Performance</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
                <thead>
                    <tr>
                        <th style={{ background: '#00338D', color: 'white', padding: '10px 12px', textAlign: 'left', fontSize: 13 }}>Dimension</th>
                        <th style={{ background: '#00338D', color: 'white', padding: '10px 12px', textAlign: 'left', fontSize: 13 }}>Performance</th>
                    </tr>
                </thead>
                <tbody>
                    {dimensions?.map((d, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                            <td style={{ padding: '9px 12px', borderBottom: '1px solid #e5e7eb', fontSize: 13 }}>{d.name}</td>
                            <td style={{ padding: '9px 12px', borderBottom: '1px solid #e5e7eb', fontSize: 13 }}>
                                <span style={{ background: dimBg(d.color), color: dimColor(d.color), padding: '3px 12px', borderRadius: 4, fontWeight: 600, fontSize: 12 }}>
                                    {d.performance}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Leader vs Employee */}
            <h3 style={{ color: '#00338D', fontSize: 15, marginBottom: 10 }}>Leader vs Employee Perception</h3>
            <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{ background: '#00338D', color: 'white', padding: '8px 14px', width: `${Math.min(leaderScore, 90)}%`, fontSize: 13, fontWeight: 600, borderRadius: 3 }}>
                        Leader Score: {leaderScore}
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ background: '#F9A825', color: 'white', padding: '8px 14px', width: `${Math.min(employeeScore, 90)}%`, fontSize: 13, fontWeight: 600, borderRadius: 3 }}>
                        Employee Score: {employeeScore}
                    </div>
                </div>
            </div>

            {/* Insights */}
            <h3 style={{ color: '#00338D', fontSize: 15, marginBottom: 8 }}>Functional Insights</h3>
            <ul style={{ marginBottom: 20, paddingLeft: 20 }}>
                {insights?.map((ins, i) => (
                    <li key={i} style={{ fontSize: 13, color: '#374151', marginBottom: 6, lineHeight: 1.6 }}>{ins}</li>
                ))}
            </ul>

            {/* Flagged questions */}
            {flaggedQuestions?.length > 0 && (
                <>
                    <h3 style={{ color: '#00338D', fontSize: 15, marginBottom: 8 }}>Flagged Survey Responses</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ background: '#e9ecef', padding: '10px 12px', textAlign: 'left', fontWeight: 700, fontSize: 13, borderBottom: '2px solid #d1d5db' }}>Question</th>
                                <th style={{ background: '#e9ecef', padding: '10px 12px', textAlign: 'left', fontWeight: 700, fontSize: 13, borderBottom: '2px solid #d1d5db', width: 140 }}>Response</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flaggedQuestions.map((q, i) => (
                                <tr key={i}>
                                    <td style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb', fontSize: 13, color: '#374151' }}>{q.question}</td>
                                    <td style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb', fontSize: 12, background: '#F9A825', color: 'white', fontWeight: 600, textAlign: 'center' }}>{q.response}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {/* Footer */}
            <div style={{ position: 'absolute', bottom: 24, left: 50, right: 50, display: 'flex', justifyContent: 'space-between', fontSize: 11, borderTop: '1px solid #ccc', paddingTop: 8, color: '#666' }}>
                <span>Confidential</span>
                <span>Soft Control Assessment</span>
                <span>Page {pageNum}</span>
            </div>
        </div>
    );
}
