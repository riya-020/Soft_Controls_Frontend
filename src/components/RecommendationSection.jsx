import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, User, Clock, Zap, RefreshCw, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, History } from 'lucide-react';

// ─── localStorage key ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'kpmg_rec_history';  // stores array of sets
const MAX_VERSIONS = 10;                  // keep last 10 versions

const SEVERITY_CONFIG = {
    High:   { bg: 'bg-red-50',    border: 'border-red-400',    badge: 'bg-red-100 text-red-700',    dot: 'bg-red-500'    },
    Medium: { bg: 'bg-yellow-50', border: 'border-yellow-400', badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' }
};
const RISK_CONFIG = {
    High:   { bg: 'bg-red-100',    text: 'text-red-700'    },
    Medium: { bg: 'bg-yellow-100', text: 'text-yellow-700' }
};

// ─── helpers ──────────────────────────────────────────────────────────────────
const loadHistory = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
};

const saveHistory = (history) => {
    try {
        // keep only last MAX_VERSIONS
        const trimmed = history.slice(-MAX_VERSIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) { console.warn('localStorage full:', e); }
};

const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

// ─── RecommendationCard ───────────────────────────────────────────────────────
const RecommendationCard = ({ rec, index }) => {
    const [expanded, setExpanded] = useState(index === 0);
    const config = SEVERITY_CONFIG[rec.severity] || SEVERITY_CONFIG.Medium;

    return (
        <div className={`border-l-4 ${config.border} ${config.bg} rounded-r-lg mb-3 overflow-hidden`}>
            <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${config.dot} flex-shrink-0`} />
                    <span className="font-semibold text-kpmg-navy text-sm">{rec.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>{rec.severity}</span>
                </div>
                {expanded ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
            </button>
            {expanded && (
                <div className="px-4 pb-4 space-y-3">
                    <div className="flex gap-2">
                        <AlertTriangle size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Why it's needed</p>
                            <p className="text-sm text-gray-700">{rec.why}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Zap size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Action</p>
                            <p className="text-sm text-gray-700">{rec.what}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <TrendingUp size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Expected impact</p>
                            <p className="text-sm text-gray-700">{rec.impact}</p>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-1">
                        <div className="flex items-center gap-1.5">
                            <User size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-500 font-medium">{rec.who}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-500 font-medium">{rec.when}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const RecommendationsSection = () => {
    const [history,      setHistory]      = useState([]);   // all saved sets
    const [activeIndex,  setActiveIndex]  = useState(0);    // index of currently viewed set
    const [loading,      setLoading]      = useState(true);
    const [regenerating, setRegenerating] = useState(false);
    const [error,        setError]        = useState(null);
    const [showHistory,  setShowHistory]  = useState(false);

    // ── On mount: load from localStorage, or fetch fresh if empty ────────────
    useEffect(() => {
        const saved = loadHistory();
        if (saved.length > 0) {
            setHistory(saved);
            setActiveIndex(saved.length - 1); // show latest
            setLoading(false);
        } else {
            // First ever load — fetch from API once
            fetchFromAPI(false);
        }
    }, []);

    const fetchFromAPI = async (isRegenerate) => {
        isRegenerate ? setRegenerating(true) : setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:8000/recommendations');
            if (!res.ok) throw new Error('Failed to fetch recommendations');
            const json = await res.json();

            const newEntry = { ...json, savedAt: new Date().toISOString() };
            const updated  = isRegenerate
                ? [...loadHistory(), newEntry]   // append new set to history
                : [newEntry];                     // first load — start fresh

            saveHistory(updated);
            setHistory(updated);
            setActiveIndex(updated.length - 1); // always jump to newest
        } catch (err) {
            setError(err.message);
        } finally {
            isRegenerate ? setRegenerating(false) : setLoading(false);
        }
    };

    const handleRegenerate = () => fetchFromAPI(true);

    const activeSet = history[activeIndex];

    // ── Loading state ─────────────────────────────────────────────────────────
    if (loading) return (
        <div className="bg-white border border-gray-200 border-t-4 border-t-kpmg-navy p-8 shadow-card rounded-b-md">
            <h2 className="text-lg font-bold text-kpmg-navy mb-6">AI-Powered CEO Recommendations</h2>
            <div className="flex flex-col items-center justify-center h-40 gap-3">
                <div className="w-8 h-8 border-4 border-kpmg-blue border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500 font-medium">Gemini is analyzing risk culture patterns...</p>
            </div>
        </div>
    );

    // ── Error state ───────────────────────────────────────────────────────────
    if (error && history.length === 0) return (
        <div className="bg-white border border-gray-200 border-t-4 border-t-red-500 p-8 shadow-card rounded-b-md">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-kpmg-navy">AI-Powered CEO Recommendations</h2>
                <button onClick={() => fetchFromAPI(false)} className="flex items-center gap-2 text-sm text-kpmg-blue font-medium hover:underline">
                    <RefreshCw size={14} /> Retry
                </button>
            </div>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-sm text-red-700 font-medium">Error: {error}</p>
                <p className="text-xs text-red-500 mt-1">Make sure the backend server is running.</p>
            </div>
        </div>
    );

    if (!activeSet || !activeSet.parameters) return null;

    return (
        <div id="recommendations-section" className="bg-white border border-gray-200 border-t-4 border-t-kpmg-navy p-6 shadow-card rounded-b-md">

            {/* ── Header row ── */}
            <div className="flex items-start justify-between mb-2 flex-wrap gap-3">
                <div>
                    <h2 className="text-lg font-bold text-kpmg-navy">AI-Powered CEO Recommendations</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Generated by Gemini · {history.length} version{history.length !== 1 ? 's' : ''} saved</p>
                </div>

                {/* Version navigator — only shown if more than 1 version */}
                {history.length > 1 && (
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <button onClick={() => setActiveIndex(i => Math.max(0, i - 1))} disabled={activeIndex === 0}
                            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition">
                            <ChevronLeft size={14} />
                        </button>
                        <div className="text-center min-w-[130px]">
                            <p className="text-xs font-bold text-kpmg-navy">
                                Version {activeIndex + 1} of {history.length}
                                {activeIndex === history.length - 1 && <span className="ml-1 text-green-600">· Latest</span>}
                            </p>
                            <p className="text-xs text-gray-400">{formatDate(activeSet.savedAt)}</p>
                        </div>
                        <button onClick={() => setActiveIndex(i => Math.min(history.length - 1, i + 1))} disabled={activeIndex === history.length - 1}
                            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* ── Version history dropdown ── */}
            {history.length > 1 && (
                <div className="mb-6">
                    <button onClick={() => setShowHistory(h => !h)}
                        className="flex items-center gap-2 text-xs text-gray-500 hover:text-kpmg-navy transition font-medium">
                        <History size={12} />
                        {showHistory ? 'Hide' : 'Show'} version history ({history.length} saved)
                    </button>
                    {showHistory && (
                        <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                            {[...history].reverse().map((set, revIdx) => {
                                const origIdx = history.length - 1 - revIdx;
                                const isActive = origIdx === activeIndex;
                                return (
                                    <button key={origIdx} onClick={() => { setActiveIndex(origIdx); setShowHistory(false); }}
                                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm border-b border-gray-100 last:border-b-0 transition ${isActive ? 'bg-blue-50 text-kpmg-navy font-semibold' : 'hover:bg-gray-50 text-gray-600'}`}>
                                        <span>Version {origIdx + 1}{origIdx === history.length - 1 ? ' (Latest)' : ''}</span>
                                        <span className="text-xs text-gray-400">{formatDate(set.savedAt)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ── Regenerating overlay ── */}
            {regenerating && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-kpmg-blue border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    <p className="text-sm text-kpmg-navy font-medium">Gemini is analyzing risk culture patterns and generating new recommendations...</p>
                </div>
            )}

            {/* ── Executive Summary ── */}
            {activeSet.executiveSummary && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Executive Summary</p>
                    <p className="text-sm text-kpmg-navy font-medium leading-relaxed">{activeSet.executiveSummary}</p>
                </div>
            )}

            {/* ── Parameters ── */}
            <div className="space-y-6">
                {activeSet.parameters
                    .sort((a, b) => a.score - b.score)
                    .map((param, i) => {
                        const riskConfig = RISK_CONFIG[param.riskLevel] || RISK_CONFIG.Medium;
                        return (
                            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-kpmg-navy text-sm">{param.softControl}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${riskConfig.bg} ${riskConfig.text}`}>
                                            {param.riskLevel} Risk
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">Score:</span>
                                        <span className="text-sm font-bold text-kpmg-navy">{param.score}/100</span>
                                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                                            <div className="h-full rounded-full" style={{ width: `${param.score}%`, background: param.riskLevel === 'High' ? '#ef4444' : '#f59e0b' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    {param.recommendations
                                        .sort((a, b) => (a.severity === 'High' ? -1 : 1))
                                        .map((rec, j) => <RecommendationCard key={j} rec={rec} index={j} />)}
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* ── Regenerate button at bottom ── */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
                <div>
                    <p className="text-sm font-semibold text-gray-700">Generate a new set of recommendations</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Previous versions are saved locally · {history.length}/{MAX_VERSIONS} versions stored
                    </p>
                </div>
                <button onClick={handleRegenerate} disabled={regenerating}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-kpmg-blue hover:bg-kpmg-navy transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                    <RefreshCw size={14} className={regenerating ? 'animate-spin' : ''} />
                    {regenerating ? 'Generating...' : 'Regenerate Recommendations'}
                </button>
            </div>

            {/* Error toast if regenerate fails but old data still shows */}
            {error && history.length > 0 && (
                <div className="mt-3 bg-red-50 border border-red-200 p-3 rounded-lg">
                    <p className="text-xs text-red-700">Regeneration failed: {error}. Showing last saved version.</p>
                </div>
            )}
        </div>
    );
};

export default RecommendationsSection;