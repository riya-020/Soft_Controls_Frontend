import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, User, Clock, Zap, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const SEVERITY_CONFIG = {
    High: { bg: 'bg-red-50', border: 'border-red-400', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
    Medium: { bg: 'bg-yellow-50', border: 'border-yellow-400', badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' }
};

const RISK_CONFIG = {
    High: { bg: 'bg-red-100', text: 'text-red-700' },
    Medium: { bg: 'bg-yellow-100', text: 'text-yellow-700' }
};

const RecommendationCard = ({ rec, index }) => {
    const [expanded, setExpanded] = useState(index === 0);
    const config = SEVERITY_CONFIG[rec.severity] || SEVERITY_CONFIG.Medium;

    return (
        <div className={`border-l-4 ${config.border} ${config.bg} rounded-r-lg mb-3 overflow-hidden`}>
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-4 text-left"
            >
                <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${config.dot} flex-shrink-0`} />
                    <span className="font-semibold text-kpmg-navy text-sm">{rec.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
                        {rec.severity}
                    </span>
                </div>
                {expanded ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
            </button>

            {expanded && (
                <div className="px-4 pb-4 space-y-3">
                    {/* Why */}
                    <div className="flex gap-2">
                        <AlertTriangle size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Why it's needed</p>
                            <p className="text-sm text-gray-700">{rec.why}</p>
                        </div>
                    </div>

                    {/* What */}
                    <div className="flex gap-2">
                        <Zap size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Action</p>
                            <p className="text-sm text-gray-700">{rec.what}</p>
                        </div>
                    </div>

                    {/* Impact */}
                    <div className="flex gap-2">
                        <TrendingUp size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Expected impact</p>
                            <p className="text-sm text-gray-700">{rec.impact}</p>
                        </div>
                    </div>

                    {/* Who + When */}
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

const RecommendationsSection = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecommendations = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:8000/recommendations');
            if (!res.ok) throw new Error('Failed to fetch recommendations');
            const json = await res.json();
            setData(json);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="bg-white border border-gray-200 border-t-4 border-t-kpmg-navy p-8 shadow-card rounded-b-md">
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-lg font-bold text-kpmg-navy">AI-Powered CEO Recommendations</h2>
                </div>
                <div className="flex flex-col items-center justify-center h-40 gap-3">
                    <div className="w-8 h-8 border-4 border-kpmg-blue border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">Gemini is analyzing risk culture patterns...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white border border-gray-200 border-t-4 border-t-red-500 p-8 shadow-card rounded-b-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-kpmg-navy">AI-Powered CEO Recommendations</h2>
                    <button onClick={fetchRecommendations} className="flex items-center gap-2 text-sm text-kpmg-blue font-medium hover:underline">
                        <RefreshCw size={14} /> Retry
                    </button>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-sm text-red-700 font-medium">Error: {error}</p>
                    <p className="text-xs text-red-500 mt-1">Make sure the backend server is running.</p>
                </div>
            </div>
        );
    }

    if (!data || !data.parameters) return null;

    return (
        <div className="bg-white border border-gray-200 border-t-4 border-t-kpmg-navy p-6 shadow-card rounded-b-md">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-kpmg-navy">AI-Powered CEO Recommendations</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Generated by Gemini based on current risk culture scores</p>
                </div>
                <button
                    onClick={fetchRecommendations}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-kpmg-blue border border-kpmg-blue hover:bg-blue-50 transition-colors rounded"
                >
                    <RefreshCw size={14} /> Regenerate
                </button>
            </div>

            {/* Executive Summary */}
            {data.executiveSummary && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Executive Summary</p>
                    <p className="text-sm text-kpmg-navy font-medium leading-relaxed">{data.executiveSummary}</p>
                </div>
            )}

            {/* Parameters */}
            <div className="space-y-6">
                {data.parameters
                    .sort((a, b) => a.score - b.score) // lowest score first
                    .map((param, i) => {
                        const riskConfig = RISK_CONFIG[param.riskLevel] || RISK_CONFIG.Medium;
                        return (
                            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                                {/* Parameter Header */}
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
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${param.score}%`,
                                                    background: param.riskLevel === 'High' ? '#ef4444' : '#f59e0b'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="p-4">
                                    {param.recommendations
                                        .sort((a, b) => (a.severity === 'High' ? -1 : 1))
                                        .map((rec, j) => (
                                            <RecommendationCard key={j} rec={rec} index={j} />
                                        ))}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default RecommendationsSection;