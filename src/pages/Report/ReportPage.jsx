import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import CoverPage from './CoverPage';
import SoftControlPage from './SoftControlPage';
import { IntroductionPage } from './ReportComponents';

// ─── Maps FastAPI parameter keys → display names ──────────────────────────────
const PARAM_MAP = {
    'role_modelling':          'Role Modelling',
    'open_to_discussion':      'Discussability',
    'achievability':           'Achievability',
    'enforcement':             'Enforcement',
    'clarity':                 'Clarity',
    'transparency':            'Transparency',
    'commitment':              'Commitment',
    'call_someone_to_account': 'Call Someone to Account'
};

const normSC = n => {
    const map = {
        'call someone to account': 'Call Someone to Account',
        'role modelling':          'Role Modelling',
        'discussability':          'Discussability',
        'open_to_discussion':      'Discussability',
        'open to discussion':      'Discussability',
        'openness to discussion':  'Discussability',
        'achievability':           'Achievability',
        'enforcement':             'Enforcement',
        'clarity':                 'Clarity',
        'transparency':            'Transparency',
        'commitment':              'Commitment',
    };
    return map[(n || '').toLowerCase().trim()] || n;
};

// Normalise dimension names: replace typographic hyphens, trim
const normDim = s => (s || '').replace(/[\u2011\u2010]/g, '-').trim().toLowerCase();

// ─── Fallback leader scores (FastAPI offline) ─────────────────────────────────
const FALLBACK_LEADER = {
    'Role Modelling':          84,
    'Discussability':          85,
    'Achievability':           79,
    'Enforcement':             82,
    'Clarity':                 80,
    'Transparency':            83,
    'Commitment':              81,
    'Call Someone to Account': 78,
};

const SC_ORDER = [
    'Role Modelling', 'Discussability', 'Achievability', 'Enforcement',
    'Clarity', 'Transparency', 'Commitment', 'Call Someone to Account'
];

