import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { ChevronRight, X, Users, Eye, Target, Lock, MessageCircle, Lightbulb, ShieldCheck, CheckCircle, ArrowRight, BarChart2, Database, Cpu, FileText, LayoutDashboard } from 'lucide-react';
import kpmgLogo from '../../assets/kpmg-logo.svg';
import heroImg from '../../assets/Leader4.jpg';
import esgBanner from '../../assets/Leader2.jpg';
import leader10 from '../../assets/Leader 10.jpg';
import leader11 from '../../assets/Leader 11.jpg';
import leader12 from '../../assets/Leader 12.jpg';
import leader13 from '../../assets/Leader 13.jpg';
import leader14 from '../../assets/Leader 14.avif';
import leader15 from '../../assets/Leader 15.jpg';
import leader5 from '../../assets/Leader 5.jpg';
import leader7 from '../../assets/Leader 7.JPG';
import leader8 from '../../assets/Leader 8.jpg';
import leader9 from '../../assets/Leader 9.jpg';
import peopleImg from '../../assets/people.jpeg';

// normSC helper
const normSC = (n) => {
    const map = {
        'call someone to account': 'Call Someone to Account',
        'role modelling': 'Role Modelling',
        'discussability': 'Discussability',
        'open_to_discussion': 'Discussability',
        'open to discussion': 'Discussability',
        'openness to discussion': 'Discussability',
        'achievability': 'Achievability',
        'enforcement': 'Enforcement',
        'clarity': 'Clarity',
        'transparency': 'Transparency',
        'commitment': 'Commitment',
    };
    return map[(n || '').toLowerCase().trim()] || n;
};

// SC_META (fallback dims as objects)
const SC_META = {
    'Role Modelling': {
        img: leader13, icon: Users, color: '#2563eb', bg: '#eff6ff',
        tagline: 'Leaders set the tone',
        definition: "The extent to which leadership exemplifies the organisation's core values, ethics, and expected behaviours in their day-to-day actions.",
        why: 'When leaders visibly model the behaviours they expect, it creates a powerful signal that shapes how risk is perceived and managed across all levels.',
        dims: [
            { name: 'Tone from the Top', desc: 'Senior leaders visibly demonstrate the values and risk behaviours they expect from others.' },
            { name: 'Consistency of Behaviour', desc: 'Leaders act in accordance with stated values even under pressure or when it is inconvenient.' },
            { name: 'Ethical Decision-Making', desc: 'Leaders make decisions that reflect ethical standards, not just commercial or operational priorities.' },
        ],
    },
    'Discussability': {
        img: leader15, icon: MessageCircle, color: '#7c3aed', bg: '#f5f3ff',
        tagline: 'Open dialogue drives safety',
        definition: 'The degree to which employees feel comfortable raising concerns, challenging decisions, and discussing risk-related issues openly without fear of repercussion.',
        why: 'Psychological safety is a prerequisite for effective risk management. When people can speak up, problems surface early and are resolved before they escalate.',
        dims: [
            { name: 'Psychological Safety', desc: 'Employees feel safe to speak up, ask questions, and raise concerns without fear of negative consequences.' },
            { name: 'Openness to Challenge', desc: 'Leaders and peers welcome constructive challenge and alternative viewpoints on risk decisions.' },
            { name: 'Escalation Comfort', desc: 'Employees feel confident escalating issues through formal and informal channels.' },
        ],
    },
    'Achievability': {
        img: leader8, icon: Target, color: '#d97706', bg: '#fffbeb',
        tagline: 'Realistic goals reduce risk',
        definition: 'Ensuring that assigned tasks, targets, and objectives are realistic, attainable, and properly resourced without creating pressure that compromises risk standards.',
        why: 'Unrealistic targets create incentives to cut corners. When goals are achievable, employees can maintain risk standards without feeling forced to choose between performance and compliance.',
        dims: [
            { name: 'Target Realism', desc: 'Performance targets are set at levels that can be achieved without compromising risk or ethical standards.' },
            { name: 'Resource Adequacy', desc: 'Employees have the time, tools, and support needed to meet expectations without cutting corners.' },
            { name: 'Pressure Management', desc: 'The organisation recognises and manages situations where performance pressure may conflict with risk standards.' },
        ],
    },
    'Enforcement': {
        img: leader15, icon: Lock, color: '#dc2626', bg: '#fff1f2',
        tagline: 'Consistent consequences matter',
        definition: 'The consistent and fair application of rules, policies, and consequences across all levels of the organisation regardless of seniority or performance.',
        why: 'Selective enforcement erodes trust and signals that rules are negotiable. Consistent enforcement reinforces that risk standards apply to everyone equally.',
        dims: [
            { name: 'Policy Consistency', desc: 'Rules and policies are applied uniformly across all functions, levels, and geographies.' },
            { name: 'Consequence Fairness', desc: 'Consequences for breaches are proportionate, transparent, and applied without favouritism.' },
            { name: 'Cross-Level Application', desc: 'Senior leaders are held to the same standards as frontline employees no exceptions for seniority.' },
        ],
    },
    'Clarity': {
        img: leader13, icon: Lightbulb, color: '#059669', bg: '#f0fdf4',
        tagline: 'Clear expectations enable action',
        definition: 'The degree to which employees have a clear understanding of their roles, responsibilities, risk expectations, and how their work connects to organisational goals.',
        why: 'Ambiguity breeds risk. When people understand what is expected of them and why, they can make better decisions and take appropriate ownership of risk.',
        dims: [
            { name: 'Role Clarity', desc: 'Employees clearly understand their responsibilities and the boundaries of their authority.' },
            { name: 'Risk Expectation Clarity', desc: 'Risk standards, thresholds, and acceptable behaviours are clearly communicated and understood.' },
            { name: "Strategic Alignment", desc: "Employees understand how their work connects to the organisation's broader risk and strategic objectives." },
        ],
    },
    'Transparency': {
        img: leader8, icon: Eye, color: '#0891b2', bg: '#ecfeff',
        tagline: 'Openness builds trust',
        definition: 'The degree to which management is open and clear about decisions, actions, performance, and outcomes including sharing both successes and failures.',
        why: 'Transparency builds the trust necessary for effective risk culture. When information flows freely, employees can make informed decisions and hold each other accountable.',
        dims: [
            { name: 'Information Sharing', desc: 'Relevant risk information is shared openly and in a timely manner across the organisation.' },
            { name: 'Decision Transparency', desc: 'The rationale behind key decisions including risk trade-offs is communicated clearly.' },
            { name: 'Performance Openness', desc: 'Both successes and failures are shared honestly, creating a learning culture rather than a blame culture.' },
        ],
    },
    'Commitment': {
        img: leader13, icon: CheckCircle, color: '#16a34a', bg: '#f0fdf4',
        tagline: 'Dedication drives culture',
        definition: 'The dedication from both employees and leadership towards organisational goals, risk standards, and cultural expectations even when it is inconvenient.',
        why: 'Commitment is what transforms intent into action. When people are genuinely committed to risk culture, they maintain standards under pressure and in ambiguous situations.',
        dims: [
            { name: 'Leadership Dedication', desc: 'Senior leaders actively champion risk culture and invest time and resources in its development.' },
            { name: 'Employee Ownership', desc: 'Employees take personal responsibility for risk culture, not just compliance with rules.' },
            { name: 'Standards Under Pressure', desc: 'Risk and ethical standards are maintained even when facing commercial, operational, or time pressures.' },
        ],
    },
    'Call Someone to Account': {
        img: leader15, icon: ShieldCheck, color: '#9333ea', bg: '#faf5ff',
        tagline: 'Accountability closes the loop',
        definition: 'The willingness and ability to hold individuals including senior leaders accountable for their actions, decisions, and their impact on risk culture.',
        why: 'Without accountability, risk culture remains aspirational. When people know that actions have consequences, they are more likely to act in accordance with stated values.',
        dims: [
            { name: 'Upward Accountability', desc: 'Employees and peers feel empowered to hold senior leaders accountable for their behaviours and decisions.' },
            { name: 'Peer Accountability', desc: 'Colleagues hold each other to risk and ethical standards in a constructive, non-punitive way.' },
            { name: 'Consequence Follow-Through', desc: 'When accountability is required, consequences are actually applied not just discussed or deferred.' },
        ],
    },
};

