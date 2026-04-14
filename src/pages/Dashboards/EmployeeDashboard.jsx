import { useState, useEffect, useRef } from 'react';
import { ExternalLink, ClipboardList, ShieldCheck, Users, Eye, Target, CheckCircle, MessageCircle, BarChart2, Lightbulb, Lock } from 'lucide-react';
import kpmgLogo from '../../assets/kpmg-logo.svg';
import dashImg from '../../assets/Leader4.jpg';

const pillars = [
    {
        title: 'Transparency',
        description: 'Degree to which management is open and clear about decisions, actions, and outcomes across the organisation.',
        icon: Eye,
        color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe',
    },
    {
        title: 'Role Modelling',
        description: 'Extent to which leadership exemplifies the organisation\'s core values, ethics, and expected behaviours.',
        icon: Users,
        color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe',
    },
    {
        title: 'Commitment',
        description: 'Dedication from employees and leadership towards organisational goals, standards, and cultural expectations.',
        icon: CheckCircle,
        color: '#059669', bg: '#f0fdf4', border: '#bbf7d0',
    },
    {
        title: 'Achievability',
        description: 'Ensuring that assigned tasks, targets, and objectives are realistic, attainable, and properly resourced.',
        icon: Target,
        color: '#d97706', bg: '#fffbeb', border: '#fde68a',
    },
    {
        title: 'Enforcement',
        description: 'Consistent and fair application of rules, policies, and consequences across all levels of the organisation.',
        icon: Lock,
        color: '#dc2626', bg: '#fff1f2', border: '#fecdd3',
    },
    {
        title: 'Accountability',
        description: 'Taking ownership of actions, decisions, and resulting outcomes — at both individual and leadership levels.',
        icon: BarChart2,
        color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc',
    },
    {
        title: 'Discussability',
        description: 'Comfort level of employees in raising concerns, challenging decisions, and discussing issues openly without fear.',
        icon: MessageCircle,
        color: '#9333ea', bg: '#faf5ff', border: '#e9d5ff',
    },
    {
        title: 'Clarity',
        description: 'Clear understanding of expectations, roles, responsibilities, and how individual work connects to organisational goals.',
        icon: Lightbulb,
        color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0',
    },
];

