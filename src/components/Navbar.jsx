import { useState, useEffect, useRef } from 'react';
import { Bell, FileText, Sparkles, LogOut, ChevronDown, LayoutDashboard, PieChart, BarChart3, ShieldAlert } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../utils/auth.js';
import kpmgLogo from '../assets/kpmg-logo.svg';

// ─── Nav items for leader role ────────────────────────────────────────────────
const leaderNavItems = [
    { id: 'overview',        label: 'Overview',        icon: LayoutDashboard },
    { id: 'soft-controls',   label: 'Soft Controls',   icon: PieChart        },
    { id: 'analytics',       label: 'Analytics',       icon: BarChart3       },
    // { id: 'question-insights', label: 'Question Insights', icon: MessageSquare },
    { id: 'recommendations', label: 'Recommendations', icon: Sparkles        },
];

// ─── Navbar component ─────────────────────────────────────────────────────────
const Navbar = () => {
    const user     = getCurrentUser();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeId,    setActiveId]    = useState('overview');
    const [pill,        setPill]        = useState({ left: 0, width: 0 });
    const [notifCount,  setNotifCount]  = useState(2);   // placeholder count
    const [showNotif,   setShowNotif]   = useState(false);
    const [pillReady,   setPillReady]   = useState(false);

    const navRef  = useRef(null);
    const btnRefs = useRef({});

    // ── Reposition sliding pill when active item changes ──────────────────────
    useEffect(() => {
        const el  = btnRefs.current[activeId];
        const nav = navRef.current;
        if (el && nav) {
            const nr = nav.getBoundingClientRect();
            const er = el.getBoundingClientRect();
            setPill({ left: er.left - nr.left, width: er.width });
            setPillReady(true);
        }
    }, [activeId]);

    // ── Logout ─────────────────────────────────────────────────────────────────
    const handleLogout = () => { logoutUser(); navigate('/', { replace: true }); };

    // ── Navigation — fires custom event so LeaderDashboard can scroll ─────────
    const handleNav = (id) => {
        setActiveId(id);
        const fire = () =>
            window.dispatchEvent(new CustomEvent('leader-dashboard-nav', { detail: { section: id } }));
        if (location.pathname !== '/leader-dashboard') {
            navigate('/leader-dashboard');
            setTimeout(fire, 120);
        } else {
            fire();
        }
    };

    // ── Initials from email ────────────────────────────────────────────────────
    const initials = (user?.email?.[0] || 'U').toUpperCase();

    return (
        <>
            {/* ── Global styles ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500&display=swap');

                /* ── Animations ── */
                @keyframes nb-enter    { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
                @keyframes nb-shimmer  { 0%{transform:translateX(-120%)} 100%{transform:translateX(320%)} }
                @keyframes nb-pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.8)} }
                @keyframes nb-spin     { to{transform:rotate(360deg)} }
                @keyframes nb-notif-in { from{opacity:0;transform:translateY(-8px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }

                /* ── Root bar ── */
                .nb-root {
                    position: sticky; top: 0; z-index: 200;
                    height: 58px;
                    background: linear-gradient(180deg, #0d1f4e 0%, #0f2356 100%);
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                    box-shadow:
                        0 1px 0 rgba(255,255,255,0.05) inset,
                        0 4px 24px rgba(0,0,0,0.35),
                        0 1px 3px rgba(0,0,0,0.2);
                    /* Subtle noise grain texture */
                    backdrop-filter: blur(0px);
                    animation: nb-enter .4s cubic-bezier(.16,1,.3,1) both;
                    font-family: 'DM Sans', 'Segoe UI', system-ui, sans-serif !important;
                }

                /* Thin accent line at very top */
                .nb-root::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 2px;
                    background: linear-gradient(90deg, #1d4ed8 0%, #3b82f6 40%, #60a5fa 70%, #1d4ed8 100%);
                }

                .nb-inner {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    height: 100%; padding: 0 24px;
                    max-width: 1600px; margin: 0 auto;
                    gap: 16px;
                }

                /* ── Logo zone ── */
                .nb-logo-wrap {
                    display: flex; align-items: center; gap: 10px;
                    flex-shrink: 0; user-select: none;
                }
                .nb-logo-img { height: 28px; object-fit: contain; filter: brightness(0) invert(1); }
                .nb-logo-sep {
                    width: 1px; height: 20px;
                    background: linear-gradient(180deg, transparent, rgba(255,255,255,0.2), transparent);
                }
                .nb-logo-label {
                    display: flex; flex-direction: column; gap: 0;
                }
                .nb-logo-title {
                    font-size: 13px; font-weight: 700; color: #ffffff;
                    letter-spacing: -.01em; line-height: 1.15;
                }
                .nb-logo-sub {
                    font-size: 9.5px; font-weight: 500;
                    color: rgba(255,255,255,0.4); letter-spacing: .06em;
                    text-transform: uppercase; line-height: 1;
                }
                /* Live dot */
                .nb-live-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #4ade80;
                    box-shadow: 0 0 6px #4ade80;
                    animation: nb-pulse 2.4s ease infinite;
                    display: inline-block; margin-left: 2px;
                }

                /* ── Centre nav pill track ── */
                .nb-nav-track {
                    display: flex; align-items: center;
                    position: relative;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    padding: 4px;
                    gap: 2px;
                }

                /* Sliding active pill */
                .nb-pill {
                    position: absolute; top: 4px;
                    height: calc(100% - 8px);
                    background: linear-gradient(135deg, rgba(59,130,246,0.5) 0%, rgba(37,99,235,0.6) 100%);
                    border: 1px solid rgba(96,165,250,0.3);
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(37,99,235,0.25), 0 0 0 1px rgba(96,165,250,0.15) inset;
                    transition: left .28s cubic-bezier(.4,0,.2,1), width .28s cubic-bezier(.4,0,.2,1);
                    pointer-events: none; z-index: 0;
                    opacity: 0;
                }
                .nb-pill.ready { opacity: 1; transition: left .28s cubic-bezier(.4,0,.2,1), width .28s cubic-bezier(.4,0,.2,1), opacity .15s; }

                /* Nav buttons */
                .nb-nav-btn {
                    position: relative; z-index: 1;
                    background: none; border: none; cursor: pointer;
                    padding: 6px 13px; border-radius: 8px;
                    font-size: 12.5px; font-weight: 500;
                    color: rgba(255,255,255,0.55);
                    display: flex; align-items: center; gap: 6px;
                    transition: color .15s; white-space: nowrap;
                    font-family: 'DM Sans', system-ui, sans-serif;
                    letter-spacing: -.01em;
                }
                .nb-nav-btn:hover { color: rgba(255,255,255,0.9); }
                .nb-nav-btn.active { color: #ffffff; font-weight: 600; }
                .nb-nav-btn.active .nb-nav-icon { color: #93c5fd !important; }
                .nb-nav-icon { transition: color .15s; }

                /* ── Right-side actions ── */
                .nb-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

                /* Action buttons (Policy Gap / View Report) */
                .nb-action-btn {
                    display: flex; align-items: center; gap: 6px;
                    padding: 6px 14px; border-radius: 8px;
                    font-size: 12.5px; font-weight: 600;
                    cursor: pointer; border: none;
                    font-family: 'DM Sans', system-ui, sans-serif;
                    letter-spacing: -.01em;
                    position: relative; overflow: hidden;
                    transition: transform .15s, box-shadow .15s, background .15s;
                }
                .nb-action-btn::after {
                    content: '';
                    position: absolute; top: 0; left: -80%; width: 50%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent);
                    animation: nb-shimmer 3s ease infinite;
                }
                .nb-action-btn:hover { transform: translateY(-1px); }
                .nb-action-btn:active { transform: translateY(0); }

                /* Policy Gap — outlined style */
                .nb-btn-policy {
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.18) !important;
                    color: rgba(255,255,255,0.85);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                }
                .nb-btn-policy:hover {
                    background: rgba(255,255,255,0.14);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                /* View Report — filled accent */
                .nb-btn-report {
                    background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
                    border: 1px solid rgba(96,165,250,0.25) !important;
                    color: #ffffff;
                    box-shadow: 0 2px 8px rgba(29,78,216,0.35);
                }
                .nb-btn-report:hover {
                    background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
                    box-shadow: 0 4px 16px rgba(29,78,216,0.45);
                }

                /* Icon-only buttons */
                .nb-icon-btn {
                    display: flex; align-items: center; justify-content: center;
                    width: 34px; height: 34px; border-radius: 9px;
                    border: 1px solid rgba(255,255,255,0.12);
                    background: rgba(255,255,255,0.07);
                    color: rgba(255,255,255,0.65);
                    cursor: pointer;
                    transition: all .15s;
                    position: relative;
                    flex-shrink: 0;
                }
                .nb-icon-btn:hover { background: rgba(255,255,255,0.14); color: #ffffff; border-color: rgba(255,255,255,0.22); }
                .nb-icon-btn.logout:hover { background: rgba(239,68,68,0.15); color: #fca5a5; border-color: rgba(252,165,165,0.3); }

                /* Notification badge */
                .nb-notif-badge {
                    position: absolute; top: -4px; right: -4px;
                    min-width: 16px; height: 16px; border-radius: 8px;
                    background: #ef4444;
                    border: 2px solid #0d1f4e;
                    font-size: 9px; font-weight: 700; color: #fff;
                    display: flex; align-items: center; justify-content: center;
                    padding: 0 3px; line-height: 1;
                    font-family: 'DM Mono', monospace;
                }

                /* ── User chip ── */
                .nb-user-chip {
                    display: flex; align-items: center; gap: 8px;
                    padding: 4px 10px 4px 4px;
                    border-radius: 999px;
                    border: 1px solid rgba(255,255,255,0.12);
                    background: rgba(255,255,255,0.07);
                    cursor: default;
                    transition: background .15s, border-color .15s;
                }
                .nb-user-chip:hover { background: rgba(255,255,255,0.11); border-color: rgba(255,255,255,0.2); }
                .nb-avatar {
                    width: 28px; height: 28px; border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    border: 1.5px solid rgba(255,255,255,0.2);
                    display: flex; align-items: center; justify-content: center;
                    color: #fff; font-size: 11px; font-weight: 700;
                    flex-shrink: 0; letter-spacing: 0;
                }
                .nb-user-name {
                    font-size: 12px; font-weight: 600; color: #ffffff;
                    max-width: 120px; overflow: hidden;
                    text-overflow: ellipsis; white-space: nowrap; line-height: 1.25;
                }
                .nb-user-role {
                    font-size: 9.5px; color: rgba(255,255,255,0.45);
                    text-transform: capitalize; line-height: 1;
                    letter-spacing: .03em;
                }

                /* ── Divider between logo/nav/actions ── */
                .nb-divider {
                    width: 1px; height: 22px;
                    background: rgba(255,255,255,0.1);
                    flex-shrink: 0;
                }
            `}</style>

            <header className="nb-root">
                <div className="nb-inner">

                    {/* ── Logo ── */}
                    <div className="nb-logo-wrap">
                        <img src={kpmgLogo} alt="KPMG" className="nb-logo-img" />
                        <div className="nb-logo-sep" />
                        <div className="nb-logo-label">
                            <span className="nb-logo-title">Risk Culture</span>
                            <span className="nb-logo-sub">Dashboard</span>
                        </div>
                        <span className="nb-live-dot" title="Live data" />
                    </div>

                    {/* ── Centre navigation (leader only) ── */}
                    {user?.role === 'leader' && (
                        <nav ref={navRef} className="nb-nav-track" aria-label="Dashboard navigation">
                            {/* Sliding active pill */}
                            <div
                                className={`nb-pill${pillReady ? ' ready' : ''}`}
                                style={{ left: pill.left, width: pill.width }}
                                aria-hidden="true"
                            />

                            {leaderNavItems.map(item => (
                                <button
                                    key={item.id}
                                    ref={el => { btnRefs.current[item.id] = el; }}
                                    className={`nb-nav-btn${activeId === item.id ? ' active' : ''}`}
                                    onClick={() => handleNav(item.id)}
                                    aria-current={activeId === item.id ? 'page' : undefined}
                                >
                                    <item.icon
                                        size={13}
                                        className="nb-nav-icon"
                                        style={{ color: activeId === item.id ? '#93c5fd' : 'rgba(255,255,255,0.35)' }}
                                    />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    )}

                    {/* ── Right-side actions ── */}
                    <div className="nb-actions">

                        {/* Policy Gap button — leader only */}
                        {user?.role === 'leader' && (
                            <button
                                className="nb-action-btn nb-btn-policy"
                                onClick={() => navigate('/policy')}
                                title="Policy Compliance Gap Analysis"
                            >
                                <ShieldAlert size={13} />
                                Policy Gap
                            </button>
                        )}

                        {/* View Report button — leader only */}
                        {user?.role === 'leader' && (
                            <button
                                className="nb-action-btn nb-btn-report"
                                onClick={() => navigate('/report')}
                                title="Download full report"
                            >
                                <FileText size={13} />
                                View Report
                            </button>
                        )}

                        <div className="nb-divider" />

                        {/* Notification bell */}
                        <button
                            className="nb-icon-btn"
                            aria-label={`Notifications${notifCount > 0 ? ` (${notifCount})` : ''}`}
                            onClick={() => setShowNotif(v => !v)}
                        >
                            <Bell size={14} />
                            {notifCount > 0 && (
                                <span className="nb-notif-badge">{notifCount}</span>
                            )}
                        </button>

                        {/* User chip */}
                        <div className="nb-user-chip" title={user?.email}>
                            <div className="nb-avatar">{initials}</div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="nb-user-name">{user?.email}</span>
                                <span className="nb-user-role">{user?.role}</span>
                            </div>
                            <ChevronDown size={11} style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
                        </div>

                        {/* Logout */}
                        <button
                            className="nb-icon-btn logout"
                            onClick={handleLogout}
                            title="Logout"
                            aria-label="Logout"
                        >
                            <LogOut size={14} />
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;