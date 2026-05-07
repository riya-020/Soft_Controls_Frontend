import { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, Users, Eye, Target, Lock, MessageCircle, Lightbulb, ShieldCheck, CheckCircle } from 'lucide-react';
import leader13 from '../../assets/Leader 13.jpg';
import leader15 from '../../assets/Leader 15.jpg';
import leader8 from '../../assets/Leader 8.jpg';

// ─── SC_META ─────────────────────────────────────────────────────────────────
const SC_META = {
  'Role Modelling': {
    img: leader13, icon: Users, color: '#2563eb', bg: '#eff6ff',
    tagline: 'Leaders set the tone',
    definition: "The extent to which leadership exemplifies the organisation's core values, ethics, and expected behaviours in their day-to-day actions.",
    why: 'When leaders visibly model the behaviours they expect, it creates a powerful signal that shapes how risk is perceived and managed across all levels.',
    dims: [
      { name: 'Leadership Example-Setting in Risk Management', desc: 'It reflects how consistently leaders demonstrate risk-aware behavior through their decisions and day-to-day actions.', impact: 'When this is low, employees receive mixed signals about expected behavior, leading to inconsistency, reduced trust in leadership, and weaker cultural alignment.' },
      { name: 'Executive Commitment to Risk Culture', desc: 'Shows how visibly senior leadership prioritizes and reinforces a strong risk culture.', impact: 'Low commitment reduces the credibility of risk initiatives, slows cultural adoption, and causes employees to deprioritize risk considerations.' },
      { name: 'Leadership Encouragement to Escalate Risks', desc: 'Indicates whether leaders actively encourage employees to raise concerns and escalate risks early.', impact: 'Low scores result in hidden risks, delayed escalation, and higher likelihood of issues growing into serious incidents.' },
      { name: 'Long-Term Decision Awareness', desc: 'Measures the extent to which decisions consider long-term consequences beyond immediate pressures.', impact: 'Low awareness leads to short-term decision-making, recurring problems, and misalignment with long-term strategy.' },
    ],
  },
  'Discussability': {
    img: leader15, icon: MessageCircle, color: '#7c3aed', bg: '#f5f3ff',
    tagline: 'Open dialogue drives safety',
    definition: 'The degree to which employees feel comfortable raising concerns, challenging decisions, and discussing risk-related issues openly without fear of repercussion.',
    why: 'Psychological safety is a prerequisite for effective risk management. When people can speak up, problems surface early and are resolved before they escalate.',
    dims: [
      { name: 'Openness to Discussions', desc: 'Reflects how freely employees can discuss concerns, mistakes, and dilemmas.', impact: 'Low openness suppresses learning, limits problem-solving, and allows unresolved issues to accumulate.' },
      { name: 'Access to Guidance', desc: 'Shows how easily employees can obtain advice or guidance when facing risk-related situations.', impact: 'Poor access increases uncertainty, inconsistent decisions, and operational inefficiencies.' },
      { name: 'Openness to Sharing Opinions', desc: 'Measures whether employees feel comfortable sharing views and perspectives on risk matters.', impact: 'Low openness reduces diversity of input, weakens decision quality, and limits early identification of risks.' },
      { name: 'Comfort in Reporting Risk Dilemmas', desc: 'Indicates whether employees feel safe raising ethical dilemmas or complex risk situations.', impact: 'Low comfort discourages reporting, delays resolution, and increases exposure to unmanaged risks.' },
    ],
  },
  'Achievability': {
    img: leader8, icon: Target, color: '#4f46e5', bg: '#eef2ff',
    tagline: 'Realistic goals reduce risk',
    definition: 'Ensuring that assigned tasks, targets, and objectives are realistic, attainable, and properly resourced without creating pressure that compromises risk standards.',
    why: 'Unrealistic targets create incentives to cut corners. When goals are achievable, employees can maintain risk standards without feeling forced to choose between performance and compliance.',
    dims: [
      { name: 'Adequacy of Risk Management Training', desc: 'Assesses whether employees feel sufficiently trained to manage risk appropriately.', impact: 'Insufficient training leads to inconsistent behavior, higher error rates, and dependence on individual experience.' },
      { name: 'Workload Balance & Resource Sufficiency', desc: 'Evaluates whether employees have enough time and resources to manage risk effectively.', impact: 'High workload pressure causes shortcuts, control gaps, and increased operational risk.' },
      { name: 'Realistic Target Setting', desc: 'Measures whether targets and expectations are achievable without compromising risk standards.', impact: 'Unrealistic targets encourage risk-taking, policy breaches, and erosion of ethical behavior.' },
      { name: 'Risk Insight in Decision Making', desc: 'Shows how well risk considerations are integrated into everyday decisions.', impact: 'Low risk insight increases exposure to financial, operational, and reputational issues.' },
    ],
  },
  'Enforcement': {
    img: leader15, icon: Lock, color: '#6366f1', bg: '#eef2ff',
    tagline: 'Consistent consequences matter',
    definition: 'The consistent and fair application of rules, policies, and consequences across all levels of the organisation regardless of seniority or performance.',
    why: 'Selective enforcement erodes trust and signals that rules are negotiable. Consistent enforcement reinforces that risk standards apply to everyone equally.',
    dims: [
      { name: 'Learning Culture from Non-Compliance Cases', desc: "Assesses the organization's ability to learn and improve from past non-compliance events.", impact: 'Low learning results in repeated issues, higher compliance risk, and diminished control maturity.' },
      { name: 'Organizational View on Risk Culture', desc: 'Reflects how seriously risk culture is perceived across the organization.', impact: 'A weak view of risk culture undermines consistency in behavior and weakens overall risk management.' },
      { name: 'Compliance Recognition & Enforcement', desc: 'Indicates whether compliance is recognized, reinforced, and acted upon fairly.', impact: 'Poor enforcement reduces rule adherence and increases misconduct risk.' },
      { name: 'Sense of Ownership', desc: 'Reflects the extent to which employees feel personally responsible for managing risks, taking initiative, and acting in the best interest of the organization within their role.', impact: 'Low sense of ownership results in passive behavior, delayed action on risks, and unclear accountability across teams.' },
    ],
  },
  'Clarity': {
    img: leader13, icon: Lightbulb, color: '#8b5cf6', bg: '#f5f3ff',
    tagline: 'Clear expectations enable action',
    definition: 'The degree to which employees have a clear understanding of their roles, responsibilities, risk expectations, and how their work connects to organisational goals.',
    why: 'Ambiguity breeds risk. When people understand what is expected of them and why, they can make better decisions and take appropriate ownership of risk.',
    dims: [
      { name: 'Clarity of Role and Responsibilities', desc: 'Shows how clearly individuals understand their role in managing risk.', impact: 'Unclear roles create accountability gaps, duplication of work, and overlooked risks.' },
      { name: 'Understanding of Risk Policies & Procedures', desc: 'Measures how well employees understand risk-related rules and procedures.', impact: 'Low understanding increases mistakes, non-compliance, and inconsistent execution.' },
      { name: 'Clarity of Personal Risk Boundaries', desc: 'Indicates whether employees understand personal limits and decision boundaries around risk.', impact: 'Unclear boundaries encourage risky decisions and inconsistent judgment calls.' },
      { name: 'Effectiveness of Risk Communication & Training', desc: 'Assesses the clarity and usefulness of risk messaging and training initiatives.', impact: 'Ineffective communication weakens awareness and consistent application of risk principles.' },
    ],
  },
  'Transparency': {
    img: leader8, icon: Eye, color: '#3b82f6', bg: '#eff6ff',
    tagline: 'Openness builds trust',
    definition: 'The degree to which management is open and clear about decisions, actions, performance, and outcomes including sharing both successes and failures.',
    why: 'Transparency builds the trust necessary for effective risk culture. When information flows freely, employees can make informed decisions and hold each other accountable.',
    dims: [
      { name: 'Compliance Confidence in Team', desc: 'Reflects confidence within teams that compliance is taken seriously.', impact: 'Low confidence reduces adherence to standards and increases complacency toward risks.' },
      { name: 'Transparency in Decision-Making', desc: 'Shows whether risks are identified early rather than after incidents occur.', impact: 'Low proactivity increases reaction time, impact severity, and cost of failures.' },
      { name: 'Fairness & Equity of Expectations', desc: 'Measures whether leaders act on raised issues and concerns.', impact: 'Poor follow-through reduces trust, engagement, and future willingness to escalate risks.' },
      { name: 'Leadership Awareness in the Team', desc: 'Indicates whether standards and policies are easy to find and consistently applied.', impact: 'Low transparency leads to confusion, inconsistent compliance, and operational inefficiency.' },
    ],
  },
  'Commitment': {
    img: leader13, icon: CheckCircle, color: '#7c3aed', bg: '#f5f3ff',
    tagline: 'Dedication drives culture',
    definition: 'The dedication from both employees and leadership towards organisational goals, risk standards, and cultural expectations even when it is inconvenient.',
    why: 'Commitment is what transforms intent into action. When people are genuinely committed to risk culture, they maintain standards under pressure and in ambiguous situations.',
    dims: [
      { name: 'Motivation for Risk Ownership', desc: 'Reflects employee motivation to take ownership of risks in their role.', impact: 'Low motivation results in passive behavior and unaddressed risks.' },
      { name: 'Sense of Belonging to the Organization', desc: 'Measures whether employees feel connected and valued by the organization.', impact: 'Low belonging reduces engagement, collaboration, and retention.' },
      { name: 'Consideration of Impact on Others', desc: 'Shows whether employees consider how their actions affect colleagues and stakeholders.', impact: 'Low consideration damages collaboration, trust, and workplace culture.' },
      { name: 'Accountability for Risk Actions', desc: 'Indicates whether individuals feel accountable for risk-related decisions and outcomes.', impact: 'Weak accountability delays mitigation and increases unresolved risk exposure.' },
    ],
  },
  'Call Someone to Account': {
    img: leader15, icon: ShieldCheck, color: '#9333ea', bg: '#faf5ff',
    tagline: 'Accountability closes the loop',
    definition: 'The willingness and ability to hold individuals including senior leaders accountable for their actions, decisions, and their impact on risk culture.',
    why: 'Without accountability, risk culture remains aspirational. When people know that actions have consequences, they are more likely to act in accordance with stated values.',
    dims: [
      { name: 'Peer to Peer Accountability', desc: 'Measures willingness to hold colleagues accountable constructively.', impact: 'Low peer accountability allows undesirable behaviors to spread unchecked.' },
      { name: 'Timely Resolution of Accountability Issues', desc: 'Assesses how quickly accountability concerns are addressed.', impact: 'Delayed resolution causes recurring problems and weakens confidence in controls.' },
      { name: 'Comfort for Reporting Non-Compliance', desc: 'Reflects how safe employees feel reporting non-compliance or misconduct.', impact: 'Low comfort hides breaches, increasing regulatory and reputational risk.' },
      { name: 'Consistency of Conduct Enforcement', desc: 'Measures fairness and consistency in applying behavioral rules.', impact: 'Inconsistent enforcement erodes trust and weakens adherence to standards.' },
    ],
  },
};

