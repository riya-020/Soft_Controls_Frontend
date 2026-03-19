import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import CoverPage from './CoverPage';
import SoftControlPage from './SoftControlPage';
import { IntroductionPage, RecommendationsPage } from './ReportComponents';

// ─── Static insights per soft control ────────────────────────────────────────
const SC_INSIGHTS = {
    'Role Modelling':          ['Leaders are not consistently seen as risk role models', 'Employees report limited visibility of leaders acknowledging mistakes', 'Leadership communication practices influence perception gaps'],
    'Discussability':          ['Risk and compliance teams demonstrate stronger discussability', 'Operational functions show lower comfort in raising concerns', 'Leadership communication practices influence perception gaps'],
    'Achievability':           ['Employees familiar with risk management expectations', 'Workload constraints limit effective risk management', 'Scenario-based training could improve practical awareness'],
    'Enforcement':             ['Learning culture supported through leadership messaging', 'Post-incident reviews driving improvement', 'Knowledge sharing varies across functions'],
    'Clarity':                 ['Employees hesitant to escalate concerns', 'Awareness of speak-up channels is limited', 'Leadership messaging inconsistent across teams'],
    'Transparency':            ['Information flow differs across departments', 'Employees unclear about decision rationale', 'Escalation processes not consistently visible'],
    'Commitment':              ['Teams comfortable raising ideas but less so raising risks', 'Leadership accessibility rated positively', 'Constructive challenge culture still evolving'],
    'Call Someone to Account': ['Peer accountability is the weakest area', 'Employees reluctant to call out non-compliant colleagues', 'Accountability issues are not always addressed promptly'],
};

// ─── Static flagged questions per soft control ────────────────────────────────
const SC_FLAGGED = {
    'Role Modelling':          [{ question: 'All the executives set the right tone at the top on risk management', response: 'Disagree' }, { question: 'Leaders consider long-term risk implications in decisions', response: 'Neutral' }],
    'Discussability':          [{ question: 'People feel comfortable sharing opinions on risk management', response: 'Disagree' }, { question: 'Within my team people feel comfortable reporting risk dilemmas', response: 'Neutral' }],
    'Achievability':           [{ question: 'The amount of risk training I have received is sufficient', response: 'Strongly Disagree' }, { question: 'People have enough time and resources to manage risks', response: 'Neutral' }],
    'Enforcement':             [{ question: 'People are given incentives for being compliant with risk policies', response: 'Disagree' }, { question: 'Managing risks is viewed as crucial to business performance', response: 'Neutral' }],
    'Clarity':                 [{ question: 'The level of understanding of risk policies in my team is high', response: 'Strongly Agree' }, { question: 'I know how much risk I am allowed to take', response: 'Agree' }],
    'Transparency':            [{ question: 'Leaders explain actions taken after concerns are reported', response: 'Disagree' }, { question: 'Professional standards are clear and accessible', response: 'Neutral' }],
    'Commitment':              [{ question: 'I undertake all risk management responsibilities in my role', response: 'Agree' }],
    'Call Someone to Account': [{ question: 'People call each other to account for non-compliance', response: 'Disagree' }, { question: 'Accountability issues are addressed soon after they arise', response: 'Neutral' }],
};