export default function ReportPage() {
    const reportRef = useRef(null);
    const [softControls,     setSoftControls]     = useState([]);
    const [loading,          setLoading]          = useState(true);
    const [leaderOnline,     setLeaderOnline]     = useState(false);
    const [respondents,      setRespondents]      = useState(25);
    const [executiveSummary, setExecutiveSummary] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                // ── 1. Load Excel workbook ────────────────────────────────────
                const res = await fetch('/data/soft_control_data1.xlsx');
                if (!res.ok) throw new Error('Excel file not found at /data/soft_control_data1.xlsx');
                const buf = await res.arrayBuffer();
                const wb  = XLSX.read(buf, { type: 'array' });

                // ── 2. Employee scores from SOFT CONTROL SCORECARD ────────────
                const empScores = {};
                if (wb.SheetNames.includes('SOFT CONTROL SCORECARD')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['SOFT CONTROL SCORECARD']).forEach(row => {
                        const sc    = normSC(String(row['SoftControl'] || '').trim());
                        const score = parseFloat(row['AvgScore100']);
                        if (sc && !isNaN(score) && score > 0 && sc !== 'SoftControl') {
                            empScores[sc] = Math.round(score);
                        }
                    });
                }

                // ── 3. Dimension data from Dimension Sheet ─────────────────────
                const dimData = {};   // normDimName → { score, favorable, unfavorable, neutral, originalName }
                if (wb.SheetNames.includes('Dimension Sheet')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['Dimension Sheet']).forEach(row => {
                        const dimName = String(row['Dimension'] || '').trim();
                        const score   = parseFloat(row['AvgScore_100']);
                        if (dimName && !isNaN(score)) {
                            dimData[normDim(dimName)] = {
                                originalName: dimName,
                                score:        Math.round(score),
                                favorable:    Math.round((parseFloat(row['Favorable%'])   || 0) * 100),
                                unfavorable:  Math.round((parseFloat(row['Unfavorable%']) || 0) * 100),
                                neutral:      Math.round((parseFloat(row['Neutral%'])     || 0) * 100),
                            };
                        }
                    });
                }

                // ── 4. Questions from FinalQuestions (rows 0-31 = Q001-Q032) ──
                const questionsMap = {};  // normDimName → { questionText, softControl }
                if (wb.SheetNames.includes('FinalQuestions')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['FinalQuestions']).forEach((row, idx) => {
                        if (idx > 31) return;   // only first 32 questions
                        const qid = String(row['QuestionID'] || '').trim();
                        if (!qid) return;
                        const dimName = String(row['Dimensions'] || '').trim();
                        const key     = normDim(dimName);
                        questionsMap[key] = {
                            questionText:  String(row['QuestionText'] || '').trim(),
                            softControl:   normSC(String(row['SoftControl'] || '').trim()),
                            dimensionName: dimName,
                        };
                    });
                }

                // ── 5. Respondent count ────────────────────────────────────────
                if (wb.SheetNames.includes('Functions')) {
                    const rows  = XLSX.utils.sheet_to_json(wb.Sheets['Functions']);
                    const count = rows.filter(r => r['RespondentID']).length;
                    if (count > 0) setRespondents(count);
                }

                // ── 6. Leader scores from FastAPI /scores ──────────────────────
                const ldrScores = {};
                try {
                    const apiRes = await fetch('http://localhost:8000/scores');
                    if (apiRes.ok) {
                        const data = await apiRes.json();
                        data.forEach(item => {
                            const sc = PARAM_MAP[item.Parameter] || normSC(item.Parameter);
                            if (sc && typeof item.LeadershipScore_0_100 === 'number') {
                                ldrScores[sc] = Math.round(item.LeadershipScore_0_100);
                            }
                        });
                        setLeaderOnline(true);
                    }
                } catch {
                    console.warn('[Report] FastAPI /scores offline — using fallback');
                }
                const finalLdrScores = Object.keys(ldrScores).length > 0 ? ldrScores : FALLBACK_LEADER;

                // ── 7. Per-SC recommendations — try API, fall back to localStorage ──
                const scRecommendations = {};
                let execSummary = '';

                // Helper: extract recs from a saved history entry (same shape as RecommendationSection)
                const extractFromCached = (cached) => {
                    if (!cached?.parameters) return false;
                    execSummary = cached.executiveSummary || '';
                    cached.parameters.forEach(param => {
                        const sc = normSC(param.softControl || '');
                        if (sc) scRecommendations[sc] = (param.recommendations || []).map(r => ({
                            theme:    r.title    || r.theme    || sc,
                            action:   r.what     || r.action   || '',
                            impact:   r.impact   || '',
                            priority: r.severity || r.priority || 'Medium',
                            title:    r.title    || r.theme    || '',
                            why:      r.why      || '',
                            what:     r.what     || r.action   || '',
                            who:      r.who      || '',
                            when:     r.when     || '',
                            severity: r.severity || r.priority || 'Medium',
                        }));
                    });
                    return true;
                };

                try {
                    const recRes = await fetch('http://localhost:8000/recommendations');
                    if (recRes.ok) {
                        const recData = await recRes.json();
                        extractFromCached(recData);
                    } else {
                        throw new Error('API not OK');
                    }
                } catch {
                    console.warn('[Report] FastAPI /recommendations offline — trying localStorage cache');
                    try {
                        const raw = localStorage.getItem('kpmg_rec_history');
                        if (raw) {
                            const history = JSON.parse(raw);
                            if (Array.isArray(history) && history.length > 0) {
                                // use the latest saved version
                                extractFromCached(history[history.length - 1]);
                                console.info('[Report] Loaded recommendations from localStorage cache');
                            }
                        }
                    } catch {
                        console.warn('[Report] localStorage cache also unavailable');
                    }
                }
                setExecutiveSummary(execSummary);

                // ── 8. Build per-SC dimension list ─────────────────────────────
                // Group question rows by SC
                const scDimensions = {};
                Object.values(questionsMap).forEach(({ softControl, dimensionName, questionText }) => {
                    if (!scDimensions[softControl]) scDimensions[softControl] = [];
                    const key     = normDim(dimensionName);
                    const dimInfo = dimData[key] || { score: 0, favorable: 0, unfavorable: 0, neutral: 0 };
                    scDimensions[softControl].push({
                        name:        dimensionName,
                        score:       dimInfo.score,
                        favorable:   dimInfo.favorable,
                        unfavorable: dimInfo.unfavorable,
                        neutral:     dimInfo.neutral,
                        question:    questionText,
                        performance: dimInfo.score >= 80 ? 'Strong' : dimInfo.score >= 70 ? 'Moderate' : 'Weak',
                        color:       dimInfo.score >= 80 ? 'green'  : dimInfo.score >= 70 ? 'amber'    : 'red',
                    });
                });

                // ── 9. Final controls array ────────────────────────────────────
                const controls = SC_ORDER.map(sc => {
                    const empScore = empScores[sc] ?? 75;
                    const ldrScore = finalLdrScores[sc] ?? 0;
                    const risk     = empScore >= 80 ? 'Low Risk' : empScore >= 70 ? 'Medium Risk' : 'High Risk';
                    return {
                        title:           sc,
                        score:           empScore,
                        risk,
                        employeeScore:   empScore,
                        leaderScore:     ldrScore,
                        dimensions:      scDimensions[sc] || [],
                        recommendations: scRecommendations[sc] || [],
                    };
                });

                setSoftControls(controls);
            } catch (err) {
                console.error('[Report] Load error:', err);
                setSoftControls(SC_ORDER.map(sc => ({
                    title: sc, score: 75, risk: 'Medium Risk',
                    employeeScore: 75, leaderScore: FALLBACK_LEADER[sc] || 0,
                    dimensions: [], recommendations: [],
                })));
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleDownload = () => {
        window.print();
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100vh', background: '#F4F5F7', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ textAlign: 'center', background: '#fff', padding: '40px 60px',
                borderRadius: 8, borderTop: '4px solid #00338D', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>📄</div>
                <div style={{ fontSize: 18, color: '#00338D', fontWeight: 700, marginBottom: 8 }}>Preparing Report...</div>
                <div style={{ marginTop: 20, height: 4, background: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '60%', background: '#00338D', borderRadius: 2,
                        animation: 'slide 1.2s ease-in-out infinite' }} />
                </div>
                <style>{`@keyframes slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(260%)} }`}</style>
            </div>
        </div>
    );

    return (
        <div style={{ background: '#f4f4f4', fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>

            {/* Sticky nav bar */}
            <div className="no-print" style={{
                position: 'sticky', top: 0, zIndex: 100, background: '#00338D',
                padding: '12px 32px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>📄 Soft Controls Deep Dive Report</span>
                    <span style={{
                        fontSize: 11, padding: '3px 10px', borderRadius: 12, fontWeight: 600,
                        background: leaderOnline ? '#22c55e22' : '#f59e0b22',
                        color:      leaderOnline ? '#86efac'   : '#fcd34d',
                    }}>
                        {leaderOnline ? '✓ Live data' : '⚠ Fallback mode'}
                    </span>
                </div>
                <button
                    onClick={handleDownload}
                    style={{
                        background: 'white', color: '#00338D',
                        border: 'none', padding: '10px 24px', borderRadius: 4,
                        fontWeight: 700, fontSize: 14,
                        cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    ⬇ Download PDF
                </button>
            </div>

            {/* Report container */}
            <div id="report-wrapper" ref={reportRef} style={{ width: '210mm', margin: '24px auto', background: 'white' }}>
                <CoverPage
                    respondents={`${respondents} respondents`}
                    date={new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                />
                <IntroductionPage executiveSummary={executiveSummary} />
                {softControls.map((ctrl, i) => (
                    <SoftControlPage
                        key={i}
                        {...ctrl}
                        pageNum={(i * 2) + 3}
                    />
                ))}
            </div>

            <style>{`
                @media print {
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .no-print { display: none !important; }
                    body { background: white !important; margin: 0 !important; padding: 0 !important; }
                    #report-wrapper { margin: 0 !important; width: 100% !important; }
                    @page { size: A4 portrait; margin: 0; }
                }
            `}</style>
        </div>
    );
}