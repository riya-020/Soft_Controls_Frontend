import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import CoverPage from './CoverPage';
import SoftControlPage from './SoftControlPage';
import { IntroductionPage, FunctionalInsightsPages } from './ReportComponents';

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
    const [insightsMap,      setInsightsMap]      = useState({});
    const [functionalInsights,    setFunctionalInsights]    = useState([]);

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
                                extractFromCached(history[history.length - 1]);
                                console.info('[Report] Loaded recommendations from localStorage cache');
                            }
                        }
                    } catch {
                        console.warn('[Report] localStorage cache also unavailable');
                    }
                }
                setExecutiveSummary(execSummary);

                // ── 8. Insights from FastAPI /insights ────────────────────────
                const insightsData = {};
                try {
                    const insRes = await fetch('http://localhost:8000/insights');
                    if (insRes.ok) {
                        const insJson = await insRes.json();
                        Object.entries(insJson).forEach(([key, val]) => {
                            const sc = normSC(key);
                            insightsData[sc] = {
                                executiveSummary:  val.executiveSummary  || [],
                                gapAnalysis: {
                                    summary: val.gapAnalysis?.summary || '',
                                    points:  val.gapAnalysis?.points  || [],
                                },
                                dimensionInsights: val.dimensionInsights || [],
                            };
                        });
                    }
                } catch {
                    console.warn('[Report] FastAPI /insights offline — insights will be empty');
                }
                setInsightsMap(insightsData);

                // ── 9. Functional Insights from FastAPI /functional-insights ──
                try {
                    const fiRes = await fetch('http://localhost:8000/functional-insights');
                    if (fiRes.ok) {
                        const fiJson = await fiRes.json();
                        if (Array.isArray(fiJson)) setFunctionalInsights(fiJson);
                    }
                } catch {
                    console.warn('[Report] FastAPI /functional-insights offline — section will be hidden');
                }

                // ── 9. Build per-SC dimension list ─────────────────────────────
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

                // ── 10. Final controls array ───────────────────────────────────
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
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #0f2044 0%, #1a3a6e 45%, #1e4d8c 75%, #1565c0 100%)',
            fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
        }}>
            <style>{`
                @keyframes spin   { to { transform: rotate(360deg); } }
                @keyframes pulse2 { 0%,100%{opacity:1} 50%{opacity:.4} }
                @keyframes barAnim { 0%{transform:translateX(-100%)} 100%{transform:translateX(280%)} }
                @keyframes fadeUp2 { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
            `}</style>

            <div style={{
                textAlign: 'center',
                animation: 'fadeUp2 .45s ease both',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
            }}>
                <div style={{ position: 'relative', width: 56, height: 56, marginBottom: 24 }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.12)', borderTop: '3px solid #60a5fa', animation: 'spin 0.9s linear infinite', position: 'absolute', inset: 0 }} />
                    <div style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)', borderTop: '2px solid #93c5fd', animation: 'spin 1.5s linear infinite reverse', position: 'absolute', top: 9, left: 9 }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#60a5fa', boxShadow: '0 0 10px #60a5fa', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'pulse2 1.8s ease infinite' }} />
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(147,197,253,0.85)', textTransform: 'uppercase', letterSpacing: '.16em', margin: '0 0 10px' }}>KPMG Risk Culture</p>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Preparing Report</h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 28px', fontWeight: 400 }}>Compiling soft control data and insights…</p>
                <div style={{ width: 260, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 20 }}>
                    <div style={{ height: '100%', width: '45%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd)', borderRadius: 4, animation: 'barAnim 1.4s ease-in-out infinite', boxShadow: '0 0 8px rgba(96,165,250,0.5)' }} />
                </div>
                {['Loading survey data', 'Computing scores', 'Generating insights'].map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, animation: `pulse2 ${1.4 + i * 0.3}s ease infinite` }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#60a5fa' }} />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{step}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div style={{ background: '#f8f9fa', fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", minHeight: '100vh' }}>

            {/* Sticky nav bar */}
            <div className="no-print" style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: '#1e3a8a',
                borderBottom: '1px solid #1e40af',
                padding: '0 32px', height: 56,
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 0 #1e40af',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                            </svg>
                        </div>
                        <div>
                            <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '.12em', margin: 0 }}>KPMG Risk Culture</p>
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>Soft Controls Deep Dive Report</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button
                        onClick={handleDownload}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 7,
                            background: 'rgba(255,255,255,0.15)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: '#fff', padding: '8px 20px', borderRadius: 8,
                            fontWeight: 600, fontSize: 13, cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            transition: 'background .15s, transform .15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Report container */}
            <div id="report-wrapper" ref={reportRef} style={{ width: '210mm', margin: '28px auto 40px', background: 'white', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)' }}>
                <CoverPage
                    respondents={`${respondents} respondents`}
                    date={new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                />
                <IntroductionPage executiveSummary={executiveSummary} />
                {softControls.map((ctrl, i) => (
                    <SoftControlPage
                        key={i}
                        {...ctrl}
                        insights={insightsMap[ctrl.title] || null}
                        pageNum={(i * 2) + 3}
                    />
                ))}
                {functionalInsights.length > 0 && (
                    <FunctionalInsightsPages data={functionalInsights} />
                )}
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