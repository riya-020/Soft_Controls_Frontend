import { useState, useEffect } from 'react';
import {
    ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';
import SpiderChartWithDimensions from '../SpiderChartWithDimensions';
import QuestionInsightsSection from '../QuestionInsightsSection';

// ─── Shared Components ────────────────────────────────────────────────────────

const RCIGauge = ({ score }) => {
    const status = score >= 80 ? 'Low Risk' : score >= 70 ? 'Medium Risk' : 'High Risk';
    const statusColor = score >= 80 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444';

    return (
        <div style={{ height: 75, width: 130, position: 'relative', overflow: 'hidden' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#5e72e4" />
                            <stop offset="100%" stopColor="#825ee4" />
                        </linearGradient>
                    </defs>
                    <Pie
                        data={[{ value: 100 }]}
                        dataKey="value"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={45}
                        outerRadius={55}
                        stroke="none"
                        cy="100%"
                        fill="#f1f5f9"
                        isAnimationActive={false}
                    />
                    <Pie
                        data={[{ value: score }, { value: 100 - score }]}
                        dataKey="value"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={45}
                        outerRadius={55}
                        stroke="none"
                        cy="100%"
                        cornerRadius={6}
                        isAnimationActive={true}
                        animationDuration={1000}
                    >
                        <Cell fill="url(#gaugeGradient)" />
                        <Cell fill="transparent" />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '75%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>{score}%</div>
                <div style={{ fontSize: 7, fontWeight: 800, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2, background: `${statusColor}15`, padding: '1px 5px', borderRadius: 2 }}>{status}</div>
            </div>
        </div>
    );
};

const KpiCardNew = ({ title, value, subtitle, icon, color, progress }) => (
    <div style={{
        background: '#fff',
        borderRadius: 10,
        padding: '10px 12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        borderTop: `2px solid ${color}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: 110
    }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.04em' }}>{title}</span>
            <span style={{ fontSize: 11 }}>{icon}</span>
        </div>
        <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', lineHeight: 1.2 }}>{value}</div>
            <div style={{ fontSize: 9, color: subtitle.toLowerCase().includes('priority') ? '#ef4444' : '#22c55e', fontWeight: 600, marginTop: 2 }}>{subtitle}</div>
        </div>
        {/* Fill empty space with a subtle trend/progress bar */}
        <div style={{ marginTop: 8 }}>
            <div style={{ height: 4, width: '100%', background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress || 65}%`, background: color, borderRadius: 2 }} />
            </div>
        </div>
    </div>
);

// ─── Main Section ─────────────────────────────────────────────────────────────
const ExecutiveOverviewSection = ({
    kpiData,
    radarData,
    dimensionData,
    selectedControl,
    setSelectedControl,
    reportingData,
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── Compact KPI Row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>

                {/* RCI Score with Gauge */}
                <div style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: '10px 12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                    borderTop: '2px solid #5e72e4',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    height: '100%',
                    minHeight: 110
                }}>
                    <span style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.04em', alignSelf: 'flex-start' }}>Risk Culture Index</span>
                    <RCIGauge score={Math.round(kpiData?.rci || 62)} />
                </div>

                <KpiCardNew title="Respondents" value={kpiData?.respondents || 842} subtitle="92% Completion" icon="👥" color="#6366f1" progress={92} />
                <KpiCardNew title="Strong Controls" value={kpiData?.strongControls?.count || 3} subtitle="Top Performance" icon="🛡️" color="#22c55e" progress={75} />
                <KpiCardNew title="Needs Attention" value={kpiData?.weakControls?.count || 2} subtitle="High Priority" icon="⚠️" color="#f59e0b" progress={40} />
            </div>

            {/* ── Spider Chart ── */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <SpiderChartWithDimensions
                    radarData={radarData}
                    selectedControl={selectedControl}
                    setSelectedControl={setSelectedControl}
                    dimensionData={dimensionData}
                />
            </div>

            {/* ── Consolidated Question Insights ── */}
            <QuestionInsightsSection reportingData={reportingData} />
        </div>
    );
};

export default ExecutiveOverviewSection;
