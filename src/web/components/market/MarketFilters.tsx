'use client';

import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';

interface MarketFiltersProps {
    onFilterChange: (filters: FilterState) => void;
    initialFilters?: FilterState;
}

export interface FilterState {
    commodity: string;
    state: string;
    dateRange: string;
    startDate?: string;
    endDate?: string;
}

export default function MarketFilters({ onFilterChange, initialFilters }: MarketFiltersProps) {
    const [commodities, setCommodities] = useState<string[]>([]);
    const [states, setStates] = useState<string[]>([]);
    const [filters, setFilters] = useState<FilterState>(initialFilters || {
        commodity: '',
        state: '',
        dateRange: '30',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        // Fetch available commodities and states
        fetch('/api/market?action=commodities')
            .then(res => res.json())
            .then(data => setCommodities(data.commodities || []))
            .catch(err => console.error('Error fetching commodities:', err));

        fetch('/api/market?action=states')
            .then(res => res.json())
            .then(data => setStates(data.states || []))
            .catch(err => console.error('Error fetching states:', err));
    }, []);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        const newFilters = { ...filters, [key]: value };

        // Calculate date range if preset is selected
        if (key === 'dateRange' && value !== 'custom') {
            const days = parseInt(value);
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            newFilters.startDate = startDate.toISOString().split('T')[0];
            newFilters.endDate = endDate.toISOString().split('T')[0];
        }

        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const resetFilters: FilterState = {
            commodity: '',
            state: '',
            dateRange: '30',
            startDate: '',
            endDate: ''
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-emerald-500" />
                    <h3 className="text-sm font-semibold text-gray-200">Filters</h3>
                </div>
                <button
                    onClick={handleReset}
                    className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
                >
                    <X size={14} />
                    Reset
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Commodity Filter */}
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">Commodity</label>
                    <select
                        value={filters.commodity}
                        onChange={(e) => handleFilterChange('commodity', e.target.value)}
                        className="w-full bg-[#0d1117] border border-[#1F242C] text-sm text-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                        <option value="">All Commodities</option>
                        {commodities.map(commodity => (
                            <option key={commodity} value={commodity}>{commodity}</option>
                        ))}
                    </select>
                </div>

                {/* State Filter */}
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">State</label>
                    <select
                        value={filters.state}
                        onChange={(e) => handleFilterChange('state', e.target.value)}
                        className="w-full bg-[#0d1117] border border-[#1F242C] text-sm text-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                        <option value="">All States</option>
                        {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>

                {/* Date Range Filter */}
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">Date Range</label>
                    <select
                        value={filters.dateRange}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                        className="w-full bg-[#0d1117] border border-[#1F242C] text-sm text-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>

                {/* Custom Date Range (shown only when custom is selected) */}
                {filters.dateRange === 'custom' && (
                    <div className="md:col-span-1">
                        <label className="block text-xs font-medium text-zinc-400 mb-2">Custom Dates</label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                className="flex-1 bg-[#0d1117] border border-[#1F242C] text-xs text-gray-200 rounded-lg px-2 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            />
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                className="flex-1 bg-[#0d1117] border border-[#1F242C] text-xs text-gray-200 rounded-lg px-2 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
