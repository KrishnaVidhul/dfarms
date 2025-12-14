'use client';

import React, { useState, useEffect } from 'react';
import MarketFilters, { FilterState } from '@/components/market/MarketFilters';
import PriceTrendChart from '@/components/market/PriceTrendChart';
import AIInsights from '@/components/market/AIInsights';
import { TrendingUp, TrendingDown, Download, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

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
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-800">
                <div>
                    <h1 className="text-2xl font-bold text-white">Market Intelligence</h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        National Agriculture Market Data (Agmarknet) • Last updated: {lastUpdated || 'Loading...'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchMarketData} className="gap-2">
                        <RefreshCw size={16} />
                        Refresh
                    </Button>
                    <Button variant="default" onClick={exportToCSV} disabled={marketData.length === 0} className="gap-2">
                        <Download size={16} />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Total Commodities</p>
                        <p className="text-2xl font-bold text-white mt-2">{stats.total_commodities || 0}</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">States Covered</p>
                        <p className="text-2xl font-bold text-white mt-2">{stats.total_states || 0}</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Total Markets</p>
                        <p className="text-2xl font-bold text-white mt-2">{stats.total_markets || 0}</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Records Loaded</p>
                        <p className="text-2xl font-bold text-emerald-400 mt-2">{marketData.length}</p>
                    </CardContent>
                </Card>
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
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                <CardHeader className="border-b border-zinc-800 pb-4">
                    <CardTitle className="text-base text-zinc-200">Market Data</CardTitle>
                    <CardDescription>
                        {loading ? 'Loading...' : `Showing ${marketData.length} records`}
                    </CardDescription>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-zinc-950/50">
                            <TableRow className="border-zinc-800 hover:bg-transparent">
                                <TableHead className="text-zinc-500">Commodity</TableHead>
                                <TableHead className="text-zinc-500">State</TableHead>
                                <TableHead className="text-zinc-500">Market</TableHead>
                                <TableHead className="text-zinc-500">Variety</TableHead>
                                <TableHead className="text-zinc-500 text-right">Min Price</TableHead>
                                <TableHead className="text-zinc-500 text-right">Modal Price</TableHead>
                                <TableHead className="text-zinc-500 text-right">Max Price</TableHead>
                                <TableHead className="text-zinc-500">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-zinc-500">
                                        Loading market data...
                                    </TableCell>
                                </TableRow>
                            ) : marketData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-zinc-500">
                                        No data available. Try adjusting your filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                marketData.map((item, idx) => (
                                    <TableRow key={idx} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                                        <TableCell className="font-medium text-zinc-200">{item.commodity}</TableCell>
                                        <TableCell className="text-zinc-400">{item.state}</TableCell>
                                        <TableCell className="text-zinc-400">{item.market_name}</TableCell>
                                        <TableCell className="text-zinc-500">{item.variety || '-'}</TableCell>
                                        <TableCell className="text-right font-mono text-blue-400">
                                            {item.min_price ? `₹${parseFloat(item.min_price).toFixed(2)}` : '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-semibold text-emerald-400">
                                            {item.modal_price ? `₹${parseFloat(item.modal_price).toFixed(2)}` : '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-amber-400">
                                            {item.max_price ? `₹${parseFloat(item.max_price).toFixed(2)}` : '-'}
                                        </TableCell>
                                        <TableCell className="text-zinc-500">
                                            {item.arrival_date ? new Date(item.arrival_date).toLocaleDateString('en-IN', { timeZone: 'UTC' }) : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