// TIMELINE_STEPS
const TIMELINE_STEPS = [
    {
        num: 1, label: 'Survey Conducted',
        tagline: 'Voices captured across all levels',
        icon: Users,
        desc: 'Leadership interviews and structured employee surveys were completed across all functions and levels of the organisation, capturing both qualitative and quantitative perspectives on risk culture.',
        keyFindings: [
            'Leadership interviews conducted across all seniority levels',
            'Employee surveys distributed organisation-wide',
            'Both qualitative and quantitative data captured',
        ],
    },
    {
        num: 2, label: 'Policies Ingested',
        tagline: 'Policies mapped to soft controls',
        icon: FileText,
        desc: 'Relevant organisational policies, frameworks, and governance documents were ingested and mapped to the 8 soft control dimensions to establish a baseline of stated intent.',
        keyFindings: [
            'Risk policies and governance frameworks reviewed',
            'Stated intent mapped to 8 soft control dimensions',
            'Baseline of formal expectations established',
        ],
    },
    {
        num: 3, label: 'Data Analysed',
        tagline: 'KPMG framework applied',
        icon: Database,
        desc: "Survey responses and policy content were scored across 8 soft control dimensions using KPMG's proprietary risk culture framework, identifying patterns and gaps.",
        keyFindings: [
            "Responses scored using KPMG's proprietary framework",
            'Statistical patterns identified across functions',
            'Outliers and anomalies flagged for review',
        ],
    },
    {
        num: 4, label: 'Insights Generated',
        tagline: 'Patterns and gaps identified',
        icon: Cpu,
        desc: 'AI-assisted analysis surfaced key themes, strengths, and areas of concern across functions, seniority levels, and soft controls highlighting where intent diverges from practice.',
        keyFindings: [
            'Key themes surfaced across soft controls',
            'Function-level and seniority-level breakdowns generated',
            'Intent vs. practice gaps quantified',
        ],
    },
    {
        num: 5, label: 'Dashboard & Report',
        tagline: 'Ready for strategic review',
        icon: LayoutDashboard,
        desc: 'Tailored insights are now available in your interactive dashboard and a comprehensive report, ready for strategic review, action planning, and stakeholder communication.',
        keyFindings: [
            'Interactive dashboard built for leadership review',
            'Comprehensive PDF report generated',
            'Recommendations prioritised by impact and urgency',
        ],
    },
];

