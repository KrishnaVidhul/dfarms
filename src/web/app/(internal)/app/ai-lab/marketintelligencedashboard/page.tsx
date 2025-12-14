// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface MarketInsight {
  id: string;
  commodity: string;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence_score: number;
  current_price: number;
  target_price: number;
  ai_analysis: { reasoning: string };
  created_at: string;
}

interface Summary {
  total: number;
  buy: number;
  sell: number;
  hold: number;
  avgConfidence: { BUY: number; SELL: number; HOLD: number };
  topBuys: MarketInsight[];
  topSells: MarketInsight[];
  lastUpdated: string;
}

const MarketIntelligenceDashboard = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'SELL' | 'HOLD'>('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [summaryRes, insightsRes] = await Promise.all([
        fetch('/api/market-insights/summary'),
        fetch('/api/market-insights?limit=50')
      ]);

      const summaryData = await summaryRes.json();
      const insightsData = await insightsRes.json();

      if (summaryData.success) setSummary(summaryData.summary);
      if (insightsData.success) setInsights(insightsData.data);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const filteredInsights = filter === 'ALL'
    ? insights
    : insights.filter(i => i.recommendation === filter);

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'SELL': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'HOLD': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'BUY': return <TrendingUp className="w-4 h-4" />;
      case 'SELL': return <TrendingDown className="w-4 h-4" />;
      case 'HOLD': return <Minus className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading market intelligence...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Market Intelligence</h1>
          <p className="text-gray-400 mt-1">
            AI-powered commodity recommendations • Last updated: {summary?.lastUpdated ? new Date(summary.lastUpdated).toLocaleString() : 'N/A'}
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Insights</span>
            <CheckCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold">{summary?.total || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Commodities analyzed</div>
        </div>

        <div className="bg-gray-800 border border-green-900/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Buy Signals</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400">{summary?.buy || 0}</div>
          <div className="text-sm text-gray-500 mt-1">
            Avg confidence: {summary?.avgConfidence.BUY.toFixed(1)}%
          </div>
        </div>

        <div className="bg-gray-800 border border-red-900/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Sell Signals</span>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400">{summary?.sell || 0}</div>
          <div className="text-sm text-gray-500 mt-1">
            Avg confidence: {summary?.avgConfidence.SELL.toFixed(1)}%
          </div>
        </div>

        <div className="bg-gray-800 border border-yellow-900/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Hold Signals</span>
            <Minus className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-yellow-400">{summary?.hold || 0}</div>
          <div className="text-sm text-gray-500 mt-1">
            Avg confidence: {summary?.avgConfidence.HOLD.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Top Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top Buy Opportunities */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Top Buy Opportunities
          </h2>
          <div className="space-y-3">
            {summary?.topBuys.slice(0, 5).map((insight) => (
              <div key={insight.id} className="bg-gray-900 border border-green-900/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{insight.commodity}</span>
                  <span className="text-green-400 font-bold">{insight.confidence_score.toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>₹{insight.current_price} → ₹{insight.target_price}</span>
                  <span className="text-green-400">
                    +{((insight.target_price - insight.current_price) / insight.current_price * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
            {(!summary?.topBuys || summary.topBuys.length === 0) && (
              <div className="text-center text-gray-500 py-8">No buy signals available</div>
            )}
          </div>
        </div>

        {/* Top Sell Alerts */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Top Sell Alerts
          </h2>
          <div className="space-y-3">
            {summary?.topSells.slice(0, 5).map((insight) => (
              <div key={insight.id} className="bg-gray-900 border border-red-900/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{insight.commodity}</span>
                  <span className="text-red-400 font-bold">{insight.confidence_score.toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>₹{insight.current_price} → ₹{insight.target_price}</span>
                  <span className="text-red-400">
                    {((insight.target_price - insight.current_price) / insight.current_price * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
            {(!summary?.topSells || summary.topSells.length === 0) && (
              <div className="text-center text-gray-500 py-8">No sell signals available</div>
            )}
          </div>
        </div>
      </div>

      {/* All Insights Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">All Market Insights</h2>
          <div className="flex gap-2">
            {['ALL', 'BUY', 'SELL', 'HOLD'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg transition-colors ${filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-700">
              <tr className="text-left text-gray-400 text-sm">
                <th className="pb-3 font-medium">Commodity</th>
                <th className="pb-3 font-medium">Recommendation</th>
                <th className="pb-3 font-medium">Confidence</th>
                <th className="pb-3 font-medium">Current Price</th>
                <th className="pb-3 font-medium">Target Price</th>
                <th className="pb-3 font-medium">Potential</th>
                <th className="pb-3 font-medium">Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredInsights.map((insight) => (
                <tr key={insight.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="py-4 font-medium">{insight.commodity}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${getRecommendationColor(insight.recommendation)}`}>
                      {getRecommendationIcon(insight.recommendation)}
                      {insight.recommendation}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${insight.recommendation === 'BUY' ? 'bg-green-400' :
                              insight.recommendation === 'SELL' ? 'bg-red-400' : 'bg-yellow-400'
                            }`}
                          style={{ width: `${insight.confidence_score}%` }}
                        />
                      </div>
                      <span className="text-sm">{insight.confidence_score.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-4">₹{insight.current_price.toFixed(2)}</td>
                  <td className="py-4">₹{insight.target_price.toFixed(2)}</td>
                  <td className="py-4">
                    <span className={
                      insight.target_price > insight.current_price ? 'text-green-400' :
                        insight.target_price < insight.current_price ? 'text-red-400' : 'text-gray-400'
                    }>
                      {((insight.target_price - insight.current_price) / insight.current_price * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-400 max-w-xs truncate">
                    {insight.ai_analysis?.reasoning || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredInsights.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No insights available for this filter
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligenceDashboard;