import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, BarChart3, MessageSquare } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import kpmgLogo from '../assets/kpmg-logo.svg';
import img1 from "../assets/purple.jpeg";
import img2 from "../assets/dashboard.jpeg";
import img3 from "../assets/people.jpeg";



const PersonaSelection = () => {


    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [featuresVisible, setFeaturesVisible] = useState(false);

    useEffect(() => {
        const user = getCurrentUser();
        if (user) navigate(`/${user.role}-dashboard`, { replace: true });
        setTimeout(() => setMounted(true), 50);
    }, [navigate]);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setFeaturesVisible(true);
                }
            },
            { threshold: 0.25 }
        );

        const el = document.getElementById("features-section");
        if (el) observer.observe(el);

        return () => observer.disconnect();
    }, []);

    const personas = [
        {
            id: 'leader',
            title: 'Leader',
            icon: Users,
            path: '/leader-login'
        },
        {
            id: 'employee',
            title: 'Employee',
            icon: Building2,
            path: '/employee-login'
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: '#F4F5F7',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Georgia', 'Times New Roman', serif"
        }}>

            {/* Top Blue Bar */}
            <div style={{
                background: '#0941a1',
                height: 4,
                width: '100%'
            }} />

            {/* Header */}
            <header style={{
                background: '#ffffff',
                borderBottom: '1px solid #E5E7EB',
                padding: '0 48px',
                height: 64,
                display: 'flex',
                alignItems: 'center',   
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>

                <img src={kpmgLogo} alt="KPMG" style={{ height: 36 }} />

          
            </header>


            {/* Main Content */}
            <main style={{
                flex: 1,
                position: "relative",
                overflow: "hidden",
                padding: "80px 24px"
            }}>

                {/* Background Gradient */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg,#e8f0ff 0%,#f5f8ff 40%,#ffd9ec 100%)",
                    zIndex: 0
                }} />

                {/* Floating Accent Blobs */}
                <div style={{
                    position: "absolute",
                    width: 300,
                    height: 300,
                    background: "#0091DA",
                    opacity: 0.12,
                    borderRadius: "50%",
                    top: -80,
                    left: -80,
                    filter: "blur(60px)",
                    animation: "float1 10s infinite ease-in-out"
                }} />

                <div style={{
                    position: "absolute",
                    width: 260,
                    height: 260,
                    background: "#ff4fa3",
                    opacity: 0.08,
                    borderRadius: "50%",
                    bottom: -80,
                    right: -60,
                    filter: "blur(60px)",
                    animation: "float2 12s infinite ease-in-out"
                }} />

                {/* Hero Content */}
                <div style={{
                    position: "relative",
                    zIndex: 1,
                    maxWidth: 1100,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 60,
                    alignItems: "center"
                }}>

                    {/* LEFT TEXT */}
                    <div style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(30px)",
                        transition: "all .8s ease"
                    }}>

                        <div style={{
                            display: "inline-block",
                            background: "#ffffff",
                            color: "#062079",
                            padding: "6px 14px",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: ".12em",
                            textTransform: "uppercase",
                            marginBottom: 20,
                            borderRadius: 4
                        }}>
                            Risk Culture Intelligence
                        </div>

                        <h1 style={{
                            fontSize: "clamp(36px,4vw,52px)",
                            fontWeight: 700,
                            color: "#001B41",
                            marginBottom: 20,
                            lineHeight: 1.15
                        }}>
                            Build a <span style={{ color: "#0091DA" }}>Stronger</span><br />
                            <span style={{ color: "#473b7a" }}>Risk Culture</span><br />
                        </h1>

                        <p style={{
                            fontSize: 17,
                            fontFamily: "'Inter','Arial', sans-serif",
                            color: "#4B5563",
                          
                            marginBottom: 32
                        }}>
                            Evaluate the <span className="textHighlight">behavioral drivers of risk culture</span> across your organization.
                            By analyzing leadership tone, communication transparency, and accountability signals,
                            the platform transforms <span className="textHighlight">soft cultural indicators</span> into
                            clear, data-driven insights for leadership decision-making.
                        </p>

                     <div className="ctaButtons">

<button
className="primaryCTA"
onClick={() => navigate("/leader-login")}
>