// useDimensions hook
const useDimensions = () => {
    const [dimMap, setDimMap] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/data/soft_control_data1.xlsx');
                if (!res.ok) throw new Error('Excel not found');
                const buf = await res.arrayBuffer();
                const wb = XLSX.read(buf, { type: 'array' });

                const questionByDim = {};
                if (wb.SheetNames.includes('FinalQuestions')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['FinalQuestions']).forEach((row) => {
                        const dim = String(row.Dimensions || '').trim();
                        const qt = String(row.QuestionText || '').trim();
                        if (dim && qt && !questionByDim[dim]) {
                            questionByDim[dim] = qt;
                        }
                    });
                }

                const result = {};
                if (wb.SheetNames.includes('Dimension Sheet')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['Dimension Sheet']).forEach((row) => {
                        const sc = normSC(String(row.SoftControl || row['Soft Control'] || '').trim());
                        const dim = String(row.Dimension || '').trim();
                        if (!sc || !dim) return;
                        if (!result[sc]) result[sc] = [];
                        if (!result[sc].find((d) => d.name === dim)) {
                            result[sc].push({
                                name: dim,
                                desc: questionByDim[dim] || SC_META[sc]?.dims?.find((d) => d.name === dim)?.desc || '',
                            });
                        }
                    });
                }

                if (Object.keys(result).length === 0 && wb.SheetNames.includes('FinalQuestions')) {
                    XLSX.utils.sheet_to_json(wb.Sheets['FinalQuestions']).forEach((row) => {
                        const sc = normSC(String(row.SoftControl || '').trim());
                        const dim = String(row.Dimensions || '').trim();
                        const qt = String(row.QuestionText || '').trim();
                        if (!sc || !dim) return;
                        if (!result[sc]) result[sc] = [];
                        if (!result[sc].find((d) => d.name === dim)) {
                            result[sc].push({ name: dim, desc: qt });
                        }
                    });
                }

                const merged = {};
                Object.keys(SC_META).forEach((sc) => {
                    merged[sc] = (result[sc] && result[sc].length > 0) ? result[sc] : SC_META[sc].dims;
                });
                setDimMap(merged);
            } catch (err) {
                console.warn('useDimensions: falling back to SC_META dims', err);
                const fallback = {};
                Object.keys(SC_META).forEach((sc) => { fallback[sc] = SC_META[sc].dims; });
                setDimMap(fallback);
            }
        };
        load();
    }, []);

    if (!dimMap) {
        const fallback = {};
        Object.keys(SC_META).forEach((sc) => { fallback[sc] = SC_META[sc].dims; });
        return fallback;
    }
    return dimMap;
};

// SCCard - simplified clickable summary card
const SCCard = ({ name, index, isExpanded, onExpand }) => {
    const meta = SC_META[name] || { icon: ShieldCheck, color: '#6366f1', bg: '#f5f3ff', tagline: '', img: null };
    const Icon = meta.icon;
    const [vis, setVis] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVis(true); },
            { threshold: 0.08 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            onClick={() => onExpand(name)}
            style={{
                background: isExpanded ? '#f8faff' : '#fff',
                border: '1px solid #ebebeb',
                borderLeft: isExpanded ? `4px solid ${meta.color}` : '1px solid #ebebeb',
                borderRadius: 16,
                padding: '24px 20px',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                opacity: vis ? 1 : 0,
                transform: vis ? 'translateY(0) scale(1)' : 'translateY(18px) scale(0.97)',
                transition: `opacity .45s ease ${index * 0.07}s, transform .45s ease ${index * 0.07}s, box-shadow .18s, border-color .18s, background .18s`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = meta.color + '55';
                e.currentTarget.style.boxShadow = `0 10px 32px ${meta.color}20`;
                e.currentTarget.style.transform = 'translateY(-4px) scale(1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ebebeb';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
        >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${meta.color}, ${meta.color}99)`, borderRadius: '16px 16px 0 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${meta.color}30`, flexShrink: 0, boxShadow: `0 4px 14px ${meta.color}20` }}>
                    {meta.img
                        ? <img src={meta.img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={28} color={meta.color} /></div>
                    }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: '0 0 4px', lineHeight: 1.25, letterSpacing: '-0.01em' }}>{name}</h3>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, fontStyle: 'italic' }}>{meta.tagline}</p>
                </div>
                <ChevronRight 
                    size={20} 
                    color={meta.color} 
                    style={{ 
                        flexShrink: 0, 
                        transition: 'transform .2s',
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                    }} 
                />
            </div>
        </div>
    );
};

