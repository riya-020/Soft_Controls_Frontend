import { useRef, useEffect, useState } from 'react';
import FunctionRadarProfile from '../FunctionRadarProfile';
import { Building2, ArrowRight, TrendingUp } from 'lucide-react';

const FONT = "'Inter','Segoe UI',system-ui,sans-serif";

// ─── Animated section wrapper ─────────────────────────────────────────────────
const FadeIn = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.1 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        }}>
            {children}
        </div>
    );
};

// ─── Stat pill ────────────────────────────────────────────────────────────────
const StatPill = ({ label, value, color, bg, delay }) => (
    <FadeIn delay={delay}>
        <div style={{
            background: bg,
            border: `1px solid ${color}30`,
            borderRadius: 12,
            padding: '14px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default',
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
            <span style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: '-0.03em', fontFamily: FONT }}>{value}</span>
            <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, fontFamily: FONT }}>{label}</span>
        </div>
    </FadeIn>
);

// ─── CTA Banner ───────────────────────────────────────────────────────────────
const CTABanner = ({ onNavigate }) => (
    <FadeIn delay={0.1}>
        <div style={{
            marginTop: 8,
            background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
            border: '1px solid #e0e7ff',
            borderRadius: 16,
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <TrendingUp size={20} color="#fff" />
                </div>
                <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 3px', fontFamily: FONT }}>
                        Up Next
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 2px', fontFamily: FONT }}>
                        Ready to see AI-powered recommendations?
                    </p>
                    <p style={{ fontSize: 12, color: '#6b7280', margin: 0, fontFamily: FONT }}>
                        Navigate to Recommendations to see targeted actions for each soft control.
                    </p>
                </div>
            </div>
            <button
                onClick={() => onNavigate?.('recommendations')}
                style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff', border: 'none', borderRadius: 10,
                    padding: '11px 20px', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: FONT,
                    transition: 'opacity 0.2s, transform 0.2s',
                    boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
                View Recommendations
                <ArrowRight size={15} />
            </button>
        </div>
    </FadeIn>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const FunctionWiseSection = ({ onNavigate }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: FONT }}>

            {/* ── Header ── */}
            <FadeIn delay={0}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
                    }}>
                        <Building2 size={20} color="#fff" />
                    </div>
                    <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 4px', fontFamily: FONT }}>
                            Organisational Breakdown
                        </p>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.02em', fontFamily: FONT }}>
                            Function Analysis
                        </h2>
                        <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6, fontFamily: FONT }}>
                            Explore soft control scores broken down by organisational function and compare against the overall average.
                        </p>
                    </div>
                </div>
            </FadeIn>



            {/* ── Radar chart ── */}
            <FadeIn delay={0.15}>
                <div style={{
                    background: '#fff',
                    border: '1px solid #ebebeb',
                    borderRadius: 16,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                }}>
                
                    <FunctionRadarProfile />
                </div>
            </FadeIn>

            {/* ── CTA ── */}
            <CTABanner onNavigate={onNavigate} />
        </div>
    );
};

export default FunctionWiseSection;