<div className="ctaIcon">
<BarChart3 size={20}/>
</div>

<span>Access Leadership Insights</span>

<div className="ctaArrow">→</div>

</button>

<button
className="secondaryCTA"
onClick={() => navigate("/employee-login")}
>

<div className="ctaIcon">
<Users size={20}/>
</div>

<span>Contribute to Culture Survey</span>

<div className="ctaArrow">→</div>

</button>

</div>
                    </div>



                    <div style={{
                        position: "relative",
                        height: 520,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>

                        {/* Big Main Circle */}
                        <img
                            src={img1}
                            alt="Risk meeting"
                            style={{
                                width: 420,
                                height: 420,
                                borderRadius: "50%",
                                objectFit: "cover",
                                position: "absolute",
                                top: -10,
                                right: 40,
                                border: "10px solid white",
                                boxShadow: "0 30px 70px rgba(0,0,0,0.18)",
                                animation: "float1 7s ease-in-out infinite"
                            }}
                        />

                        {/* Bottom Circle */}
                        <img
                            src={img2}
                            alt="Risk dashboard"
                            style={{
                                width: 240,
                                height: 240,
                                borderRadius: "50%",
                                objectFit: "cover",
                                position: "absolute",
                                bottom: 10,
                                right: -20,
                                border: "8px solid white",
                                boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
                                animation: "float2 8s ease-in-out infinite"
                            }}
                        />

                        {/* Left Circle */}
                        <img
                            src={img3}
                            alt="Risk discussion"
                            style={{
                                width: 200,
                                height: 200,
                                borderRadius: "50%",
                                objectFit: "cover",
                                position: "absolute",
                                bottom: 160,
                                right: 340,
                                border: "8px solid white",
                                boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
                                animation: "float1 6s ease-in-out infinite"
                            }}
                        />

                    </div>
                </div>



                {/* INFO SECTION */}
                <section
                    id="features-section"
                    style={{
                        width: "100%",
                        padding: "140px 80px",
                        background: "linear-gradient(180deg,#ffffff 0%,#f9fbff 100%)",
                        position: "relative",
                        zIndex: 2,

                        opacity: featuresVisible ? 1 : 0,
                        transform: featuresVisible ? "translateY(0px)" : "translateY(80px)",
                        transition: "all 1s cubic-bezier(.22,1,.36,1)"
                    }}

                >
                    <h2 style={{
                        textAlign: "center",
                        fontSize: 42,
                        fontWeight: 600,
                        marginBottom: 90,
                        color: "#2d0699",
                        letterSpacing: "-0.02em"
                    }}>
                        How the Platform Works
                    </h2>

                    <div style={{
                        maxWidth: "1400px",
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "repeat(3,1fr)",
                        gap: 40
                    }}>

                        {/* CARD 1 */}
                        <div className="bigFeatureCard" style={{ animationDelay: "0.1s" }}>

                            <div className="featureIcon">
                                <Users size={28} />
                            </div>


                            <h3 style={{ color: "#1e30d3" }}>Leadership Insights</h3>

                            <p>
                                Provide executives with <span className="textHighlight">real-time visibility into risk culture</span>.
                                Aggregated insights reveal behavioral strengths, emerging culture gaps,
                                and areas requiring leadership intervention.
                            </p>

                        </div>


                        {/* CARD 2 */}
                        <div className="bigFeatureCard" style={{ animationDelay: "0.25s" }}>

                            <div className="featureIcon">
                                <MessageSquare size={28} />
                            </div>

                            <h3 style={{ color: " #14a1d9" }}>Employee Participation</h3>

                            <p>
                                Structured surveys capture <span className="textHighlight">frontline behavioral signals</span>
                                around communication, accountability, and psychological safety,
                                creating a transparent view of culture across the organization.
                            </p>

                        </div>


                        {/* CARD 3 */}
                        <div className="bigFeatureCard" style={{ animationDelay: "0.4s" }}>

                            <div className="featureIcon">
                                <BarChart3 size={28} />
                            </div>

                            <h3 style={{ color: "#ff4fa3" }}>Culture Analytics</h3>

                            <p>
                                Transform qualitative cultural indicators into
                                <span className="textHighlight"> measurable analytics and trend intelligence</span>,
                                enabling leadership teams to monitor culture evolution over time.
                            </p>

                        </div>



                    </div>

                </section>



                {/* Animations */}
                <style>
                    {`
.textHighlight{
color:#00338D;
font-weight:600;
position:relative;
}

.ctaButtons{
display:flex;
gap:16px;
margin-top:10px;
}

/* BOTH BUTTONS SAME STYLE */

.primaryCTA,
.secondaryCTA{

display:flex;
align-items:center;
gap:10px;

padding:11px 18px;   /* reduced size */

background:#4F6EF7;;
color:white;

border:none;
border-radius:8px;

font-family:Inter, Arial, sans-serif;
font-weight:600;
font-size:14px;

cursor:pointer;

box-shadow:0 12px 30px rgba(0,51,141,0.22);

transition:all .35s cubic-bezier(.22,1,.36,1);
position:relative;
overflow:hidden;
}

.primaryCTA:hover,
.secondaryCTA:hover{
transform:translateY(-3px);
box-shadow:0 18px 45px rgba(0,51,141,0.32);
}

/* Leader button color */

.primaryCTA{
background:linear-gradient(90deg,#4F6EF7 0%,#00338D 100%);
}

/* Employee button color */

.secondaryCTA{

background:white;
color:#1E3A8A;
}
/* ICON */

.ctaIcon{
width:32px;
height:32px;
display:flex;
align-items:center;
justify-content:center;

background:rgba(255,255,255,0.15);
border-radius:8px;
}

/* ARROW ANIMATION */

.ctaArrow{
margin-left:4px;
transition:transform .3s ease;
font-size:18px;
}

.primaryCTA:hover .ctaArrow,
.secondaryCTA:hover .ctaArrow{
transform:translateX(6px);
}

.bigFeatureCard{
background:white;
padding:70px 60px;
border-radius:18px;
border:1px solid #E6E8EC;
box-shadow:0 30px 70px rgba(0,0,0,0.06);
transition:all .45s cubic-bezier(.22,1,.36,1);
cursor:pointer;
min-height:320px;
display:flex;
flex-direction:column;
justify-content:flex-start;
position:relative;
overflow:hidden;

opacity:0;
transform:translateY(50px);
animation:cardReveal .8s forwards;
}

.featureIcon{
width:52px;
height:52px;
display:flex;
align-items:center;
justify-content:center;
background:#F2F6FF;
border-radius:12px;
margin-bottom:24px;
color:#00338D;
}

.bigFeatureCard h3{
font-size:28px;
font-weight:600;
margin-bottom:18px;
letter-spacing:-0.01em;
}

.bigFeatureCard p{
font-family:'Arial', sans-serif;
font-size:17px;
color:#5B6573;
line-height:1.8;
max-width:320px;
}

.bigFeatureCard:hover{
transform:translateY(-20px) scale(1.04);
box-shadow:0 45px 100px rgba(0,51,141,0.15);
}

@keyframes cardReveal{
to{
opacity:1;
transform:translateY(0);
}
}
@keyframes float1 {
0%{transform:translateY(0)}
50%{transform:translateY(20px)}
100%{transform:translateY(0)}
}

@keyframes float2 {
0%{transform:translateY(0)}
50%{transform:translateY(-25px)}
100%{transform:translateY(0)}
}

@keyframes cardFloat {
0%{transform:translateY(0)}
50%{transform:translateY(-8px)}
100%{transform:translateY(0)}
}
`}
                </style>

            </main>


            {/* Footer */}
            <footer style={{
                background: '#fff',
                borderTop: '1px solid #E5E7EB',
                padding: '20px 48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>

                <span style={{
                    fontSize: 12,
                    fontFamily: "'Arial', sans-serif",
                    color: '#9CA3AF'
                }}>
                    © {new Date().getFullYear()} KPMG. All rights reserved.
                </span>

                <span style={{
                    fontSize: 12,
                    fontFamily: "'Arial', sans-serif",
                    color: '#9CA3AF'
                }}>
                    Confidential — For Authorized Personnel Only
                </span>

            </footer>

        </div>
    );
};

export default PersonaSelection;