// SCDrillDown - inline drill-down panel
const SCDrillDown = ({ name, liveDims, expandedDim, setExpandedDim, onClose }) => {
    const meta = SC_META[name] || {};
    const Icon = meta.icon || ShieldCheck;
    const dims = liveDims || meta.dims || [];

    if (expandedDim) {
        const dim = dims.find(d => d.name === expandedDim);
        if (!dim) return null;

        return (
            <div style={{ 
                background: '#fff', 
                border: '1px solid #ebebeb', 
                borderRadius: 16, 
                padding: '28px 32px', 
                marginTop: 20,
                animation: 'drillDown .3s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <button
                        onClick={() => setExpandedDim(null)}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 8, 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            fontSize: 13, 
                            fontWeight: 600, 
                            color: meta.color,
                            padding: 0
                        }}
                    >
                        <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
                        Back to {name}
                    </button>
                    <button
                        onClick={onClose}
                        style={{ 
                            width: 30, 
                            height: 30, 
                            borderRadius: 8, 
                            border: '1px solid #e5e7eb', 
                            background: '#fff', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            cursor: 'pointer', 
                            color: '#6b7280' 
                        }}
                    >
                        <X size={14} />
                    </button>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <span style={{ 
                        fontSize: 12, 
                        fontWeight: 700, 
                        color: meta.color, 
                        background: meta.bg, 
                        borderRadius: 20, 
                        padding: '4px 14px', 
                        border: `1px solid ${meta.color}30` 
                    }}>
                        {name}
                    </span>
                </div>

                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
                    DIMENSION: {dim.name}
                </h3>

                <div style={{ background: `${meta.color}08`, borderRadius: 12, padding: '16px 18px', marginBottom: 16, borderLeft: `3px solid ${meta.color}` }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 8px' }}>
                        What this measures
                    </p>
                    <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>
                        {dim.desc || `This dimension captures specific behavioural patterns related to ${dim.name} within the context of ${name}.`}
                    </p>
                </div>

                <div style={{ background: '#f8f9fa', borderRadius: 12, padding: '16px 18px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 8px' }}>
                        Why this dimension matters
                    </p>
                    <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, margin: 0 }}>
                        This dimension is one of several used to assess <strong>{name}</strong> within the KPMG Risk Culture framework. Each dimension targets a specific, measurable aspect of the broader soft control, enabling precise identification of strengths and improvement areas.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            background: '#fff', 
            border: '1px solid #ebebeb', 
            borderRadius: 16, 
            padding: '28px 32px', 
            marginTop: 20,
            animation: 'drillDown .3s ease',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 50, height: 50, borderRadius: 12, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={24} color={meta.color} />
                    </div>
                    <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 4px' }}>Soft Control</p>
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>{name}</h3>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    style={{ 
                        width: 30, 
                        height: 30, 
                        borderRadius: 8, 
                        border: '1px solid #e5e7eb', 
                        background: '#fff', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer', 
                        color: '#6b7280',
                        flexShrink: 0
                    }}
                >
                    <X size={14} />
                </button>
            </div>

            <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 8px' }}>What it means</p>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>{meta.definition}</p>
            </div>

            <div style={{ background: `${meta.color}08`, borderRadius: 12, padding: '14px 16px', marginBottom: 20, borderLeft: `3px solid ${meta.color}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 6px' }}>Why it matters</p>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, margin: 0 }}>{meta.why}</p>
            </div>

            <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 12px' }}>
                    Dimensions (click any to explore)
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                    {dims.map((d, i) => (
                        <div
                            key={i}
                            className="dim-card"
                            onClick={() => setExpandedDim(d.name)}
                            style={{
                                background: '#fff',
                                border: '1px solid #ebebeb',
                                borderRadius: 10,
                                padding: '14px 16px',
                                transition: 'border-color .18s, box-shadow .18s, transform .18s',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = meta.color;
                                e.currentTarget.style.boxShadow = `0 6px 18px ${meta.color}15`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#ebebeb';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>{d.name}</p>
                            <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.55 }}>{d.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- AlternatingTimeline -----------------------------------------------------
const TOOL_STEPS = [
    {
        num: '01', side: 'left',
        label: 'Leadership Interviews',
        icon: Users,
        color: '#2563eb', bg: '#eff6ff',
                desc: 'In-depth structured interviews are conducted with senior leaders across the organisation. These conversations capture leadership intent, tone from the top, and how risk culture is communicated and reinforced at the executive level.',
        features: ['Structured interview protocol aligned to 8 soft controls', 'Captures leadership intent vs. observed behaviour', 'Identifies tone-from-the-top signals'],
    },
    {
        num: '02', side: 'right',
        label: 'Employee Surveys',
        icon: MessageCircle,
        color: '#7c3aed', bg: '#f5f3ff',
        img: leader8,
        desc: 'Anonymous surveys are distributed across all functions and seniority levels. Employees share their lived experience of risk culture � how it feels on the ground, not just how it looks on paper.',
        features: ['Anonymous to encourage honest responses', 'Covers all 8 soft control dimensions', 'Quantitative scoring + qualitative insights'],
    },
    {
        num: '03', side: 'left',
        label: 'Policy Ingestion',
        icon: FileText,
        color: '#059669', bg: '#f0fdf4',
        img: leader9,
        desc: 'Relevant governance documents, risk policies, and frameworks are ingested and mapped to the 8 soft control dimensions. This establishes a baseline of stated intent � what the organisation says it does.',
        features: ['Automated policy-to-dimension mapping', 'Identifies gaps between policy and practice', 'Baseline of formal risk expectations established'],
    },
    {
        num: '04', side: 'right',
        label: 'KPMG Framework Scoring',
        icon: Database,
        color: '#d97706', bg: '#fffbeb',
        img: leader5,
        desc: 'All data � interview transcripts, survey responses, and policy content � is scored using KPMG\'s proprietary risk culture framework. Each response is mapped to a soft control and dimension, producing a quantitative risk culture score.',
        features: ['Proprietary KPMG scoring methodology', 'Scores across 8 controls � multiple dimensions', 'Identifies statistical patterns and outliers'],
    },
    {
        num: '05', side: 'left',
        label: 'AI-Powered Analysis',
        icon: Cpu,
        color: '#dc2626', bg: '#fff1f2',
        img: leader7,
        desc: 'Advanced AI analysis surfaces key themes, intent-practice gaps, and areas of concern that manual review would miss. The system identifies where leadership intent diverges from employee experience across functions and seniority levels.',
        features: ['Natural language processing of interview transcripts', 'Cross-function and cross-level gap analysis', 'Intent vs. practice divergence quantified'],
    },
    {
        num: '06', side: 'right',
        label: 'Interactive Dashboard',
        icon: LayoutDashboard,
        color: '#0891b2', bg: '#ecfeff',
        img: leader15,
        desc: 'Your personalised leadership dashboard presents all insights in an interactive, navigable format. Drill into any soft control, explore function-level breakdowns, compare leadership and employee perspectives, and track culture over time.',
        features: ['Real-time interactive data exploration', 'Function-level and seniority-level breakdowns', 'Leadership vs. employee alignment view'],
    },
    {
        num: '07', side: 'left',
        label: 'Recommendations & Report',
        icon: ArrowRight,
        color: '#9333ea', bg: '#faf5ff',
        img: leader10,
        desc: 'Prioritised, actionable recommendations are generated for each soft control area. A comprehensive PDF report is produced for board-level communication, regulatory submissions, and strategic planning.',
        features: ['Prioritised by impact and urgency', 'Mapped to specific soft controls and dimensions', 'Board-ready PDF report with executive summary'],
    },
];

const TimelineItem = ({ step, index }) => {
    const [vis, setVis] = useState(false);
    const ref = useRef(null);
    const isLeft = step.side === 'left';
    const Icon = step.icon;

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVis(true); },
            { threshold: 0.12 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 60px 1fr',
                gap: 0,
                marginBottom: 48,
                opacity: vis ? 1 : 0,
                transform: vis ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity .7s ease ${index * 0.1}s, transform .7s ease ${index * 0.1}s`,
            }}
        >
            {/* Left content */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 32, paddingTop: 4 }}>
                {isLeft ? (
                    <div
                        className="tl-card"
                        style={{
                            background: '#fff', border: '1px solid #ebebeb', borderRadius: 16,
                            padding: '24px 26px', maxWidth: 420, width: '100%',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                            transition: 'box-shadow .25s, transform .25s',
                            borderLeft: `4px solid ${step.color}`,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 10px 32px ${step.color}20`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: step.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon size={20} color={step.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: 10, fontWeight: 700, color: step.color, textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 2px' }}>Step {step.num}</p>
                                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>{step.label}</h3>
                            </div>
                        </div>
                        <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.75, margin: '0 0 14px' }}>{step.desc}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {step.features.map((f, fi) => (
                                <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: step.color, flexShrink: 0, marginTop: 6 }} />
                                    <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.55 }}>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* icon circle on left when card is on right */
                    <div style={{ width: 120, height: 120, borderRadius: '50%', background: step.bg, border: `3px solid ${step.color}30`, boxShadow: `0 6px 20px ${step.color}20`, alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={48} color={step.color} strokeWidth={1.5} />
                    </div>
                )}
            </div>

            {/* Center dot + line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 0 6px ${step.color}18, 0 4px 12px ${step.color}40`,
                    zIndex: 1, position: 'relative',
                }}>
                    <span style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>{step.num}</span>
                </div>
            </div>

            {/* Right content */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: 32, paddingTop: 4 }}>
                {!isLeft ? (
                    <div
                        className="tl-card"
                        style={{
                            background: '#fff', border: '1px solid #ebebeb', borderRadius: 16,
                            padding: '24px 26px', maxWidth: 420, width: '100%',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                            transition: 'box-shadow .25s, transform .25s',
                            borderRight: `4px solid ${step.color}`,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 10px 32px ${step.color}20`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: step.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon size={20} color={step.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: 10, fontWeight: 700, color: step.color, textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 2px' }}>Step {step.num}</p>
                                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>{step.label}</h3>
                            </div>
                        </div>
                        <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.75, margin: '0 0 14px' }}>{step.desc}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {step.features.map((f, fi) => (
                                <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: step.color, flexShrink: 0, marginTop: 6 }} />
                                    <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.55 }}>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* icon circle on right when card is on left */
                    <div style={{ width: 120, height: 120, borderRadius: '50%', background: step.bg, border: `3px solid ${step.color}30`, boxShadow: `0 6px 20px ${step.color}20`, alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={48} color={step.color} strokeWidth={1.5} />
                    </div>
                )}
            </div>
        </div>
    );
};

const AlternatingTimeline = () => {
    const [ballPct, setBallPct] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const getScrollParent = (el) => {
            if (!el || el === document.body) return window;
            const { overflow, overflowY } = getComputedStyle(el);
            if (/(auto|scroll)/.test(overflow + overflowY)) return el;
            return getScrollParent(el.parentElement);
        };

        let scrollParent = null;

        const onScroll = () => {
            if (!containerRef.current) return;
            if (!scrollParent) scrollParent = getScrollParent(containerRef.current);

            const rect = containerRef.current.getBoundingClientRect();
            const parentEl = scrollParent === window ? null : scrollParent;
            const viewportTop = parentEl ? parentEl.getBoundingClientRect().top : 0;
            const viewportH = parentEl ? parentEl.clientHeight : window.innerHeight;

            const containerTop = rect.top - viewportTop;
            const containerH = rect.height;

            // 0 when container enters viewport bottom, 1 when container exits viewport top
            const raw = (viewportH - containerTop) / (containerH + viewportH);
            const pct = Math.min(100, Math.max(0, raw * 100));
            setBallPct(pct);
        };

        // Delay to ensure DOM is ready
        const timer = setTimeout(() => {
            scrollParent = getScrollParent(containerRef.current);
            const target = scrollParent === window ? window : scrollParent;
            target.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }, 200);

        return () => {
            clearTimeout(timer);
            if (scrollParent && scrollParent !== window) {
                scrollParent.removeEventListener('scroll', onScroll);
            } else {
                window.removeEventListener('scroll', onScroll);
            }
        };
    }, []);

    return (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '40px 32px 48px' }}>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
               
                <h2 style={{ fontSize: 26, fontWeight: 800, color: '#111827', margin: '0 0 12px', letterSpacing: '-0.025em' }}>Your Assessment Journey</h2>
                <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                    Here is how the KPMG Risk Culture platform works, step by step.
                </p>
            </div>

            <div ref={containerRef} style={{ position: 'relative' }}>
                {/* Growing vertical line */}
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: '#f3f4f6', transform: 'translateX(-50%)', zIndex: 0 }} />
                <div style={{
                    position: 'absolute', left: '50%', top: 0, width: 2,
                    height: `${ballPct}%`,
                    background: 'linear-gradient(180deg, #2563eb 0%, #7c3aed 50%, #059669 100%)',
                    transform: 'translateX(-50%)', zIndex: 1,
                    transition: 'height .08s linear',
                }} />
                {/* Ball tracker */}
                <div style={{
                    position: 'absolute', left: '50%',
                    top: `${Math.min(ballPct, 99)}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 3, transition: 'top .08s linear',
                    pointerEvents: 'none',
                }}>
                    <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: ballPct < 40 ? '#2563eb' : ballPct < 70 ? '#7c3aed' : '#059669',
                        boxShadow: `0 0 0 5px ${ballPct < 40 ? 'rgba(37,99,235,0.22)' : ballPct < 70 ? 'rgba(124,58,237,0.22)' : 'rgba(5,150,105,0.22)'}, 0 0 18px ${ballPct < 40 ? 'rgba(37,99,235,0.55)' : ballPct < 70 ? 'rgba(124,58,237,0.55)' : 'rgba(5,150,105,0.55)'}`,
                        transition: 'background .3s ease, box-shadow .3s ease',
                        animation: 'ballPulse 1.8s ease-in-out infinite',
                    }} />
                </div>

                {/* Timeline items */}
                {TOOL_STEPS.map((step, i) => (
                    <TimelineItem key={i} step={step} index={i} />
                ))}
            </div>
        </div>
    );
};

