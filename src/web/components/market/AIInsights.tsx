'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, Target, Shield } from 'lucide-react';

interface AIInsightsProps {
    commodity: string;
    insights?: any;
}

export default function AIInsights({ commodity, insights }: AIInsightsProps) {
    if (!insights) {
        return (
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <AlertCircle className="text-purple-500" size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200">AI Market Insights</h3>
                        <p className="text-xs text-zinc-500">No insights available yet</p>
                    </div>
                </div>
                <p className="text-sm text-zinc-400">
                    Select a commodity to view AI-powered buy/sell recommendations.
                </p>
            </div>
        );
    }

    const { recommendation, confidence_score, current_price, target_price, stop_loss, key_factors, technical_data } = insights;

    // Determine colors and icons based on recommendation
    const getRecommendationStyle = () => {
        switch (recommendation) {
            case 'BUY':
                return {
                    bg: 'bg-emerald-500/10',
                    border: 'border-emerald-500/30',
                    text: 'text-emerald-500',
                    icon: <TrendingUp size={24} />
                };
            case 'SELL':
                return {
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/30',
                    text: 'text-red-500',
                    icon: <TrendingDown size={24} />
                };
            default:
                return {
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/30',
                    text: 'text-yellow-500',
                    icon: <Minus size={24} />
                };
        }
    };

    const style = getRecommendationStyle();

    return (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${style.bg} rounded-lg flex items-center justify-center ${style.text}`}>
                        {style.icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200">AI Market Insights</h3>
                        <p className="text-xs text-zinc-500">Powered by Market Intelligence Agent</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-2xl font-bold ${style.text}`}>{recommendation}</div>
                    <div className="text-xs text-zinc-500">Confidence: {confidence_score}%</div>
                </div>
            </div>

            {/* Confidence Meter */}
            <div className="mb-6">
                <div className="flex justify-between text-xs text-zinc-500 mb-2">
                    <span>Confidence Level</span>
                    <span>{confidence_score}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all ${confidence_score >= 70 ? 'bg-emerald-500' :
                            confidence_score >= 50 ? 'bg-yellow-500' :
                                'bg-red-500'
                            }`}
                        style={{ width: `${confidence_score}%` }}
                    />
                </div>
            </div>

            {/* Price Targets */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#0d1117] border border-[#1F242C] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle size={14} className="text-blue-400" />
                        <span className="text-xs text-zinc-500">Current</span>
                    </div>
                    <div className="text-lg font-bold text-white">₹{current_price}</div>
                </div>
                <div className="bg-[#0d1117] border border-[#1F242C] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Target size={14} className="text-emerald-400" />
                        <span className="text-xs text-zinc-500">Target</span>
                    </div>
                    <div className="text-lg font-bold text-emerald-400">₹{target_price}</div>
                </div>
                <div className="bg-[#0d1117] border border-[#1F242C] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Shield size={14} className="text-red-400" />
                        <span className="text-xs text-zinc-500">Stop Loss</span>
                    </div>
                    <div className="text-lg font-bold text-red-400">₹{stop_loss}</div>
                </div>
            </div>

            {/* Multi-Factor Analysis Breakdown */}
            {insights.multi_factor_analysis && (
                <div className="mb-6 bg-[#0d1117] border border-[#1F242C] rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Multi-Factor Analysis</h4>
                    <div className="space-y-3">
                        {/* Technical Score */}
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-zinc-500">Technical Analysis (70% weight)</span>
                                <span className={`font-mono ${insights.multi_factor_analysis.technical_score >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {insights.multi_factor_analysis.technical_score >= 0 ? '+' : ''}{insights.multi_factor_analysis.technical_score}
                                </span>
                            </div>
                            <div className="w-full bg-zinc-800 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full ${insights.multi_factor_analysis.technical_score >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                    style={{ width: `${Math.min(Math.abs(insights.multi_factor_analysis.technical_score), 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* News Sentiment Score */}
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-zinc-500">News Sentiment (30% weight)</span>
                                <span className={`font-mono ${insights.multi_factor_analysis.news_score >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {insights.multi_factor_analysis.news_score >= 0 ? '+' : ''}{insights.multi_factor_analysis.news_score}
                                </span>
                            </div>
                            <div className="w-full bg-zinc-800 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full ${insights.multi_factor_analysis.news_score >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                    style={{ width: `${Math.min(Math.abs(insights.multi_factor_analysis.news_score), 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Combined Score */}
                        <div className="pt-2 border-t border-[#1F242C]">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-300 font-semibold">Combined Score</span>
                                <span className={`font-mono font-bold ${insights.multi_factor_analysis.combined_score >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {insights.multi_factor_analysis.combined_score >= 0 ? '+' : ''}{insights.multi_factor_analysis.combined_score}
                                </span>
                            </div>
                            <div className="w-full bg-zinc-800 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${insights.multi_factor_analysis.combined_score >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                    style={{ width: `${Math.min(Math.abs(insights.multi_factor_analysis.combined_score), 100)}%` }}
                                />
                            </div>
                            <div className="text-xs text-zinc-500 mt-2">
                                BUY ≥ +40 | HOLD: -40 to +40 | SELL ≤ -40
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* News Sentiment Details */}
            {insights.news_sentiment && (
                <div className="mb-6 bg-[#0d1117] border border-[#1F242C] rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">News Sentiment</h4>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className={`text-lg font-bold ${insights.news_sentiment.overall === 'positive' ? 'text-emerald-400' :
                                    insights.news_sentiment.overall === 'negative' ? 'text-red-400' :
                                        'text-yellow-400'
                                }`}>
                                {insights.news_sentiment.overall.toUpperCase()}
                            </div>
                            <div className="text-xs text-zinc-500">
                                Based on {insights.news_sentiment.article_count} recent articles
                            </div>
                        </div>
                        <div className={`text-2xl font-mono ${insights.news_sentiment.score >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {insights.news_sentiment.score >= 0 ? '+' : ''}{insights.news_sentiment.score}
                        </div>
                    </div>
                </div>
            )}

            {/* Key Factors */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Key Factors</h4>
                <div className="space-y-2">
                    {key_factors && key_factors.map((factor: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                            <span>{factor}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Technical Indicators */}
            {technical_data && (
                <div className="border-t border-[#1F242C] pt-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Technical Indicators</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex justify-between">
                            <span className="text-zinc-500">7-Day MA:</span>
                            <span className="text-gray-300 font-mono">₹{technical_data.ma_7}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-500">30-Day MA:</span>
                            <span className="text-gray-300 font-mono">₹{technical_data.ma_30}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Momentum:</span>
                            <span className={`font-mono ${technical_data.momentum > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {technical_data.momentum > 0 ? '+' : ''}{technical_data.momentum}%
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Trend:</span>
                            <span className="text-gray-300">{technical_data.trend}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Disclaimer */}
            <div className="mt-6 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                <p className="text-xs text-yellow-500/80">
                    ⚠️ <strong>Disclaimer:</strong> These are automated recommendations for informational purposes only.
                    Always consult with market experts and conduct your own research before making trading decisions.
                </p>
            </div>
        </div>
    );
}
