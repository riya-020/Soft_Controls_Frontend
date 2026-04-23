import { useState, useEffect, useRef } from 'react';
import { Bell, FileText, Sparkles, LogOut, ChevronDown, LayoutDashboard, PieChart, BarChart3, MessageSquare, ShieldAlert } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../utils/auth.js';
import kpmgLogo from '../assets/kpmg-logo.svg';

const leaderNavItems = [
    { id: 'overview',          label: 'Overview',          icon: LayoutDashboard },
    { id: 'soft-controls',     label: 'Soft Controls',     icon: PieChart        },
    { id: 'analytics',         label: 'Analytics',         icon: BarChart3       },
    // { id: 'question-insights', label: 'Question Insights', icon: MessageSquare   },
    { id: 'recommendations',   label: 'Recommendations',   icon: Sparkles        },
];

const Navbar = () => {
    const user = getCurrentUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeId, setActiveId] = useState('overview');
    const [pill, setPill] = useState({ left: 0, width: 0 });
    const navRef = useRef(null);
    const btnRefs = useRef({});

    useEffect(() => {
        const el = btnRefs.current[activeId];
        const nav = navRef.current;
        if (el && nav) {
            const nr = nav.getBoundingClientRect();
            const er = el.getBoundingClientRect();
            setPill({ left: er.left - nr.left, width: er.width });
        }
    }, [activeId]);

    const handleLogout = () => { logoutUser(); navigate('/', { replace: true }); };

    const handleNav = (id) => {
        setActiveId(id);
        const fire = () => window.dispatchEvent(new CustomEvent('leader-dashboard-nav', { detail: { section: id } }));
        if (location.pathname !== '/leader-dashboard') { navigate('/leader-dashboard'); setTimeout(fire, 120); }
        else fire();
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @keyframes nbFadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
                @keyframes shimmer  { 0%{transform:translateX(-100%)} 100%{transform:translateX(300%)} }
                @keyframes pulse    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:.5} }
                @keyframes slideIn  { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }

                * { font-family: 'Inter','Segoe UI',system-ui,sans-serif !important; }

                .nb-root {
                    background: #1e3a8a;
                    border-bottom: 1px solid #1e40af;
                    box-shadow: 0 1px 0 #1e40af;
                    position: sticky; top: 0; z-index: 100;
                    animation: nbFadeIn .35s ease both;
                }
                .nb-inner {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    padding: 0 28px; height: 56px;
                    max-width: 1600px; margin: 0 auto;
                }

                .nb-logo { display:flex; align-items:center; gap:10px; flex-shrink:0; }
                .nb-logo-divider { width:1px; height:18px; background:rgba(255,255,255,0.25); }
                .nb-logo-text { font-size:13px; font-weight:600; color:#ffffff; letter-spacing:-.01em; }
                .nb-live { width:6px; height:6px; border-radius:50%; background:#4ade80; animation:pulse 2.2s ease infinite; display:inline-block; margin-left:4px; }

                .nb-nav { display:flex; align-items:center; position:relative; padding:3px; background:rgba(255,255,255,0.12); border-radius:10px; gap:1px; }
                .nb-pill {
                    position:absolute; top:3px; height:calc(100% - 6px);
                    background:rgba(255,255,255,0.2); border-radius:7px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                    transition: left .25s cubic-bezier(.4,0,.2,1), width .25s cubic-bezier(.4,0,.2,1);
                    pointer-events:none; z-index:0;
                }
                .nb-btn {
                    position:relative; z-index:1;
                    background:none; border:none; cursor:pointer;
                    padding:5px 12px; border-radius:7px;
                    font-size:13px; font-weight:500; color:rgba(255,255,255,0.7);
                    display:flex; align-items:center; gap:5px;
                    transition:color .15s; white-space:nowrap;
                }
                .nb-btn:hover { color:#ffffff; }
                .nb-btn.active { color:#ffffff; font-weight:600; }
                .nb-btn.active svg { color:#93c5fd !important; }

                .nb-report {
                    display:flex; align-items:center; gap:6px;
                    background: rgba(255,255,255,0.15);
                    border: 1px solid rgba(255,255,255,0.3); color:#fff; border-radius:8px;
                    padding:7px 14px; font-size:13px; font-weight:600;
                    cursor:pointer; position:relative; overflow:hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    transition: background .15s, transform .15s, box-shadow .15s;
                }
                .nb-report:hover { background:rgba(255,255,255,0.25); transform:translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.2); }
                .nb-report::after {
                    content:''; position:absolute; top:0; left:-60%; width:40%; height:100%;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);
                    animation:shimmer 2.8s ease infinite;
                }

                .nb-icon {
                    display:flex; align-items:center; justify-content:center;
                    width:34px; height:34px; border-radius:8px;
                    border:1px solid rgba(255,255,255,0.25); background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.8);
                    cursor:pointer; transition:all .15s;
                }
                .nb-icon:hover { background:rgba(255,255,255,0.2); color:#ffffff; }
                .nb-icon.logout:hover { color:#fca5a5; border-color:rgba(252,165,165,0.5); }

                .nb-user {
                    display:flex; align-items:center; gap:8px;
                    padding:4px 10px 4px 4px; border-radius:999px;
                    border:1px solid rgba(255,255,255,0.25); background:rgba(255,255,255,0.1);
                    animation:slideIn .35s ease both;
                }
                .nb-avatar {
                    width:28px; height:28px; border-radius:50%;
                    background: rgba(255,255,255,0.25);
                    display:flex; align-items:center; justify-content:center;
                    color:#fff; font-size:11px; font-weight:700; flex-shrink:0;
                }
            `}</style>

            <header className="nb-root">
                <div className="nb-inner">
                    {/* Logo */}
                    <div className="nb-logo">
                        <img src={kpmgLogo} alt="KPMG" style={{ height: 30, objectFit: 'contain' }} />
                        <div className="nb-logo-divider" />
                        <span className="nb-logo-text">Risk Culture</span>
                        <span className="nb-live" />
                    </div>

                    {/* Center nav */}
                    {user?.role === 'leader' && (
                        <nav ref={navRef} className="nb-nav">
                            <div className="nb-pill" style={{ left: pill.left, width: pill.width }} />
                            {leaderNavItems.map(item => (
                                <button
                                    key={item.id}
                                    ref={el => btnRefs.current[item.id] = el}
                                    className={`nb-btn${activeId === item.id ? ' active' : ''}`}
                                    onClick={() => handleNav(item.id)}
                                >
                                    <item.icon size={13} style={{ color: activeId === item.id ? '#2563eb' : '#a1a1aa' }} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    )}

                    {/* Right */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        {user?.role === 'leader' && (
                            <button className="nb-report" onClick={() => navigate('/policy')}>
                                <ShieldAlert size={13} /> Policy Gap
                            </button>
                        )}
                        {user?.role === 'leader' && (
                            <button className="nb-report" onClick={() => navigate('/report')}>
                                <FileText size={13} /> View Report
                            </button>
                        )}
                        <button className="nb-icon" aria-label="Notifications"><Bell size={14} /></button>
                        <div className="nb-user">
                            <div className="nb-avatar">{(user?.email?.[0] || 'U').toUpperCase()}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#ffffff', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</span>
                                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>{user?.role}</span>
                            </div>
                            <ChevronDown size={11} style={{ color: 'rgba(255,255,255,0.5)' }} />
                        </div>
                        <button className="nb-icon logout" onClick={handleLogout} title="Logout"><LogOut size={14} /></button>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;