// WelcomeSection main component
const WelcomeSection = ({ pillarsData = [], dimensionData = {}, onNavigateToOverview }) => {
    const [expandedSC, setExpandedSC] = useState(null);
    const [expandedDim, setExpandedDim] = useState(null);
    const [heroVis, setHeroVis] = useState(false);

    const [kpmgVis, setKpmgVis] = useState(false);
    const [riskCultureVis, setRiskCultureVis] = useState(false);
    const [whyVis, setWhyVis] = useState(false);
    const [scHeaderVis, setScHeaderVis] = useState(false);
    const [ctaVis, setCtaVis] = useState(false);

    const kpmgRef = useRef(null);
    const riskCultureRef = useRef(null);
    const whyRef = useRef(null);
    const scHeaderRef = useRef(null);
    const ctaRef = useRef(null);

    const liveDimMap = useDimensions();

    void dimensionData;
    void pillarsData;

    const scList = Object.keys(SC_META);

    useEffect(() => { setTimeout(() => setHeroVis(true), 80); }, []);

    useEffect(() => {
        const makeObs = (setter) =>
            new IntersectionObserver(([e]) => { if (e.isIntersecting) setter(true); }, { threshold: 0.1 });

        const pairs = [
            [kpmgRef, setKpmgVis],
            [riskCultureRef, setRiskCultureVis],
            [whyRef, setWhyVis],
            [scHeaderRef, setScHeaderVis],
            [ctaRef, setCtaVis],
        ];
        const observers = pairs.map(([ref, setter]) => {
            const obs = makeObs(setter);
            if (ref.current) obs.observe(ref.current);
            return obs;
        });
        return () => observers.forEach((o) => o.disconnect());
    }, []);

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32, fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", background: '#f8f9fa', padding: '0 0 40px' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                @keyframes slideInLeft { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
                @keyframes slideInRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
                @keyframes popIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
                @keyframes scIn{from{opacity:0;transform:scale(.94) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
                @keyframes drillDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
                @keyframes ballPulse { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.3)} }
                .why-card { transition: box-shadow .25s, transform .25s; }
                .why-card:hover { box-shadow: 0 12px 36px rgba(37,99,235,0.12) !important; transform: translateY(-6px) !important; }
                .why-card:hover .why-img { transform: scale(1.08) !important; }
                .why-img { transition: transform .4s ease; }
                @keyframes shimmerSlide { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
                .tag-pill { transition: background .15s, color .15s; cursor: default; }
                .tag-pill:hover { background: #2563eb !important; color: #fff !important; }
                .dim-card { transition: border-color .18s, box-shadow .18s, transform .18s; cursor: pointer; }
                .dim-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.08) !important; }
                * { font-family:'Inter','Segoe UI',system-ui,sans-serif !important; }
            `}</style>

            {/* 1. HERO BANNER */}
            <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', minHeight: 300, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
                <img src={heroImg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(10,20,60,0.88) 0%, rgba(15,40,100,0.65) 55%, rgba(10,20,60,0.15) 100%)' }} />

                <div style={{ position: 'relative', zIndex: 1, padding: '52px 56px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 300, justifyContent: 'center', maxWidth: '60%' }}>
                    <p style={{
                        fontSize: 10, fontWeight: 700, color: 'rgba(167,139,250,.9)',
                        textTransform: 'uppercase', letterSpacing: '.16em', margin: 0,
                        opacity: heroVis ? 1 : 0, transform: heroVis ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all .5s ease 0s',
                    }}>
                        KPMG Risk Culture � Q1 2026
                    </p>
                    <h1 style={{
                        fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, color: '#fff',
                        margin: 0, lineHeight: 1.1, letterSpacing: '-0.03em',
                        opacity: heroVis ? 1 : 0, transform: heroVis ? 'translateY(0)' : 'translateY(14px)',
                        transition: 'all .6s ease .15s',
                    }}>
                        Welcome, Leader
                    </h1>
                    <p style={{
                        fontSize: 15, color: 'rgba(255,255,255,0.75)', margin: 0,
                        maxWidth: 520, lineHeight: 1.75,
                        opacity: heroVis ? 1 : 0, transform: heroVis ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all .6s ease .28s',
                    }}>
                        Your personalised Risk Culture Dashboard built from leadership interviews and employee surveys.
                    </p>
                </div>
            </div>

            {/* 2. MESSAGE FROM KPMG */}
            <div
                ref={kpmgRef}
                style={{
                    background: '#fff', border: '1px solid #ebebeb', borderRadius: 16,
                    padding: '28px 32px', borderLeft: '4px solid #2563eb',
                    opacity: kpmgVis ? 1 : 0, transform: kpmgVis ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity .55s ease, transform .55s ease',
                }}
            >                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, border: '1px solid #dbeafe' }}>
                        <img src={kpmgLogo} alt="KPMG" style={{ height: 26, objectFit: 'contain' }} />
                    </div>
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 10px' }}>A Message from KPMG</p>
                        <p style={{ fontSize: 14.5, color: '#374151', lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
                            Thank you for your participation in the leadership interview and for enabling this assessment of organisational risk culture. Your perspective plays a key role in understanding how strategic intent translates into everyday decisions across the organisation.
                        </p>
                        <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.75, margin: '14px 0 0' }}>
                            This assessment uses a soft controls framework to understand the behavioural drivers that influence decision-making, escalation, accountability, and risk-taking. By examining attitudes, observed behaviours, and real-world scenarios, the framework helps identify where strong intent does not consistently translate into practice.
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. WHAT IS RISK CULTURE */}
            <div ref={riskCultureRef}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 6px' }}>Framework</p>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 20px', letterSpacing: '-0.025em' }}>What is Risk Culture?</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Left card */}
                <div style={{
                  background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '32px 36px',
                  display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden',
                  opacity: riskCultureVis ? 1 : 0, transform: riskCultureVis ? 'translateX(0)' : 'translateX(-24px)',
                  transition: 'opacity .6s ease, transform .6s ease',
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 22 }}>🏛️</span>
                  </div>
                  <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
                    Risk culture is the shared values, beliefs, and understanding about risk that shape how people behave — especially when no one is watching. It is the "tone from the top" made real through everyday decisions.
                  </p>
                  <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.75, margin: 0 }}>
                    A strong risk culture means employees feel empowered to raise concerns, see consistent role modelling from leadership, and understand what risks are acceptable.
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['Shared Values', 'Behavioural Norms', 'Leadership Tone', 'Everyday Decisions'].map((tag, i) => (
                      <span key={i} className="tag-pill" style={{ fontSize: 11, fontWeight: 600, color: '#2563eb', background: '#eff6ff', borderRadius: 20, padding: '5px 13px', border: '1px solid #dbeafe' }}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Right: image + 3 stat boxes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{
                    flex: 1, borderRadius: 16, overflow: 'hidden', position: 'relative', minHeight: 180,
                    opacity: riskCultureVis ? 1 : 0, transform: riskCultureVis ? 'translateX(0)' : 'translateX(24px)',
                    transition: 'opacity .6s ease .1s, transform .6s ease .1s',
                  }}>
                    <img src={esgBanner} alt="Risk Culture" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(10,20,60,0.55) 100%)' }} />
                    <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                        "Culture eats strategy for breakfast." — Peter Drucker
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                    {[
                      { num: '8', label: 'Soft Controls', color: '#2563eb', bg: '#eff6ff' },
                      { num: '360°', label: 'Culture View', color: '#7c3aed', bg: '#f5f3ff' },
                      { num: '3+', label: 'Dimensions each', color: '#059669', bg: '#f0fdf4' },
                    ].map((s, i) => (
                      <div key={i} style={{
                        background: s.bg, borderRadius: 12, padding: '14px 12px', textAlign: 'center',
                        border: `1px solid ${s.color}20`, cursor: 'default',
                        opacity: riskCultureVis ? 1 : 0, transform: riskCultureVis ? 'translateY(0)' : 'translateY(12px)',
                        transition: `opacity .5s ease ${i * 0.1 + 0.4}s, transform .5s ease ${i * 0.1 + 0.4}s`,
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <p style={{ fontSize: 22, fontWeight: 900, color: s.color, margin: '0 0 3px', letterSpacing: '-0.03em' }}>{s.num}</p>
                        <p style={{ fontSize: 11, color: s.color, fontWeight: 600, margin: 0, opacity: 0.8 }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. WHY IS IT IMPORTANT */}
            <div ref={whyRef}>x
                <div style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 6px' }}>Significance</p>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.025em' }}>Why is it Important?</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                    {[
                        { img: leader5, icon: '🛡️', accent: '#2563eb', title: 'Prevents Costly Failures', desc: 'Organisations with weak risk cultures are significantly more likely to experience major risk events. A strong culture surfaces issues before they become crises.' },
                        { img: heroImg, icon: '📈', accent: '#059669', title: 'Drives Sustainable Performance', desc: 'Risk culture is about taking the right risks at the right time. Strong cultures enable confident, informed decision-making that drives long-term value.' },
                        { img: peopleImg, icon: '🤝', accent: '#7c3aed', title: 'Builds Stakeholder Trust', desc: 'Regulators, investors, and customers increasingly scrutinise how organisations manage risk behaviourally. A demonstrable risk culture is a competitive asset.' },
                    ].map((card, i) => (
                        <div key={i} className="why-card" style={{
                            background: '#fff', border: '1px solid #ebebeb', borderRadius: 16,
                            overflow: 'hidden', position: 'relative',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            opacity: whyVis ? 1 : 0,
                            transform: whyVis ? 'translateY(0)' : 'translateY(24px)',
                            transition: `opacity .55s ease ${i * 0.13}s, transform .55s ease ${i * 0.13}s`,
                        }}>
                            <div style={{ height: 4, background: `linear-gradient(90deg, ${card.accent}, ${card.accent}88)` }} />
                            <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
                                <img className="why-img" src={card.img} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 40%, ${card.accent}22 100%)` }} />
                                <div style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                                    {card.icon}
                                </div>
                            </div>
                            <div style={{ padding: '20px 22px 24px' }}>
                                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: '0 0 10px', letterSpacing: '-0.01em' }}>{card.title}</h3>
                                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.75, margin: 0 }}>{card.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. THE 8 SOFT CONTROLS � above timeline */}
            <div>
                <div
                    ref={scHeaderRef}
                    style={{
                        marginBottom: 20,
                        opacity: scHeaderVis ? 1 : 0, transform: scHeaderVis ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'opacity .55s ease, transform .55s ease',
                    }}
                >
                   
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 6px' }}>Interactive Framework</p>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.025em' }}>The 8 Soft Controls</h2>
                    
                    <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: 12, padding: '13px 18px', borderLeft: '4px solid #2563eb' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 5px' }}>Why we break soft controls into dimensions</p>
                        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, margin: 0 }}>
                            Soft controls are complex behaviours that cannot be measured by a single question. Breaking each into dimensions lets us pinpoint exactly where an organisation is strong and where it needs to improve, enabling targeted interventions.
                        </p>
                    </div>
                </div>

                {/* Each SC as an accordion row � expands inline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {scList.map((name) => {
                        const meta = SC_META[name] || {};
                        const Icon = meta.icon || ShieldCheck;
                        const isOpen = expandedSC === name;
                        const dims = liveDimMap[name] || meta.dims || [];
                        return (
                            <div key={name} style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${isOpen ? meta.color + '40' : '#ebebeb'}`, transition: 'border-color .2s, box-shadow .2s', boxShadow: isOpen ? `0 4px 20px ${meta.color}12` : '0 1px 3px rgba(0,0,0,0.04)' }}>
                                {/* Header row */}
                                <div
                                    onClick={() => { setExpandedSC(isOpen ? null : name); setExpandedDim(null); }}
                                    style={{ background: isOpen ? `${meta.color}07` : '#fff', padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'background .18s' }}
                                    onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = '#f9fafb'; }}
                                    onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = '#fff'; }}
                                >
                                    <div style={{ width: 4, height: 44, borderRadius: 4, background: meta.color, flexShrink: 0 }} />
                                    <div style={{ width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${meta.color}30`, flexShrink: 0 }}>
                                        {meta.img ? <img src={meta.img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={20} color={meta.color} /></div>}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: '0 0 2px' }}>{name}</h3>
                                        <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, fontStyle: 'italic' }}>{meta.tagline}</p>
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: meta.color, background: meta.bg, borderRadius: 20, padding: '3px 10px', border: `1px solid ${meta.color}25`, flexShrink: 0 }}>{dims.length} dimensions</span>
                                    <ChevronRight size={17} color={meta.color} style={{ flexShrink: 0, transition: 'transform .25s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                                </div>

                                {/* Expanded content */}
                                {isOpen && (
                                    <div style={{ background: '#fff', borderTop: `1px solid ${meta.color}18`, padding: '20px 24px', animation: 'drillDown .28s ease' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                                            <div>
                                                <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 7px' }}>What it means</p>
                                                <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.7, margin: 0 }}>{meta.definition}</p>
                                            </div>
                                            <div style={{ background: `${meta.color}08`, borderRadius: 10, padding: '13px 15px', borderLeft: `3px solid ${meta.color}` }}>
                                                <p style={{ fontSize: 11, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 6px' }}>Why it matters</p>
                                                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, margin: 0 }}>{meta.why}</p>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 10px' }}>Dimensions</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 8 }}>
                                            {dims.map((d, di) => {
                                                const isDimOpen = expandedDim === d.name;
                                                return (
                                                    <div key={di}>
                                                        <div
                                                            onClick={() => setExpandedDim(isDimOpen ? null : d.name)}
                                                            style={{ background: isDimOpen ? meta.bg : '#f8f9fa', border: `1px solid ${isDimOpen ? meta.color + '50' : '#ebebeb'}`, borderRadius: isDimOpen ? '10px 10px 0 0' : 10, padding: '11px 14px', cursor: 'pointer', transition: 'all .18s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
                                                            onMouseEnter={e => { if (!isDimOpen) { e.currentTarget.style.borderColor = meta.color + '55'; e.currentTarget.style.background = meta.bg; } }}
                                                            onMouseLeave={e => { if (!isDimOpen) { e.currentTarget.style.borderColor = '#ebebeb'; e.currentTarget.style.background = '#f8f9fa'; } }}
                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
                                                                <span style={{ fontSize: 13, fontWeight: 700, color: isDimOpen ? meta.color : '#111827' }}>{d.name}</span>
                                                            </div>
                                                            <ChevronRight size={13} color={meta.color} style={{ flexShrink: 0, transition: 'transform .2s', transform: isDimOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                                                        </div>
                                                        {isDimOpen && (
                                                            <div style={{ background: '#fff', border: `1px solid ${meta.color}30`, borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '13px 15px', animation: 'drillDown .2s ease' }}>
                                                                <p style={{ fontSize: 10, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 6px' }}>What this measures</p>
                                                                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, margin: '0 0 8px' }}>{d.desc || `Captures behavioural patterns related to ${d.name} within ${name}.`}</p>
                                                                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Part of <strong style={{ color: meta.color }}>{name}</strong> � {dims.length} dimensions total</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 6. ALTERNATING TIMELINE � below soft controls */}
            <AlternatingTimeline />

            {/* NAVIGATE CTA */}
            <div
                ref={ctaRef}
                style={{
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)',
                    borderRadius: 16, padding: '28px 36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 20, flexWrap: 'wrap',
                    boxShadow: '0 4px 20px rgba(29,78,216,0.25)',
                    opacity: ctaVis ? 1 : 0, transform: ctaVis ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity .55s ease, transform .55s ease',
                }}
            >
                <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 5px', letterSpacing: '-0.02em' }}>Ready to explore the insights?</h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: 0 }}>Navigate to Executive Overview to see your full risk culture analysis.</p>
                </div>
                <button
                    onClick={() => onNavigateToOverview(null)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', color: '#1d4ed8', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'transform .2s, box-shadow .2s', whiteSpace: 'nowrap' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.18)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'; }}
                >
                    View Dashboard <span style={{ animation: 'float 1.5s ease infinite', display: 'inline-flex' }}><ArrowRight size={16} /></span>
                </button>
            </div>
        </div>
    );
};

export default WelcomeSection;


