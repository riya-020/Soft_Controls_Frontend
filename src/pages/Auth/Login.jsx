import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginUser, getCurrentUser } from '../../utils/auth';
import kpmgLogo from '../../assets/kpmg-logo.svg';
import login1Img from '../../assets/Login1.jpg';

const Login = ({ role }) => {
    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');
    const [showPw,   setShowPw]   = useState(false);
    const [error,    setError]    = useState('');
    const [loading,  setLoading]  = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const u = getCurrentUser();
        if (u) navigate(`/${u.role}-dashboard`, { replace: true });
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await loginUser(email, password, role);
        setLoading(false);
        if (result.success) navigate(`/${role}-dashboard`, { replace: true });
        else setError(result.message);
    };

    const roleLabel = role === 'admin' ? 'Administrator' : role === 'leader' ? 'Leadership' : 'Employee';

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
            padding: 24,
        }}>
            {/* Full background image */}
            <img src={login1Img} alt="" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 0 }} />
            {/* Overlay for readability */}
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.42)', zIndex: 1 }} />
            <style>{`
                @keyframes loginFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes loginPulse  { 0%,100%{opacity:1} 50%{opacity:.5} }
                .login-input {
                    width: 100%; padding: 12px 16px; border-radius: 10px;
                    border: 1px solid #d1d5db;
                    background: #f9fafb;
                    color: #111827; font-size: 14px; font-weight: 500;
                    outline: none; transition: border-color .2s, background .2s;
                    font-family: inherit; box-sizing: border-box;
                }
                .login-input::placeholder { color: #9ca3af; }
                .login-input:focus { border-color: #00338D; background: #fff; box-shadow: 0 0 0 3px rgba(0,51,141,0.08); }
                .login-btn {
                    width: 100%; padding: 13px; border-radius: 10px; border: none;
                    background: #00338D;
                    color: #fff; font-size: 14px; font-weight: 700;
                    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
                    box-shadow: 0 2px 8px rgba(0,51,141,0.3);
                    transition: background .2s, box-shadow .2s, transform .2s;
                    font-family: inherit; position: relative; overflow: hidden;
                }
                .login-btn:hover:not(:disabled) { background: #002a75; box-shadow: 0 4px 16px rgba(0,51,141,0.35); transform: translateY(-1px); }
                .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .login-btn::after {
                    content:''; position:absolute; top:0; left:-60%; width:40%; height:100%;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);
                    animation: loginPulse 0s; /* activated on hover via JS */
                }
            `}</style>

            <div style={{ width: '100%', maxWidth: 420, animation: 'loginFadeUp .5s ease both', position: 'relative', zIndex: 2 }}>

                {/* Logo + brand */}
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <img src={kpmgLogo} alt="KPMG" style={{ height: 36, objectFit: 'contain' }} />
                        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.3)' }} />
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>Risk Culture</span>
                    </div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '.16em', margin: 0 }}>
                        {roleLabel} Portal
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    borderRadius: 20,
                    padding: '36px 32px',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldCheck size={18} color="#fff" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
                                    Sign in
                                </h2>
                                <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
                                    Access your {roleLabel.toLowerCase()} dashboard
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            background: '#fef2f2', border: '1px solid #fecaca',
                            borderRadius: 10, padding: '10px 14px', marginBottom: 20,
                            fontSize: 13, color: '#dc2626', fontWeight: 500,
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 7, letterSpacing: '.02em' }}>
                                Email Address
                            </label>
                            <input
                                type="email" required
                                className="login-input"
                                placeholder={role === 'admin' ? 'admin@kpmg.com' : 'you@company.com'}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 7, letterSpacing: '.02em' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPw ? 'text' : 'password'} required
                                    className="login-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    style={{ paddingRight: 44 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(p => !p)}
                                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0, display: 'flex' }}
                                >
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="login-btn" disabled={loading} style={{ marginTop: 6 }}>
                            {loading ? (
                                <>
                                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', animation: 'spin 0.8s linear infinite' }} />
                                    Signing in…
                                </>
                            ) : (
                                <>Sign In <ArrowRight size={15} /></>
                            )}
                        </button>
                    </form>

                    {/* Sign up link */}
                    {role !== 'admin' && (
                        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                            <span style={{ fontSize: 13, color: '#9ca3af' }}>Don't have an account? </span>
                            <Link to={`/${role}-signup`} style={{ fontSize: 13, color: '#00338D', fontWeight: 600, textDecoration: 'none' }}>
                                Request Access
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 24 }}>
                    © {new Date().getFullYear()} KPMG Risk Culture Platform
                </p>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Login;






