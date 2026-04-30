import React from 'react';
import { ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Users, ShieldCheck, AlertTriangle, ArrowRight, BarChart2 } from 'lucide-react';
import SpiderChartWithDimensions from '../SpiderChartWithDimensions';
import QuestionInsightsSection from '../QuestionInsightsSection';

// ─── Shared style tokens ──────────────────────────────────────────────────────
const FONT = "'Inter','Segoe UI',system-ui,sans-serif";
const CARD = {
    background: '#fff',
    border: '1px solid #ebebeb',
    borderRadius: 14,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
};

// ─── RCI Gauge ────────────────────────────────────────────────────────────────
const RCIGauge = ({ score }) => {
    const riskLabel = score >= 80 ? 'Low Risk' : score >= 70 ? 'Medium Risk' : 'High Risk';
    const riskCol   = score >= 80 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444';
    const riskBg    = score >= 80 ? '#dcfce7' : score >= 70 ? '#fef3c7' : '#fee2e2';

    return (
        <div style={{ height: 80, width: 140, position: 'relative', overflow: 'hidden' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                        <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                    </defs>
                    <Pie data={[{ value: 100 }]} dataKey="value" startAngle={180} endAngle={0}
                        innerRadius={48} outerRadius={58} stroke="none" cy="100%" fill="#f3f4f6" isAnimationActive={false} />
                    <Pie data={[{ value: score }, { value: 100 - score }]} dataKey="value"
                        startAngle={180} endAngle={0} innerRadius={48} outerRadius={58}
                        stroke="none" cy="100%" cornerRadius={6} animationDuration={1000}>
                        <Cell fill="url(#gaugeGrad)" />
                        <Cell fill="transparent" />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '72%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#111827', lineHeight: 1, fontFamily: FONT }}>{score}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: riskCol, background: riskBg, padding: '2px 7px', borderRadius: 20, marginTop: 3, whiteSpace: 'nowrap' }}>{riskLabel}</div>
            </div>
        </div>
    );
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ title, value, sub, icon: Icon, color, progress, delay = 0 }) => (
    <div style={{
        ...CARD,
        padding: '16px 18px',
        display: 'flex', flexDirection: 'column', gap: 10,
        borderTop: `3px solid ${color}`,
        animation: `eoFadeUp .4s ease ${delay}s both`,
    }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: FONT }}>{title}</span>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                <Icon size={15} />
            </div>
        </div>
        <div>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1, letterSpacing: '-0.03em', fontFamily: FONT }}>{value}</p>
            <p style={{ fontSize: 11, color: '#6b7280', margin: '4px 0 0', fontFamily: FONT }}>{sub}</p>
        </div>
        <div style={{ height: 4, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: color, borderRadius: 3, transition: 'width 1s ease' }} />
        </div>
    </div>
);

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ kicker, title, sub }) => (
    <div style={{ marginBottom: 16 }}>
        {kicker && <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 5px', fontFamily: FONT }}>{kicker}</p>}
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em', fontFamily: FONT }}>{title}</h2>
        {sub && <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0', fontFamily: FONT }}>{sub}</p>}
    </div>
);

// ─── CTA Banner ───────────────────────────────────────────────────────────────
const CTABanner = ({ onNavigate }) => (
    <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
        border: '1px solid #bfdbfe',
        borderRadius: 16,
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        flexWrap: 'wrap',
        animation: 'eoFadeUp 0.5s ease 0.4s both',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            }}>
                <BarChart2 size={20} color="#fff" />
            </div>
            <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 3px', fontFamily: FONT }}>
                    Up Next
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 2px', fontFamily: FONT }}>
                    Ready to explore the full comparison?
                </p>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0, fontFamily: FONT }}>
                    Navigate to Comparative Analysis to see how leadership perception aligns with employee experience.
                </p>
            </div>
        </div>
        <button
            onClick={() => onNavigate?.('comparative')}
            style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '11px 20px', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: FONT,
                transition: 'opacity 0.2s, transform 0.2s',
                boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            View Comparative Analysis
            <ArrowRight size={15} />
        </button>
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const ExecutiveOverviewSection = ({
    kpiData,
    radarData,
    dimensionData,
    selectedControl,
    setSelectedControl,
    reportingData,
    onNavigate,
}) => {
    const rci = Math.round(kpiData?.rci || 74);
    const respondents = kpiData?.respondents || 25;
    const strong = kpiData?.strongControls?.count || 3;
    const weak = kpiData?.weakControls?.count || 2;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: FONT }}>
            <style>{`
                @keyframes eoFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
                * { font-family: 'Inter','Segoe UI',system-ui,sans-serif !important; }
            `}</style>

            {/* ── KPI Row ── */}
            <div>
                <SectionHeader kicker="At a Glance" title="Executive Summary" />
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: 14, alignItems: 'stretch' }}>

                    {/* RCI Gauge card */}
                    <div style={{
                        ...CARD,
                        padding: '16px 20px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                        borderTop: '3px solid #2563eb', minWidth: 170,
                        animation: 'eoFadeUp .4s ease 0s both',
                    }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', alignSelf: 'flex-start' }}>Risk Culture Index</span>
                        <RCIGauge score={rci} />
                    </div>

                    <KpiCard title="Respondents" value={respondents} sub="employees this cycle" icon={Users} color="#6366f1" progress={Math.min(100, (respondents / 30) * 100)} delay={0.08} />
                    <KpiCard title="Strong Controls" value={strong} sub="performing above threshold" icon={ShieldCheck} color="#22c55e" progress={(strong / 8) * 100} delay={0.16} />
                    <KpiCard title="Needs Attention" value={weak} sub="require intervention" icon={AlertTriangle} color="#f59e0b" progress={(weak / 8) * 100} delay={0.24} />
                </div>
            </div>

            {/* ── Question Insights ── */}
            <div>
                <SectionHeader kicker="Survey Analysis" title="Question Insights" sub="Key behavioral signals from the survey" />
                <QuestionInsightsSection reportingData={reportingData} />
            </div>

            {/* ── Spider Chart ── */}
            <div>
                <SectionHeader kicker="Risk Assessment" title="Soft Control Performance vs Risk Thresholds" sub="Click any control to drill into its dimensions" />
                <div style={{
                    ...CARD,
                    overflow: 'hidden',
                    padding: 0,
                    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                }}>
                    <SpiderChartWithDimensions
                        radarData={radarData}
                        selectedControl={selectedControl}
                        setSelectedControl={setSelectedControl}
                        dimensionData={dimensionData}
                    />
                </div>
            </div>

            {/* ── CTA ── */}
            <CTABanner onNavigate={onNavigate} />
        </div>
    );
};

export default ExecutiveOverviewSection;