const SC_LIST = Object.keys(SC_META);

// ─── SOFT CONTROL CARD ───────────────────────────────────────────────────────
const SCCard = ({ name, index, onClick }) => {
  const meta = SC_META[name];
  const Icon = meta.icon;
  const [vis, setVis] = useState(false);
  const [hovered, setHovered] = useState(false);
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
      onClick={() => onClick(name)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#fafbff' : '#ffffff',
        border: `1px solid ${hovered ? meta.color + '40' : '#e5e7eb'}`,
        borderRadius: 20,
        padding: '22px 20px 20px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        opacity: vis ? 1 : 0,
        transform: vis
          ? hovered ? 'translateY(-4px)' : 'translateY(0)'
          : 'translateY(20px) scale(0.97)',
        transition: `opacity .5s ease ${index * 0.06}s, transform .5s ease ${index * 0.06}s, border-color .2s, background .2s, box-shadow .2s`,
        boxShadow: hovered
          ? `0 12px 40px ${meta.color}18, 0 2px 8px rgba(0,0,0,0.06)`
          : '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${meta.color}, ${meta.color}88)`,
        borderRadius: '20px 20px 0 0',
        opacity: hovered ? 1 : 0.7,
        transition: 'opacity .2s',
      }} />

      {/* Radial glow on hover */}
      {hovered && (
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 120, height: 120, borderRadius: '50%',
          background: `radial-gradient(circle, ${meta.color}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Avatar */}
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        overflow: 'hidden',
        border: `2.5px solid ${meta.color}25`,
        boxShadow: `0 4px 14px ${meta.color}20`,
        marginBottom: 14,
        flexShrink: 0,
        transition: 'transform .25s ease',
        transform: hovered ? 'scale(1.06)' : 'scale(1)',
      }}>
        {meta.img
          ? <img src={meta.img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (
            <div style={{ width: '100%', height: '100%', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={24} color={meta.color} />
            </div>
          )
        }
      </div>

      {/* Title + tagline */}
      <h3 style={{
        fontSize: 15, fontWeight: 800, color: '#111827',
        margin: '0 0 5px', lineHeight: 1.25, letterSpacing: '-0.01em',
        fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
      }}>
        {name}
      </h3>
      <p style={{
        fontSize: 12, color: '#9ca3af', margin: '0 0 16px',
        fontStyle: 'italic', lineHeight: 1.4,
        fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
      }}>
        {meta.tagline}
      </p>

      {/* Dimensions count pill */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 'auto',
      }}>
        
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: hovered ? meta.color : meta.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .2s',
        }}>
          <ChevronRight size={14} color={hovered ? '#fff' : meta.color} />
        </div>
      </div>
    </div>
  );
};

// ─── MODAL ───────────────────────────────────────────────────────────────────
const SCModal = ({ name, onClose }) => {
  const [expandedDim, setExpandedDim] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay for mount animation
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setExpandedDim(null);
  }, [name]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!name) return null;
  const meta = SC_META[name];
  const Icon = meta.icon;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15,23,42,0.55)',
        backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        opacity: mounted ? 1 : 0,
        transition: 'opacity .22s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 860,
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          background: '#fff',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
          border: '1px solid #e5e7eb',
          transform: mounted ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          transition: 'transform .28s cubic-bezier(.16,1,.3,1)',
          fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
        }}
      >
        {/* ── Header ── */}
        <div style={{
          position: 'relative',
          background: `linear-gradient(135deg, ${meta.color} 0%, ${meta.color}cc 100%)`,
          padding: '28px 32px 24px',
          flexShrink: 0,
        }}>
          {/* Decorative radial */}
          <div style={{
            position: 'absolute', top: -50, right: -50,
            width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(255,255,255,0.10)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -30, left: 60,
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, position: 'relative' }}>
            {/* Left */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                overflow: 'hidden',
                border: '2.5px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                flexShrink: 0,
              }}>
                {meta.img
                  ? <img src={meta.img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (
                    <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={26} color="#fff" />
                    </div>
                  )
                }
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '.12em', margin: '0 0 5px' }}>
                  Soft Control
                </p>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.025em' }}>
                  {name}
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: '4px 0 0', fontStyle: 'italic' }}>
                  {meta.tagline}
                </p>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              style={{
                width: 36, height: 36, borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.12)',
                color: '#fff', fontSize: 20, lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
                transition: 'background .15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div style={{
          overflowY: 'auto', padding: '24px 32px 32px',
          display: 'flex', flexDirection: 'column', gap: 22,
          background: '#fcfcfd',
        }}>

          {/* Definition + Why */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: 14, padding: '18px 20px',
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 9px' }}>
                What it means
              </p>
              <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.75, margin: 0 }}>
                {meta.definition}
              </p>
            </div>
            <div style={{
              background: `${meta.color}08`,
              border: `1px solid ${meta.color}25`,
              borderLeft: `3px solid ${meta.color}`,
              borderRadius: 14, padding: '18px 20px',
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 9px' }}>
                Why it matters
              </p>
              <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.75, margin: 0 }}>
                {meta.why}
              </p>
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 12px' }}>
              Dimensions — click any to explore
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {meta.dims.map((d, i) => {
                const isOpen = expandedDim === d.name;
                return (
                  <div key={i} style={{ marginBottom: 8, paddingRight: i % 2 === 0 ? 6 : 0, paddingLeft: i % 2 !== 0 ? 6 : 0 }}>
                    {/* Pill header */}
                    <div
                      onClick={() => setExpandedDim(isOpen ? null : d.name)}
                      style={{
                        background: isOpen ? meta.bg : '#f8f9fa',
                        border: `1px solid ${isOpen ? meta.color + '50' : '#e5e7eb'}`,
                        borderRadius: isOpen ? '12px 12px 0 0' : 12,
                        padding: '12px 14px',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                        transition: 'background .18s, border-color .18s',
                      }}
                      onMouseEnter={(e) => { if (!isOpen) { e.currentTarget.style.borderColor = meta.color + '55'; e.currentTarget.style.background = meta.bg; } }}
                      onMouseLeave={(e) => { if (!isOpen) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#f8f9fa'; } }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: isOpen ? meta.color : '#111827' }}>{d.name}</span>
                      </div>
                      <ChevronRight
                        size={14} color={meta.color}
                        style={{ flexShrink: 0, transition: 'transform .2s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                      />
                    </div>

                    {/* Expanded content */}
                    {isOpen && (
                      <div style={{
                        background: '#fff',
                        border: `1px solid ${meta.color}30`,
                        borderTop: 'none',
                        borderRadius: '0 0 12px 12px',
                        padding: '14px 16px',
                        animation: 'dimExpand .22s ease',
                      }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 6px' }}>
                          What this measures
                        </p>
                        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, margin: 0 }}>
                          {d.desc}
                        </p>
                        {d.impact && (
                          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
                            <p style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 5px' }}>
                              Business Impact
                            </p>
                            <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                              {d.impact}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const SoftControlsDashboard = () => {
  const [openModal, setOpenModal] = useState(null);
  const [headerVis, setHeaderVis] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeaderVis(true); },
      { threshold: 0.1 }
    );
    if (headerRef.current) obs.observe(headerRef.current);
    return () => obs.disconnect();
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = openModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [openModal]);

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes dimExpand {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { font-family: 'Inter','Segoe UI',system-ui,sans-serif !important; }

        .sc-modal-body::-webkit-scrollbar { width: 5px; }
        .sc-modal-body::-webkit-scrollbar-track { background: transparent; }
        .sc-modal-body::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
      `}</style>

      {/* ── Section Header ── */}
      <div
        ref={headerRef}
        style={{
          marginBottom: 20,
          opacity: headerVis ? 1 : 0,
          transform: headerVis ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity .5s ease, transform .5s ease',
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 6px' }}>
          Interactive Framework
        </p>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.025em' }}>
          The 8 Soft Controls
        </h2>
        <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: 12, padding: '13px 18px', borderLeft: '4px solid #2563eb' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 5px' }}>
            Why we break soft controls into dimensions
          </p>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, margin: 0 }}>
            Soft controls are complex behaviours that cannot be measured by a single question. Breaking each into dimensions lets us pinpoint exactly where an organisation is strong and where it needs to improve, enabling targeted interventions.
          </p>
        </div>
      </div>

      {/* ── 4 × 2 Card Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
      }}>
        {SC_LIST.map((name, i) => (
          <SCCard key={name} name={name} index={i} onClick={setOpenModal} />
        ))}
      </div>

      {/* ── Modal ── */}
      {openModal && (
        <SCModal name={openModal} onClose={() => setOpenModal(null)} />
      )}
    </div>
  );
};

export default SoftControlsDashboard;