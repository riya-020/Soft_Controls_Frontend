import { useState, useEffect, useRef } from 'react';
import { Bell, FileText, Sparkles, LogOut, ChevronDown, LayoutDashboard, PieChart, BarChart3, MessageSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../utils/auth.js';
import kpmgLogo from '../assets/kpmg-logo.svg';

const leaderNavItems = [
    { id: 'overview',          label: 'Overview',          icon: LayoutDashboard },
    { id: 'soft-controls',     label: 'Soft Controls',     icon: PieChart        },
    { id: 'analytics',         label: 'Analytics',         icon: BarChart3       },
    { id: 'question-insights', label: 'Question Insights', icon: MessageSquare   },
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
                    background: #ffffff;
                    border-bottom: 1px solid #ebebeb;
                    box-shadow: 0 1px 0 #ebebeb;
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
                .nb-logo-divider { width:1px; height:18px; background:#e5e7eb; }
                .nb-logo-text { font-size:13px; font-weight:600; color:#111827; letter-spacing:-.01em; }
                .nb-live { width:6px; height:6px; border-radius:50%; background:#22c55e; animation:pulse 2.2s ease infinite; display:inline-block; margin-left:4px; }

                .nb-nav { display:flex; align-items:center; position:relative; padding:3px; background:#f4f4f5; border-radius:10px; gap:1px; }
                .nb-pill {
                    position:absolute; top:3px; height:calc(100% - 6px);
                    background:#fff; border-radius:7px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                    transition: left .25s cubic-bezier(.4,0,.2,1), width .25s cubic-bezier(.4,0,.2,1);
                    pointer-events:none; z-index:0;
                }
                .nb-btn {
                    position:relative; z-index:1;
                    background:none; border:none; cursor:pointer;
                    padding:5px 12px; border-radius:7px;
                    font-size:13px; font-weight:500; color:#71717a;
                    display:flex; align-items:center; gap:5px;
                    transition:color .15s; white-space:nowrap;
                }
                .nb-btn:hover { color:#18181b; }
                .nb-btn.active { color:#18181b; font-weight:600; }
                .nb-btn.active svg { color:#2563eb !important; }

                .nb-report {
                    display:flex; align-items:center; gap:6px;
                    background: #2563eb;
                    border: none; color:#fff; border-radius:8px;
                    padding:7px 14px; font-size:13px; font-weight:600;
                    cursor:pointer; position:relative; overflow:hidden;
                    box-shadow: 0 2px 8px rgba(37,99,235,0.3);
                    transition: background .15s, transform .15s, box-shadow .15s;
                }
                .nb-report:hover { background:#1d4ed8; transform:translateY(-1px); box-shadow: 0 4px 14px rgba(37,99,235,0.4); }
                .nb-report::after {
                    content:''; position:absolute; top:0; left:-60%; width:40%; height:100%;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent);
                    animation:shimmer 2.8s ease infinite;
                }

                .nb-icon {
                    display:flex; align-items:center; justify-content:center;
                    width:34px; height:34px; border-radius:8px;
                    border:1px solid #e5e7eb; background:#fff; color:#71717a;
                    cursor:pointer; transition:all .15s;
                }
                .nb-icon:hover { background:#f4f4f5; color:#18181b; }
                .nb-icon.logout:hover { color:#ef4444; border-color:#fca5a5; }

                .nb-user {
                    display:flex; align-items:center; gap:8px;
                    padding:4px 10px 4px 4px; border-radius:999px;
                    border:1px solid #e5e7eb; background:#fff;
                    animation:slideIn .35s ease both;
                }
                .nb-avatar {
                    width:28px; height:28px; border-radius:50%;
                    background: #2563eb;
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
                            <button className="nb-report" onClick={() => navigate('/report')}>
                                <FileText size={13} /> View Report
                            </button>
                        )}
                        <button className="nb-icon" aria-label="Notifications"><Bell size={14} /></button>
                        <div className="nb-user">
                            <div className="nb-avatar">{(user?.email?.[0] || 'U').toUpperCase()}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#18181b', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</span>
                                <span style={{ fontSize: 10, color: '#a1a1aa', textTransform: 'capitalize' }}>{user?.role}</span>
                            </div>
                            <ChevronDown size={11} style={{ color: '#a1a1aa' }} />
                        </div>
                        <button className="nb-icon logout" onClick={handleLogout} title="Logout"><LogOut size={14} /></button>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;
