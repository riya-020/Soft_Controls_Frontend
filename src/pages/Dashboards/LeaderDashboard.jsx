import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { LayoutDashboard, BarChart3, GitCompare, Building2, Sparkles, FileText, ShieldAlert, Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../../utils/auth';
import kpmgLogo from '../../assets/kpmg-logo.svg';
import WelcomeSection from '../../components/leader/WelcomeSection';
import ExecutiveOverviewSection from '../../components/leader/ExecutiveOverviewSection';
import ComparativeAnalysisSection from '../../components/leader/ComparativeAnalysisSection';
import FunctionWiseSection from '../../components/leader/FunctionWiseSection';
import RecommendationsSection from '../../components/RecommendationSection';
import PolicyGapDashboard from '../../components/PolicyGapDashboard';

const PILLAR_COLORS = {
    'Role Modelling': '#d1f63bff',
    'Discussability': '#6366f1',
    'Achievability': '#8b5cf6',
    'Enforcement': '#a855f7',
    'Clarity': '#ec4899',
    'Transparency': '#f43f5e',
    'Commitment': '#f97316',
    'Call Someone to Account': '#eab308',
};

const PARAM_MAP = {
    role_modelling: 'Role Modelling',
    open_to_discussion: 'Discussability',
    achievability: 'Achievability',
    enforcement: 'Enforcement',
    clarity: 'Clarity',
    transparency: 'Transparency',
    commitment: 'Commitment',
    call_someone_to_account: 'Call Someone to Account',
};

const normSC = (n) => {
    const map = {
        'call someone to account': 'Call Someone to Account',
        'role modelling': 'Role Modelling',
        'discussability': 'Discussability',
        'open_to_discussion': 'Discussability',
        'open to discussion': 'Discussability',
        'openness to discussion': 'Discussability',
        'achievability': 'Achievability',
        'enforcement': 'Enforcement',
        'clarity': 'Clarity',
        'transparency': 'Transparency',
        'commitment': 'Commitment',
    };
    return map[(n || '').toLowerCase().trim()] || n;
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const LeaderDashboard = () => {
    const [pillarsData, setPillarsData] = useState([]);
    const [radarData, setRadarData] = useState([]);
    const [dimensionData, setDimensionData] = useState({});
    const [functionData, setFunctionData] = useState({});
    const [kpiData, setKpiData] = useState({ rci: 0, respondents: 0, totalQuestions: 0, strongControls: { count: 0, items: [] }, weakControls: { count: 0, items: [] } });
    const [employeeLeaderData, setEmployeeLeaderData] = useState([]);
    const [selectedControl, setSelectedControl] = useState(null);
    const [toneAtTopIndex, setToneAtTopIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [leaderChartLoading, setLeaderChartLoading] = useState(true);

    const reportingData = [
        { name: 'HR Department', value: 6 },
        { name: 'Manager', value: 8 },
        { name: 'Digital Incident Reporting Tool', value: 4 },
        { name: 'Anonymous', value: 3 },
        { name: 'I choose not to report', value: 4 },
    ];

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/data/soft_control_data1.xlsx');
                if (!res.ok) throw new Error('Excel not found');
                const buf = await res.arrayBuffer();
                const wb = XLSX.read(buf, { type: 'array' });

                let loadedPillars = [];
                if (wb.SheetNames.includes('SOFT CONTROL SCORECARD')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['SOFT CONTROL SCORECARD']).forEach((row) => {
                        const name = normSC(String(row.SoftControl || '').trim());
                        const score = parseFloat(row.AvgScore100);
                        if (name && !Number.isNaN(score) && score > 0 && name !== 'SoftControl')
                            loadedPillars.push({ name, score: Math.round(score), fill: PILLAR_COLORS[name] || '#6366f1' });
                    });
                }
                setPillarsData(loadedPillars);

                let rci = 0, respondents = 0, totalQuestions = 0;
                if (wb.SheetNames.includes('Culture_Risk_Index')) {
                    XLSX.utils.sheet_to_json(wb.Sheets.Culture_Risk_Index, { header: 1 }).forEach((row) => {
                        if (row[0] === 'Total Respondents' && typeof row[1] === 'number') respondents = row[1];
                        if (row[0] === 'Total Questions' && typeof row[1] === 'number') totalQuestions = row[1];
                        if (typeof row[15] === 'number' && row[15] > 1) rci = Math.round(row[15]);
                    });
                }
                if (wb.SheetNames.includes('Functions')) {
                    respondents = XLSX.utils.sheet_to_json(wb.Sheets.Functions).filter((r) => r.RespondentID).length;
                }

                const sorted = [...loadedPillars].sort((a, b) => b.score - a.score);
                setKpiData({
                    rci: rci || 77, respondents, totalQuestions,
                    strongControls: { count: 3, items: sorted.slice(0, 3).map((p) => p.name) },
                    weakControls: { count: 2, items: sorted.slice(-2).reverse().map((p) => p.name) },
                });

                let loadedRadar = [];
                if (wb.SheetNames.includes('Radar Chart')) {
                    let inData = false;
                    XLSX.utils.sheet_to_json(wb.Sheets['Radar Chart']).forEach((row) => {
                        const vals = Object.values(row);
                        const first = String(vals[0]);
                        if (first === 'SoftControl') { inData = true; return; }
                        if (first === 'Role Modelling' && typeof vals[1] === 'number') inData = true;
                        if (inData && first && first !== 'SoftControl') {
                            loadedRadar.push({ metric: first, score: parseFloat(row.__EMPTY_2) || 0, lowRisk: parseFloat(row.Score) || 100, mediumRisk: parseFloat(row.__EMPTY) || 80, highRisk: parseFloat(row.__EMPTY_1) || 70 });
                        }
                    });
                }
                if (loadedRadar.length === 0) loadedRadar = loadedPillars.map((p) => ({ metric: p.name, score: p.score, lowRisk: 100, mediumRisk: 80, highRisk: 70 }));
                setRadarData(loadedRadar);

                const dimMap = {};
                if (wb.SheetNames.includes('FinalQuestions')) {
                    XLSX.utils.sheet_to_json(wb.Sheets.FinalQuestions).forEach((row) => {
                        const sc = normSC(String(row.SoftControl || '').trim());
                        const dim = String(row.Dimensions || '').trim();
                        if (sc && dim) {
                            if (!dimMap[sc]) dimMap[sc] = [];
                            if (!dimMap[sc].find((d) => d.name === dim)) dimMap[sc].push({ name: dim, score: 0, favorable: 0 });
                        }
                    });
                }
                if (wb.SheetNames.includes('Dimension Sheet')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['Dimension Sheet']).forEach((row) => {
                        const dn = String(row.Dimension || '').trim();
                        const sc = parseFloat(row.AvgScore_100);
                        const fp = typeof row['Favorable%'] === 'number' ? Math.round(row['Favorable%'] * 100) : 0;
                        if (!dn || Number.isNaN(sc)) return;
                        Object.keys(dimMap).forEach((k) => {
                            const found = dimMap[k].find((d) => d.name.trim() === dn.trim());
                            if (found) { found.score = Math.round(sc); found.favorable = fp; }
                        });
                    });
                }
                setDimensionData(dimMap);

                const funcMap = {};
                if (wb.SheetNames.includes('Functions')) {
                    XLSX.utils.sheet_to_json(wb.Sheets.Functions).forEach((row) => {
                        const rid = String(row.RespondentID || '').trim();
                        const fn = String(row.Function || '').trim();
                        if (rid && fn) funcMap[rid] = fn;
                    });
                }
                const funcSCTotals = {};
                if (wb.SheetNames.includes('AllResponses')) {
                    XLSX.utils.sheet_to_json(wb.Sheets.AllResponses).forEach((row) => {
                        const rid = String(row.RespondentID || '').trim();
                        const sc = normSC(String(row.SoftControl || '').trim());
                        const score = parseFloat(row.Score_100);
                        if (!rid || !sc || Number.isNaN(score) || score <= 0) return;
                        const fn = funcMap[rid];
                        if (!fn) return;
                        if (!funcSCTotals[fn]) funcSCTotals[fn] = {};
                        if (!funcSCTotals[fn][sc]) funcSCTotals[fn][sc] = { sum: 0, count: 0 };
                        funcSCTotals[fn][sc].sum += score;
                        funcSCTotals[fn][sc].count += 1;
                    });
                }
                const computedFuncData = {};
                Object.entries(funcSCTotals).forEach(([fn, scMap]) => {
                    computedFuncData[fn] = {};
                    Object.entries(scMap).forEach(([sc, { sum, count }]) => {
                        computedFuncData[fn][sc] = Math.round((sum / count) * 100) / 100;
                    });
                });
                setFunctionData(computedFuncData);
            } catch (err) {
                console.error('Excel load error:', err);
                setKpiData({ rci: 77, respondents: 25, totalQuestions: 32, strongControls: { count: 2, items: ['Discussability', 'Enforcement'] }, weakControls: { count: 3, items: ['Call Someone to Account', 'Achievability', 'Clarity'] } });
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const apiRes = await fetch('http://localhost:8000/scores');
                if (!apiRes.ok) throw new Error();
                const leaderScores = await apiRes.json();
                if (leaderScores.length > 0) setToneAtTopIndex(leaderScores[0].ToneAtTopIndex?.toFixed(1));

                const xlsRes = await fetch('/data/soft_control_data1.xlsx');
                const buf = await xlsRes.arrayBuffer();
                const wb = XLSX.read(buf, { type: 'array' });
                const empMap = {};
                if (wb.SheetNames.includes('SOFT CONTROL SCORECARD')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['SOFT CONTROL SCORECARD']).forEach((row) => {
                        const name = normSC(String(row.SoftControl || '').trim());
                        const score = parseFloat(row.AvgScore100);
                        if (name && !Number.isNaN(score)) empMap[name] = Math.round(score);
                    });
                }
                setEmployeeLeaderData(leaderScores.map((item) => ({
                    control: PARAM_MAP[item.Parameter] || item.Parameter,
                    leader: Math.round(item.LeadershipScore_0_100),
                    employee: empMap[PARAM_MAP[item.Parameter]] || 0,
                })));
            } catch {
                setEmployeeLeaderData([
                    { control: 'Role Modelling', employee: 78, leader: 84 },
                    { control: 'Discussability', employee: 81, leader: 85 },
                    { control: 'Achievability', employee: 75, leader: 79 },
                    { control: 'Enforcement', employee: 78, leader: 82 },
                    { control: 'Clarity', employee: 76, leader: 80 },
                    { control: 'Transparency', employee: 76, leader: 83 },
                    { control: 'Commitment', employee: 77, leader: 81 },
                    { control: 'Call Someone to Account', employee: 73, leader: 78 },
                ]);
            } finally {
                setLeaderChartLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const scrollToRec = () => {
            document.getElementById('recommendations-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        window.addEventListener('leader-dashboard-scroll-recommendations', scrollToRec);
        return () => window.removeEventListener('leader-dashboard-scroll-recommendations', scrollToRec);
    }, []);

    useEffect(() => {
        const handleNav = (e) => {
            const map = {
                overview: 'dashboard-overview',
                'soft-controls': 'soft-controls-anchor',
                analytics: 'analytics-anchor',
                'question-insights': 'question-insights-anchor',
                recommendations: 'recommendations-anchor',
            };
            const el = document.getElementById(map[e.detail?.section]);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        window.addEventListener('leader-dashboard-nav', handleNav);
        return () => window.removeEventListener('leader-dashboard-nav', handleNav);
    }, []);

    const [activeTab, setActiveTab] = useState('welcome');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const user = getCurrentUser();
    const initials = (user?.email?.[0] || 'L').toUpperCase();

    const NAV_ITEMS = [
        { id: 'welcome', label: 'Home', icon: Home },
        { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
        { id: 'comparative', label: 'Comparative', icon: GitCompare },
        { id: 'function', label: 'Function Analysis', icon: Building2 },
        { id: 'policy-gap', label: 'Policy Gap', icon: ShieldAlert },
        { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
    ];

    const TAB_LABELS = {
        welcome: 'Home',
        overview: 'Executive Overview',
        comparative: 'Comparative Analysis',
        function: 'Function Analysis',
        recommendations: 'Recommendations',
        reports: 'Reports',
        'policy-gap': 'Policy Gap',
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F7FAFC' }}>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#6b7280' }}>Loading dashboard…</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", background: '#f5f7fb' }}>

            {/* ── SIDEBAR ── */}
            <aside style={{
                width: sidebarOpen ? 240 : 64, flexShrink: 0,
                background: 'linear-gradient(180deg, #0b45aaff 0%, #125df3ff 100%)',
                borderRight: 'none',
                borderLeft: 'none',
                display: 'flex', flexDirection: 'column',
                height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 50,
                transition: 'width 0.22s cubic-bezier(.4,0,.2,1)',
                overflow: 'hidden',
                boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
            }}>
                {/* Logo + toggle */}
                <div style={{ padding: '14px 12px', borderBottom: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 68 }}>
                    {sidebarOpen && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
                            <img src={kpmgLogo} alt="KPMG" style={{ height: 24, objectFit: 'contain', filter: 'brightness(0) invert(1)', flexShrink: 0 }} />
                            <div style={{ overflow: 'hidden' }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0, whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>Risk Culture</p>
                                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Analytics</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(o => !o)}
                        style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', flexShrink: 0, marginLeft: sidebarOpen ? 0 : 'auto', marginRight: sidebarOpen ? 0 : 'auto' }}
                    >
                        {sidebarOpen
                            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
                            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
                        }
                    </button>
                </div>

                {/* Nav items */}
                <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
                    {NAV_ITEMS.map(item => {
                        const active = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                title={!sidebarOpen ? item.label : undefined}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center',
                                    gap: sidebarOpen ? 10 : 0,
                                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                                    padding: sidebarOpen ? '11px 16px' : '9px 0',
                                    borderRadius: 8, border: 'none',
                                    background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                                    color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                                    fontSize: 14, fontWeight: active ? 700 : 500,
                                    cursor: 'pointer', textAlign: 'left',
                                    borderLeft: active ? '3px solid rgba(255,255,255,0.9)' : '3px solid transparent',
                                    marginBottom: 4, transition: 'all 0.15s', whiteSpace: 'nowrap',
                                    boxShadow: 'none',
                                }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <item.icon size={17} style={{ flexShrink: 0 }} />
                                {sidebarOpen && item.label}
                            </button>
                        );
                    })}

                    {/* View Report */}
                    <div style={{ marginTop: 10, borderTop: '1px solid rgba(255, 255, 255, 1)', paddingTop: 10 }}>
                        <button
                            onClick={() => navigate('/report')}
                            title={!sidebarOpen ? 'View Report' : undefined}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center',
                                gap: sidebarOpen ? 10 : 0,
                                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                                padding: sidebarOpen ? '11px 16px' : '9px 0',
                                borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255, 255, 255, 1)',
                                color: '#374151', fontSize: 14, fontWeight: 600,
                                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#f9fafb'; }}
                        >
                            <FileText size={17} style={{ flexShrink: 0 }} />
                            {sidebarOpen && 'View Report'}
                        </button>
                    </div>
                </nav>

                {/* Bottom: user + logout */}
                <div style={{ padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                    {sidebarOpen && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', marginBottom: 4, overflow: 'hidden' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                {initials}
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                                <p style={{ fontSize: 11, fontWeight: 600, color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', margin: 0, textTransform: 'capitalize' }}>{user?.role}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => { logoutUser(); navigate('/', { replace: true }); }}
                        title={!sidebarOpen ? 'Logout' : undefined}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center',
                            gap: sidebarOpen ? 8 : 0,
                            justifyContent: sidebarOpen ? 'flex-start' : 'center',
                            padding: sidebarOpen ? '8px 14px' : '8px 0',
                            borderRadius: 8, border: 'none',
                            background: 'transparent', color: 'rgba(255,255,255,0.5)',
                            fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fca5a5'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                    >
                        <LogOut size={14} style={{ flexShrink: 0 }} />
                        {sidebarOpen && 'Logout'}
                    </button>
                </div>
            </aside>

            {/* ── MAIN AREA ── */}
            <div style={{ marginLeft: sidebarOpen ? 240 : 64, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden', transition: 'margin-left 0.22s cubic-bezier(.4,0,.2,1)' }}>

                {/* ── TOP HEADER ── */}
                <header style={{
                    background: '#0c54d0ff',
                    borderBottom: 'none',
                    padding: '0 28px',
                    height: 58,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(73, 55, 210, 0.15)',
                }}>
                    <div>
                        <h1 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
                            Leader Login
                        </h1>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{TAB_LABELS[activeTab]}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', border: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                            {initials}
                        </div>
                    </div>
                </header>

                {/* ── CONTENT ── */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 40px', background: '#f8f9fa' }}>
                    {activeTab === 'welcome' && (
                        <WelcomeSection
                            pillarsData={pillarsData}
                            dimensionData={dimensionData}
                            onNavigateToOverview={(controlName) => {
                                setSelectedControl(controlName);
                                setActiveTab('overview');
                            }}
                        />
                    )}
                    {activeTab === 'overview' && (
                        <ExecutiveOverviewSection
                            kpiData={kpiData}
                            pillarsData={pillarsData}
                            radarData={radarData}
                            dimensionData={dimensionData}
                            employeeLeaderData={employeeLeaderData}
                            toneAtTopIndex={toneAtTopIndex}
                            leaderChartLoading={leaderChartLoading}
                            selectedControl={selectedControl}
                            setSelectedControl={setSelectedControl}
                            reportingData={reportingData}
                            onNavigate={setActiveTab}
                        />
                    )}
                    {activeTab === 'comparative' && (
                        <ComparativeAnalysisSection
                            employeeLeaderData={employeeLeaderData}
                            toneAtTopIndex={toneAtTopIndex}
                            leaderChartLoading={leaderChartLoading}
                            onNavigate={setActiveTab}
                        />
                    )}
                    {activeTab === 'function' && <FunctionWiseSection onNavigate={setActiveTab} />}
                    {activeTab === 'recommendations' && <RecommendationsSection onNavigate={setActiveTab} />}
                    {activeTab === 'policy-gap' && <PolicyGapDashboard />}
                </main>
            </div>
        </div>
    );
};

export default LeaderDashboard;






