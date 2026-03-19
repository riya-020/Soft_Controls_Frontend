import kpmgLogo from '../../assets/kpmg-logo.svg';

export default function CoverPage({ date, respondents }) {
    return (
        <div className="page cover-page" style={{
            background: 'linear-gradient(135deg,#0b3d91,#00338D)',
            color: 'white',
            overflow: 'hidden',
            position: 'relative',
            width: '210mm',
            height: '296mm',
            boxSizing: 'border-box',
            padding: '60px 60px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        }}>
            {/* Background shapes */}
            <div style={{ position: 'absolute', top: -120, right: -120, width: 420, height: 420, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -150, left: -150, width: 500, height: 500, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

            {/* Logo */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <img src={kpmgLogo} alt="KPMG" style={{ height: 40, filter: 'brightness(0) invert(1)' }} />
            </div>

            {/* Main content */}
            <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto', marginBottom: 'auto', paddingTop: 80 }}>
                <div style={{ width: 80, height: 4, background: '#6CACE4', marginBottom: 40 }} />
                <h1 style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.2, marginBottom: 16, color: '#f4f4f4' }}>
                    Soft Controls<br />Deep Dive Report
                </h1>
                <p style={{ fontSize: 22, fontWeight: 300, opacity: 0.9, marginBottom: 48 }}>
                    Organisational Risk Culture Assessment
                </p>
                <div style={{ width: 120, height: 3, background: 'white', marginBottom: 48 }} />
                <div style={{ display: 'flex', gap: 60, fontSize: 16 }}>
                    <div>
                        <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.7, display: 'block', marginBottom: 6 }}>Prepared For</span>
                        <p style={{ fontWeight: 600, margin: 0 }}>Leadership Team</p>
                    </div>
                    <div>
                        <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.7, display: 'block', marginBottom: 6 }}>Prepared By</span>
                        <p style={{ fontWeight: 600, margin: 0 }}>Risk Advisory — KPMG</p>
                    </div>
                    <div>
                        <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.7, display: 'block', marginBottom: 6 }}>Date</span>
                        <p style={{ fontWeight: 600, margin: 0 }}>{date || new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
                    </div>
                    {respondents && (
                        <div>
                            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.7, display: 'block', marginBottom: 6 }}>Respondents</span>
                            <p style={{ fontWeight: 600, margin: 0 }}>{respondents}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.7 }}>
                <span>Confidential — For Authorised Personnel Only</span>
                <span>© {new Date().getFullYear()} KPMG. All rights reserved.</span>
            </div>
        </div>
    );
}
