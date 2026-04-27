import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BarChart3, MessageSquare, ArrowRight, ShieldCheck, TrendingUp, ChevronDown } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import kpmgLogo from '../assets/kpmg-logo.svg';
import img1 from '../assets/Leader4.jpg';
import img2 from '../assets/dashboard.jpeg';
import img3 from '../assets/people.jpeg';

const PersonaSelection = () => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [featuresVisible, setFeaturesVisible] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
    const featuresRef = useRef(null);
    const statsRef = useRef(null);

    useEffect(() => {
        const user = getCurrentUser();
        if (user) navigate(`/${user.role}-dashboard`, { replace: true });
        setTimeout(() => setMounted(true), 80);

        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [navigate]);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setFeaturesVisible(true); }, { threshold: 0.15 });
        const obs2 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.2 });
        if (featuresRef.current) obs.observe(featuresRef.current);
        if (statsRef.current) obs2.observe(statsRef.current);
        return () => { obs.disconnect(); obs2.disconnect(); };
    }, []);

    const stats = [
        { value: '8', label: 'Soft Controls Measured', icon: ShieldCheck },
        { value: '360°', label: 'Culture Visibility', icon: TrendingUp },
        { value: 'Real-time', label: 'Leadership Insights', icon: BarChart3 },
    ];

    const features = [
        {
            icon: Users, color: '#1d4ed8', bg: '#eff6ff',
            title: 'Leadership Insights',
            desc: 'Provide executives with real-time visibility into risk culture. Aggregated insights reveal behavioral strengths, emerging culture gaps, and areas requiring leadership intervention.',
        },
        {
            icon: MessageSquare, color: '#0891b2', bg: '#ecfeff',
            title: 'Employee Participation',
            desc: 'Structured surveys capture frontline behavioral signals around communication, accountability, and psychological safety — creating a transparent view of culture across the organization.',
        },
        {
            icon: BarChart3, color: '#7c3aed', bg: '#f5f3ff',
            title: 'Culture Analytics',
            desc: 'Transform qualitative cultural indicators into measurable analytics and trend intelligence, enabling leadership teams to monitor culture evolution over time.',
        },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", overflowX: 'hidden' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

                @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
                @keyframes fadeLeft  { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
                @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
                @keyframes float1    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
                @keyframes float2    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(14px)} }
                @keyframes float3    { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-12px) rotate(2deg)} }
                @keyframes shimmer   { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
                @keyframes pulse3    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.5} }
                @keyframes gradMove  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
                @keyframes lineGrow  { from{width:0} to{width:60px} }
                @keyframes countUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

                * { font-family: 'Inter','Segoe UI',system-ui,sans-serif !important; }

                .ps-nav {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
                    transition: all .3s ease;
                }
                .ps-nav.scrolled {
                    background: rgba(255,255,255,0.96);
                    backdrop-filter: blur(16px);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04);
                }

                .ps-btn-primary {
                    display: inline-flex; align-items: center; gap: 10px;
                    background: linear-gradient(135deg, #1d4ed8, #2563eb);
                    color: #fff; border: none; border-radius: 10px;
                    padding: 14px 24px; font-size: 14px; font-weight: 600;
                    cursor: pointer; position: relative; overflow: hidden;
                    box-shadow: 0 4px 20px rgba(29,78,216,0.35);
                    transition: box-shadow .25s, transform .25s;
                }
                .ps-btn-primary:hover { box-shadow: 0 8px 32px rgba(29,78,216,0.5); transform: translateY(-2px); }
                .ps-btn-primary::after {
                    content:''; position:absolute; top:0; left:-60%; width:40%; height:100%;
                    background: linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);
                    animation: shimmer 2.4s ease infinite;
                }

                .ps-btn-secondary {
                    display: inline-flex; align-items: center; gap: 10px;
                    background: #fff; color: #1d4ed8;
                    border: 1.5px solid #bfdbfe; border-radius: 10px;
                    padding: 13px 24px; font-size: 14px; font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(29,78,216,0.08);
                    transition: all .25s;
                }
                .ps-btn-secondary:hover { background: #eff6ff; border-color: #93c5fd; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(29,78,216,0.14); }

                .ps-feature-card {
                    background: #fff; border: 1px solid #e5e7eb; border-radius: 20px;
                    padding: 36px 32px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04);
                    transition: all .35s cubic-bezier(.22,1,.36,1);
                    position: relative; overflow: hidden;
                }
                .ps-feature-card::before {
                    content:''; position:absolute; top:0; left:0; right:0; height:3px;
                    background: linear-gradient(90deg, #1d4ed8, #60a5fa);
                    transform: scaleX(0); transform-origin: left;
                    transition: transform .35s ease;
                }
                .ps-feature-card:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(29,78,216,0.12); border-color: #bfdbfe; }
                .ps-feature-card:hover::before { transform: scaleX(1); }

                .ps-stat-card {
                    background: linear-gradient(135deg, #1d4ed8, #2563eb);
                    border-radius: 18px; padding: 32px 28px; color: #fff;
                    position: relative; overflow: hidden;
                    box-shadow: 0 8px 32px rgba(29,78,216,0.3);
                }
                .ps-stat-card::after {
                    content:''; position:absolute; top:-40%; right:-20%;
                    width:180px; height:180px; border-radius:50%;
                    background: rgba(255,255,255,0.06);
                }

                .ps-img-ring {
                    border-radius: 50%; object-fit: cover;
                    border: 6px solid #fff;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.18);
                }

                .ps-badge {
                    display: inline-flex; align-items: center; gap: 6px;
                    background: #eff6ff; color: #1d4ed8;
                    border: 1px solid #bfdbfe; border-radius: 999px;
                    padding: 6px 14px; font-size: 11px; font-weight: 700;
                    letter-spacing: .08em; text-transform: uppercase;
                }

                .ps-scroll-hint {
                    display: flex; flex-direction: column; align-items: center; gap: 6px;
                    color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 500;
                    animation: fadeIn 1s ease 1.5s both;
                }
                .ps-scroll-hint svg { animation: float2 2s ease infinite; }
            `}</style>

            {/* ── NAVBAR ── */}
            <nav className={`ps-nav${scrolled ? ' scrolled' : ''}`}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={kpmgLogo} alt="KPMG" style={{ height: 34, objectFit: 'contain', filter: scrolled ? 'none' : 'brightness(0) invert(1)' }} />
                        <div style={{ width: 1, height: 20, background: scrolled ? '#e5e7eb' : 'rgba(255,255,255,0.25)' }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: scrolled ? '#111827' : '#fff', letterSpacing: '-.01em' }}>Risk Culture</span>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                {/* BG image */}
                <img src={img1} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', zIndex: 0 }} />
                {/* gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(10,20,60,0.88) 0%, rgba(15,40,100,0.72) 50%, rgba(10,20,60,0.4) 100%)', zIndex: 1 }} />
                {/* animated blue orb */}
                <div style={{ position: 'absolute', top: '10%', right: '8%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.3), transparent 70%)', zIndex: 1, animation: 'float1 8s ease infinite', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '120px 32px 80px', width: '100%' }}>
                    <div style={{ maxWidth: 680 }}>
                        {/* badge */}
                        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all .6s ease .1s', marginBottom: 24 }}>
                            <span className="ps-badge" style={{ background: 'rgba(255,255,255,0.12)', color: '#93c5fd', border: '1px solid rgba(147,197,253,0.3)' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse3 2s ease infinite' }} />
                                Risk Culture assessment Platform
                            </span>
                        </div>

                        {/* headline */}
                        <h1 style={{
                            fontSize: 'clamp(38px,5vw,64px)', fontWeight: 800, color: '#fff',
                            lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 24,
                            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(28px)',
                            transition: 'all .7s ease .2s',
                        }}>
                            Build a Stronger<br />
                            <span style={{ background: 'linear-gradient(90deg, #60a5fa, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                Risk Culture
                            </span>
                        </h1>

                        {/* sub */}
                        <p style={{
                            fontSize: 17, color: 'rgba(255,255,255,0.68)', lineHeight: 1.75,
                            marginBottom: 40, maxWidth: 560, fontWeight: 400,
                            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all .7s ease .35s',
                        }}>
                            Evaluate the behavioral drivers of risk culture across your organization. Transform soft cultural indicators into clear, data-driven insights for leadership decision-making.
                        </p>

                        {/* CTAs */}
                        <div style={{
                            display: 'flex', gap: 14, flexWrap: 'wrap',
                            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all .7s ease .5s',
                        }}>
                            <button className="ps-btn-primary" onClick={() => navigate('/leader-login')} style={{ fontSize: 15, padding: '15px 28px' }}>
                                <BarChart3 size={18} />
                                Access Leadership Insights
                                <ArrowRight size={16} />
                            </button>
                            <button className="ps-btn-secondary" onClick={() => navigate('/employee-login')} style={{ fontSize: 15, padding: '14px 28px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}>
                                <Users size={18} />
                                Contribute to Survey
                            </button>
                        </div>
                    </div>

                    {/* floating image cluster — right side */}
                    <div style={{
                        position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)',
                        width: 420, height: 420,
                        opacity: mounted ? 1 : 0, transition: 'opacity .9s ease .6s',
                        display: 'none',
                    }} className="hero-imgs">
                        <img src={img2} alt="" className="ps-img-ring" style={{ width: 280, height: 280, position: 'absolute', top: 0, right: 0, animation: 'float1 7s ease infinite' }} />
                        <img src={img3} alt="" className="ps-img-ring" style={{ width: 180, height: 180, position: 'absolute', bottom: 0, left: 0, animation: 'float2 9s ease infinite' }} />
                    </div>
                </div>

                {/* scroll hint */}
                <div className="ps-scroll-hint" style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
                    <span>Scroll to explore</span>
                    <ChevronDown size={18} />
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section ref={featuresRef} style={{ background: '#f8faff', padding: '100px 32px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    {/* section header */}
                    <div style={{
                        textAlign: 'center', marginBottom: 64,
                        opacity: featuresVisible ? 1 : 0,
                        transform: featuresVisible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
                        transition: 'opacity .8s ease, transform .8s cubic-bezier(.22,1,.36,1)',
                    }}>
                        <span className="ps-badge" style={{ marginBottom: 16 }}>Platform Capabilities</span>
                        <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 800, color: '#0f172a', margin: '12px 0 16px', letterSpacing: '-0.03em' }}>
                            How the Platform Works
                        </h2>
                        <p style={{ fontSize: 16, color: '#64748b', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
                            A complete risk culture intelligence system — from employee signals to executive insights.
                        </p>
                        {/* animated underline */}
                        <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg,#1d4ed8,#60a5fa)', borderRadius: 4, margin: '20px auto 0', animation: featuresVisible ? 'lineGrow .8s ease .3s both' : 'none' }} />
                    </div>

                    {/* cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
                        {features.map((f, i) => (
                            <div key={i} className="ps-feature-card" style={{
                                opacity: featuresVisible ? 1 : 0,
                                transform: featuresVisible ? 'translateY(0) scale(1)' : 'translateY(48px) scale(0.96)',
                                transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${i * 0.18 + 0.25}s, transform .7s cubic-bezier(.22,1,.36,1) ${i * 0.18 + 0.25}s`,
                            }}>
                                <div style={{ width: 52, height: 52, borderRadius: 14, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
                                    <f.icon size={24} color={f.color} />
                                </div>
                                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 14, letterSpacing: '-0.02em' }}>{f.title}</h3>
                                <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)', padding: '80px 32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-30%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.15), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: 'clamp(26px,3vw,40px)', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.03em' }}>
                        Ready to Measure Your Risk Culture?
                    </h2>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 36, lineHeight: 1.7 }}>
                        Join your organization's risk culture assessment. Leaders gain strategic insights, employees contribute their perspective.
                    </p>
                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="ps-btn-primary" onClick={() => navigate('/leader-login')} style={{ fontSize: 15, padding: '15px 32px' }}>
                            <BarChart3 size={18} /> Leader Access <ArrowRight size={16} />
                        </button>
                        <button className="ps-btn-secondary" onClick={() => navigate('/employee-login')} style={{ fontSize: 15, padding: '14px 32px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <Users size={18} /> Employee Survey
                        </button>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ background: '#fff', borderTop: '1px solid #e5e7eb', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={kpmgLogo} alt="KPMG" style={{ height: 28, objectFit: 'contain' }} />
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>Risk Culture Platform</span>
                </div>
                <div style={{ display: 'flex', gap: 32 }}>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>© {new Date().getFullYear()} KPMG. All rights reserved.</span>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>Confidential — Authorized Personnel Only</span>
                </div>
            </footer>
        </div>
    );
};

export default PersonaSelection;
