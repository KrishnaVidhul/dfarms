'use client';

import React, { useState, useEffect } from 'react';
import MarketFilters, { FilterState } from '@/components/market/MarketFilters';
import PriceTrendChart from '@/components/market/PriceTrendChart';
import AIInsights from '@/components/market/AIInsights';
import { TrendingUp, TrendingDown, Download, RefreshCw } from 'lucide-react';

export default function MarketPage() {
    const [filters, setFilters] = useState<FilterState>({
        commodity: '',
        state: '',
        dateRange: '30',
        startDate: '',
        endDate: ''
    });
    const [marketData, setMarketData] = useState<any[]>([]);
    const [trendData, setTrendData] = useState<any[]>([]);
    const [insights, setInsights] = useState<any>(null);
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    useEffect(() => {
        fetchMarketData();
        fetchStats();
    }, [filters]);

    useEffect(() => {
        if (filters.commodity) {
            fetchTrendData();
            fetchInsights();
        }
    }, [filters.commodity, filters.dateRange]);

    const fetchMarketData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                action: 'prices',
                ...(filters.commodity && { commodity: filters.commodity }),
                ...(filters.state && { state: filters.state }),
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(filters.endDate && { endDate: filters.endDate }),
                limit: '2000'
            });

            const res = await fetch(`/api/market?${params}`);
            const data = await res.json();
            setMarketData(data.prices || []);
        } catch (err) {
            console.error('Error fetching market data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrendData = async () => {
        if (!filters.commodity) return;

        try {
            const days = filters.dateRange === 'custom' ? 90 : parseInt(filters.dateRange);
            const res = await fetch(`/api/market?action=trends&commodity=${filters.commodity}&days=${days}`);
            const data = await res.json();
            setTrendData(data.trends || []);
        } catch (err) {
            console.error('Error fetching trend data:', err);
        }
    };

    const fetchInsights = async () => {
        if (!filters.commodity) return;

        try {
            const res = await fetch(`/api/insights?commodity=${filters.commodity}`);
            const data = await res.json();
            if (data.insights && data.insights.length > 0) {
                setInsights(data.insights[0]);
            } else {
                setInsights(null);
            }
        } catch (err) {
            console.error('Error fetching insights:', err);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/market?action=stats');
            const data = await res.json();
            setStats(data.stats || {});
            if (data.stats.last_updated) {
                setLastUpdated(new Date(data.stats.last_updated).toLocaleString('en-IN'));
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const exportToCSV = () => {
        if (marketData.length === 0) return;

        const headers = ['Commodity', 'State', 'Market', 'Variety', 'Min Price', 'Max Price', 'Modal Price', 'Date'];
        const rows = marketData.map(item => [
            item.commodity,
            item.state,
            item.market_name,
            item.variety || '-',
            item.min_price || '-',
            item.max_price || '-',
            item.modal_price || '-',
            item.arrival_date
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `market_data_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end pb-6 border-b border-[#1F242C]">
                <div>
                    <h1 className="text-2xl font-bold text-white">Market Intelligence</h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        National Agriculture Market Data (Agmarknet) • Last updated: {lastUpdated || 'Loading...'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchMarketData}
                        className="flex items-center gap-2 bg-[#161B22] border border-[#1F242C] text-zinc-300 px-4 py-2 rounded-lg text-sm hover:bg-[#1F242C] transition-colors"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                    <button
                        onClick={exportToCSV}
                        disabled={marketData.length === 0}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Commodities</p>
                    <p className="text-2xl font-bold text-white mt-2">{stats.total_commodities || 0}</p>
                </div>
                <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">States Covered</p>
                    <p className="text-2xl font-bold text-white mt-2">{stats.total_states || 0}</p>
                </div>
                <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Markets</p>
                    <p className="text-2xl font-bold text-white mt-2">{stats.total_markets || 0}</p>
                </div>
                <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Records Loaded</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-2">{marketData.length}</p>
                </div>
            </div>

            {/* Filters */}
            <MarketFilters onFilterChange={setFilters} initialFilters={filters} />

            {/* AI Insights */}
            {filters.commodity && (
                <AIInsights commodity={filters.commodity} insights={insights} />
            )}

            {/* Price Trend Chart */}
            {filters.commodity && (
                <PriceTrendChart data={trendData} commodity={filters.commodity} />
            )}

            {/* Data Table */}
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
                <div className="p-4 border-b border-[#1F242C]">
                    <h3 className="text-sm font-semibold text-gray-200">Market Data</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                        {loading ? 'Loading...' : `Showing ${marketData.length} records`}
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#0d1117] text-zinc-500 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-4 py-3">Commodity</th>
                                <th className="px-4 py-3">State</th>
                                <th className="px-4 py-3">Market</th>
                                <th className="px-4 py-3">Variety</th>
                                <th className="px-4 py-3 text-right">Min Price</th>
                                <th className="px-4 py-3 text-right">Modal Price</th>
                                <th className="px-4 py-3 text-right">Max Price</th>
                                <th className="px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1F242C]">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-zinc-500 text-sm">
                                        Loading market data...
                                    </td>
                                </tr>
                            ) : marketData.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-zinc-500 text-sm">
                                        No data available. Try adjusting your filters or run the data fetcher script.
                                    </td>
                                </tr>
                            ) : (
                                marketData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-[#1F242C]/50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-200 font-medium">{item.commodity}</td>
                                        <td className="px-4 py-3 text-sm text-zinc-400">{item.state}</td>
                                        <td className="px-4 py-3 text-sm text-zinc-400">{item.market_name}</td>
                                        <td className="px-4 py-3 text-sm text-zinc-500">{item.variety || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-blue-400 text-right font-mono">
                                            {item.min_price ? `₹${parseFloat(item.min_price).toFixed(2)}` : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-emerald-400 text-right font-mono font-semibold">
                                            {item.modal_price ? `₹${parseFloat(item.modal_price).toFixed(2)}` : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-amber-400 text-right font-mono">
                                            {item.max_price ? `₹${parseFloat(item.max_price).toFixed(2)}` : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-zinc-500">
                                            {item.arrival_date ? new Date(item.arrival_date).toLocaleDateString('en-IN') : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