const PillarCard = ({ pillar, index }) => {
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const Icon = pillar.icon;

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#fff',
                border: `1px solid ${hovered ? pillar.border : '#ebebeb'}`,
                borderRadius: 14,
                padding: '22px 20px',
                display: 'flex', flexDirection: 'column', gap: 14,
                cursor: 'default', position: 'relative', overflow: 'hidden',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity .5s ease ${index * 0.07}s, transform .5s ease ${index * 0.07}s, box-shadow .2s, border-color .2s`,
                boxShadow: hovered ? `0 8px 28px ${pillar.color}18` : '0 1px 3px rgba(0,0,0,0.05)',
            }}
        >
            {/* top accent line */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: pillar.color,
                transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform .3s ease',
                borderRadius: '14px 14px 0 0',
            }} />

            {/* icon + number */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: pillar.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={pillar.color} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#d1d5db', letterSpacing: '.04em' }}>
                    {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            {/* title */}
            <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                    {pillar.title}
                </h3>
                <div style={{ width: 28, height: 2.5, background: pillar.color, borderRadius: 2 }} />
            </div>

            {/* description */}
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65, margin: 0 }}>
                {pillar.description}
            </p>
        </div>
    );
};

const EmployeeDashboard = () => {
    const [heroVisible, setHeroVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setHeroVisible(true), 80);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                @keyframes slideR   { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
                @keyframes shimmer  { 0%{transform:translateX(-100%)} 100%{transform:translateX(300%)} }
                @keyframes pulse3   { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.5} }
                * { font-family: 'Inter','Segoe UI',system-ui,sans-serif !important; }

                .emp-cta {
                    display: inline-flex; align-items: center; gap: 10px;
                    background: #fff; color: #1d4ed8;
                    padding: 14px 28px; border-radius: 10px;
                    font-weight: 700; font-size: 15px;
                    text-decoration: none; white-space: nowrap;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.18);
                    transition: transform .2s, box-shadow .2s;
                    position: relative; overflow: hidden;
                }
                .emp-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.22); }
                .emp-cta::after {
                    content:''; position:absolute; top:0; left:-60%; width:40%; height:100%;
                    background: linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent);
                    animation: shimmer 2.4s ease infinite;
                }
            `}</style>

            {/* ── HERO ── */}
            <div style={{
                position: 'relative', borderRadius: 18, overflow: 'hidden', minHeight: 240,
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            }}>
                <img src={dashImg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(10,20,60,0.88) 0%, rgba(15,40,100,0.65) 55%, rgba(10,20,60,0.15) 100%)' }} />

                <div style={{ position: 'relative', zIndex: 1, padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', minHeight: 240 }}>
                    <div style={{ maxWidth: 560 }}>
                        {/* badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 999, padding: '5px 14px', marginBottom: 18,
                            opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(10px)',
                            transition: 'all .5s ease .05s',
                        }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse3 2s ease infinite' }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '.12em' }}>
                                Confidential · Internal Use Only
                            </span>
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, color: '#fff',
                            margin: '0 0 14px', lineHeight: 1.1, letterSpacing: '-0.025em',
                            opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
                            transition: 'all .6s ease .15s',
                        }}>
                            Risk Culture Survey
                        </h1>

                        <p style={{
                            fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75,
                            margin: 0, maxWidth: 480, fontWeight: 400,
                            opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(12px)',
                            transition: 'all .6s ease .28s',
                        }}>
                            Your responses provide valuable insights into our Soft Control Pillars and support ongoing cultural improvements across the organisation.
                        </p>
                    </div>

                    <div style={{
                        opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
                        transition: 'all .6s ease .4s',
                    }}>
                        <a href="https://forms.office.com/r/SNX6Wt7dRy" target="_blank" rel="noopener noreferrer" className="emp-cta">
                            <ClipboardList size={18} color="#1d4ed8" />
                            Start Survey
                            <ExternalLink size={14} color="#2563eb" />
                        </a>
                    </div>
                </div>
            </div>

            {/* ── STATS STRIP ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                {[
                    { value: '8', label: 'Soft Control Pillars', sub: 'Measured across the organisation', icon: ShieldCheck, color: '#fff', textColor: '#fff', gradient: 'linear-gradient(135deg, #1d4ed8 0%, #a2bfffff 100%)', shadow: 'rgba(29,78,216,0.3)' },
                    { value: '100%', label: 'Anonymous Responses', sub: 'Your identity is fully protected', icon: Lock, color: '#fff', textColor: '#fff', gradient: 'linear-gradient(135deg, #28b3d9ff 0%, rgba(209, 184, 252, 1) 100%)', shadow: 'rgba(196, 200, 255, 0.6)' },
                    { value: 'KPMG', label: 'Risk Culture Assessment', sub: 'Powered by KPMG Advisory', icon: BarChart2, color: '#fff', textColor: '#fff', gradient: 'linear-gradient(135deg, #7174b9ff 0%, #97a1feff 100%)', shadow: 'rgba(5,150,105,0.3)' },
                ].map((s, i) => (
                    <div key={i} style={{
                        background: s.gradient,
                        borderRadius: 14, padding: '22px 24px',
                        display: 'flex', alignItems: 'center', gap: 16,
                        boxShadow: `0 4px 20px ${s.shadow}`,
                        animation: `fadeUp .45s ease ${i * 0.1}s both`,
                        position: 'relative', overflow: 'hidden',
                    }}>
                        {/* bg orb */}
                        <div style={{ position: 'absolute', top: -20, right: -20, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
                        <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <s.icon size={22} color="#fff" />
                        </div>
                        <div>
                            <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 2px', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</p>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', margin: '0 0 2px', fontWeight: 700 }}>{s.label}</p>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{s.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── PILLARS SECTION ── */}
            <div>
                {/* Section header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
                    <div style={{ flex: 1, height: 1, background: '#ebebeb' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 7, height: 7, background: '#2563eb', borderRadius: 2, transform: 'rotate(45deg)' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.12em' }}>
                            The 8 Soft Control Pillars
                        </span>
                        <div style={{ width: 7, height: 7, background: '#2563eb', borderRadius: 2, transform: 'rotate(45deg)' }} />
                    </div>
                    <div style={{ flex: 1, height: 1, background: '#ebebeb' }} />
                </div>

                {/* 4-col grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                    {pillars.map((p, i) => <PillarCard key={p.title} pillar={p} index={i} />)}
                </div>
            </div>

            {/* ── KPMG FOOTER ── */}
            <div style={{
                background: '#fff', border: '1px solid #ebebeb', borderRadius: 14,
                padding: '24px 32px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 16,
                animation: 'fadeUp .5s ease .3s both',
            }}>
                {/* Left: logo + tagline */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <img src={kpmgLogo} alt="KPMG" style={{ height: 32, objectFit: 'contain' }} />
                    <div style={{ width: 1, height: 32, background: '#ebebeb' }} />
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>Risk Culture Platform</p>
                        <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Advisory Services · Internal Use Only</p>
                    </div>
                </div>

                {/* Center: confidentiality note */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8f9fa', borderRadius: 8, padding: '8px 14px', border: '1px solid #ebebeb' }}>
                    <Lock size={12} color="#9ca3af" />
                    <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>All responses are strictly confidential and anonymous</span>
                </div>

                {/* Right: copyright */}
                <p style={{ fontSize: 11, color: '#d1d5db', margin: 0 }}>
                    © {new Date().getFullYear()} KPMG. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