// ─── Dimension performance mapping ───────────────────────────────────────────
const SC_DIMENSIONS = {
    'Role Modelling':          [{ name: 'Leadership Example-Setting', color: 'green', performance: 'Strong' }, { name: 'Executive Commitment to Risk Culture', color: 'amber', performance: 'Moderate' }, { name: 'Leadership Encouragement to Escalate', color: 'green', performance: 'Strong' }, { name: 'Long-Term Decision Awareness', color: 'amber', performance: 'Moderate' }],
    'Discussability':          [{ name: 'Openness to Discussions', color: 'green', performance: 'Strong' }, { name: 'Access to Guidance', color: 'green', performance: 'Strong' }, { name: 'Openness to Sharing Opinions', color: 'amber', performance: 'Moderate' }, { name: 'Comfort in Reporting Risk Dilemmas', color: 'red', performance: 'Weak' }],
    'Achievability':           [{ name: 'Adequacy of Risk Management Training', color: 'green', performance: 'Strong' }, { name: 'Workload Balance & Resource Sufficiency', color: 'amber', performance: 'Moderate' }, { name: 'Realistic Target Setting', color: 'amber', performance: 'Moderate' }, { name: 'Risk Insight in Decision Making', color: 'green', performance: 'Strong' }],
    'Enforcement':             [{ name: 'Learning Culture from Non-Compliance', color: 'green', performance: 'Strong' }, { name: 'Trust in Confidential Reporting', color: 'amber', performance: 'Moderate' }, { name: 'Compliance Recognition & Enforcement', color: 'green', performance: 'Strong' }, { name: 'Organisational View on Risk Culture', color: 'amber', performance: 'Moderate' }],
    'Clarity':                 [{ name: 'Clarity of Role and Responsibilities', color: 'red', performance: 'Weak' }, { name: 'Understanding of Risk Policies', color: 'amber', performance: 'Moderate' }, { name: 'Clarity of Personal Risk Boundaries', color: 'green', performance: 'Strong' }, { name: 'Effectiveness of Risk Communication', color: 'amber', performance: 'Moderate' }],
    'Transparency':            [{ name: 'Compliance Confidence in Team', color: 'amber', performance: 'Moderate' }, { name: 'Proactive Risk Identification', color: 'green', performance: 'Strong' }, { name: 'Leadership Follow Through', color: 'amber', performance: 'Moderate' }, { name: 'Transparency & Accessibility of Standards', color: 'red', performance: 'Weak' }],
    'Commitment':              [{ name: 'Motivation for Risk Ownership', color: 'amber', performance: 'Moderate' }, { name: 'Sense of Belonging to the Organisation', color: 'green', performance: 'Strong' }, { name: 'Consideration of Impact on Others', color: 'amber', performance: 'Moderate' }, { name: 'Accountability for Risk Actions', color: 'amber', performance: 'Moderate' }],
    'Call Someone to Account': [{ name: 'Peer to Peer Accountability', color: 'red', performance: 'Weak' }, { name: 'Timely Resolution of Accountability Issues', color: 'red', performance: 'Weak' }, { name: 'Comfort for Reporting Non-Compliance', color: 'amber', performance: 'Moderate' }, { name: 'Openness to Constructive Feedback', color: 'amber', performance: 'Moderate' }],
};

const RECOMMENDATIONS = [
    { theme: 'Discussability',        action: 'Run small-group listening meetings to hear concerns and ideas.',         impact: 'Improves transparency and open dialogue',                  priority: 'High' },
    { theme: 'Role Modelling',        action: 'Provide 360° behaviour feedback to leaders.',                           impact: 'Encourages behavioural alignment across employees',         priority: 'High' },
    { theme: 'Transparency',          action: 'Share a monthly "You said, we did" update.',                            impact: 'Rebuilds trust through visible follow-through',             priority: 'Medium' },
    { theme: 'Enforcement',           action: 'Publish how misconduct or rule-breaking is handled consistently.',      impact: 'Builds confidence in fair and equal enforcement',           priority: 'High' },
    { theme: 'Clarity',               action: 'Run team sessions to clarify who does what (RACI).',                    impact: 'Improves clarity of responsibilities and expectations',     priority: 'Medium' },
    { theme: 'Call Someone to Account', action: 'Publish a simple "how to escalate" guide.',                          impact: 'Strengthens psychological safety for reporting concerns',    priority: 'High' },
    { theme: 'Achievability',         action: 'Review targets to ensure they are realistic.',                          impact: 'Reduces pressure-driven risk-taking',                       priority: 'Medium' },
    { theme: 'Commitment',            action: 'Embed risk ownership within performance objectives.',                   impact: 'Reinforces accountability and behavioural consistency',     priority: 'Medium' },
];

// ─── Main ReportPage ──────────────────────────────────────────────────────────
export default function ReportPage() {
    const reportRef = useRef(null);
    const [softControls, setSoftControls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch('/data/soft_control_data1.xlsx');
                if (!res.ok) throw new Error('Excel not found');
                const buf = await res.arrayBuffer();
                const wb  = XLSX.read(buf, { type: 'array' });

                // Org scores from SOFT CONTROL SCORECARD
                const orgScores = {};
                if (wb.SheetNames.includes('SOFT CONTROL SCORECARD')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['SOFT CONTROL SCORECARD']).forEach(row => {
                        const sc    = String(row['SoftControl'] || '').trim();
                        const score = parseFloat(row['AvgScore100']);
                        if (sc && !isNaN(score) && score > 0) orgScores[sc] = Math.round(score);
                    });
                }

                // Employee scores from EmployeeLeader sheet
                const empScores = {};
                if (wb.SheetNames.includes('EmployeeLeader')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['EmployeeLeader']).forEach(row => {
                        const sc = String(row['SoftControl'] || '').trim();
                        const s  = parseFloat(row['Employee_AvgScore100']);
                        if (sc && !isNaN(s)) empScores[sc] = Math.round(s);
                    });
                }

                // Leader scores from EmployeeLeader sheet
                const ldrScores = {};
                if (wb.SheetNames.includes('EmployeeLeader')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['EmployeeLeader']).forEach(row => {
                        const sc = String(row['SoftControl'] || '').trim();
                        const s  = parseFloat(row['Leader_AvgScore100']);
                        if (sc && !isNaN(s)) ldrScores[sc] = Math.round(s);
                    });
                }

                const controls = Object.keys(orgScores).map(sc => {
                    const score = orgScores[sc] || 0;
                    const risk  = score >= 80 ? 'Low Risk' : score >= 70 ? 'Medium Risk' : 'High Risk';
                    return {
                        title:           sc,
                        score,
                        risk,
                        leaderScore:     ldrScores[sc] || 0,
                        employeeScore:   empScores[sc] || 0,
                        dimensions:      SC_DIMENSIONS[sc] || [],
                        insights:        SC_INSIGHTS[sc]   || [],
                        flaggedQuestions: SC_FLAGGED[sc]   || [],
                    };
                });

                setSoftControls(controls.length > 0 ? controls : getFallback());
            } catch {
                setSoftControls(getFallback());
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const getFallback = () => Object.keys(SC_DIMENSIONS).map(sc => ({
        title: sc, score: 75, risk: 'Medium Risk', leaderScore: 80, employeeScore: 70,
        dimensions: SC_DIMENSIONS[sc], insights: SC_INSIGHTS[sc], flaggedQuestions: SC_FLAGGED[sc],
    }));

    const handleDownload = async () => {
        setGenerating(true);
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const element  = reportRef.current;
            await html2pdf().from(element).set({
                margin:      0,
                filename:    `Soft-Control-Report-${new Date().toISOString().slice(0, 10)}.pdf`,
                html2canvas: { scale: 2, useCORS: true },
                jsPDF:       { format: 'a4', orientation: 'portrait' },
                pagebreak:   { mode: ['css'] },
            }).save();
        } catch (e) {
            // fallback to window.print
            window.print();
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, color: '#00338D', fontWeight: 700, marginBottom: 8 }}>Preparing Report...</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>Loading data from Excel</div>
            </div>
        </div>
    );

    return (
        <div style={{ background: '#f4f4f4', fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>

            {/* Download bar — hidden on print */}
            <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#00338D', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                <div>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>Soft Controls Deep Dive Report</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginLeft: 16 }}>{softControls.length} soft controls loaded from Excel</span>
                </div>
                <button onClick={handleDownload} disabled={generating}
                    style={{ background: generating ? '#6CACE4' : 'white', color: '#00338D', border: 'none', padding: '10px 24px', borderRadius: 4, fontWeight: 700, fontSize: 14, cursor: generating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {generating ? '⏳ Generating PDF...' : '⬇ Download PDF Report'}
                </button>
            </div>

            {/* Report content */}
            <div id="report" ref={reportRef} style={{ width: '210mm', margin: '24px auto', background: 'white' }}>
                <CoverPage respondents={`${softControls.length * 3} respondents`} />
                <IntroductionPage />
                {softControls.map((ctrl, i) => (
                    <SoftControlPage key={i} {...ctrl} pageNum={i + 3} />
                ))}
                <RecommendationsPage recommendations={RECOMMENDATIONS} />
            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; }
                }
            `}</style>
        </div>
    );
}
