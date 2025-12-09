'use client';

import React, { useState, useEffect } from 'react';
import ChatComponent from '../../app/components/ChatComponent';
import InventoryView from './InventoryView';
import MarketView from './MarketView';
import FinanceView from './FinanceView';
import QualityLab from '../QualityLab';
import InventorySyncWrapper from '../InventorySyncWrapper';

interface DashboardProps {
    inventory: any[];
    marketPrices: any[];
    financeMetrics: any;
    businessMetrics: any;
    productionRuns: any[]; // Kept for future Tab
}

export default function DashboardClient({
    inventory,
    marketPrices,
    financeMetrics,
    businessMetrics,
    productionRuns
}: DashboardProps) {
    const [activeTab, setActiveTab] = useState('Home');

    const tabs = [
        { id: 'Home', label: 'Home', icon: '🏠' },
        { id: 'Inventory', label: 'Inventory (FEFO)', icon: '📦' },
        { id: 'Market', label: 'Market Intel', icon: '📈' },
        { id: 'Quality', label: 'Quality Lab', icon: '🔬' },
        { id: 'Finance', label: 'Finance & Ops', icon: '💼' },
    ];

    // Helper to calculate urgent alerts for Home View
    // Helper to calculate urgent alerts for Home View
    // Hydration Fix: Use state to ensure client-side only calculation
    const [expiringItems, setExpiringItems] = useState<any[]>([]);

    useEffect(() => {
        const calculateExpiry = () => {
            const now = new Date().getTime();
            const urgent = inventory.filter((i: any) => {
                if (!i.expiry_date) return false;
                const diff = new Date(i.expiry_date).getTime() - now;
                const days = diff / (1000 * 3600 * 24);
                return days <= 30;
            });
            setExpiringItems(urgent);
        };
        calculateExpiry();
    }, [inventory]);

    const renderContent = () => {
        switch (activeTab) {
            case 'Home':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        {/* Left: Agent Command Center (2/3 width) */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <div className="bg-[#161b22] border border-gray-700 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
                                <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
                                    <h2 className="font-semibold text-gray-200">Operations Agent</h2>
                                    <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded border border-emerald-800">Online</span>
                                </div>
                                <div className="flex-1 bg-gray-900/50 relative">
                                    <ChatComponent />
                                </div>
                            </div>
                        </div>

                        {/* Right: Alerts & Status (1/3 width) */}
                        <div className="flex flex-col gap-6">

                            {/* Auto Sync Status */}
                            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                                <span className="text-sm text-gray-400">System Sync</span>
                                <InventorySyncWrapper />
                            </div>

                            {/* FEFO Alerts Card */}
                            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">FEFO Alerts</h3>
                                {expiringItems.length > 0 ? (
                                    <ul className="space-y-2">
                                        {expiringItems.slice(0, 3).map((item: any) => (
                                            <li key={item.id} className="bg-red-900/20 border border-red-900/50 p-2 rounded text-xs text-red-300 flex justify-between">
                                                <span>{item.pulse_type}</span>
                                                <span className="font-mono">Exp: {new Date(item.expiry_date).toLocaleDateString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-green-400">No urgent expiries.</p>
                                )}
                                <button onClick={() => setActiveTab('Inventory')} className="text-xs text-blue-400 hover:underline mt-2">View All Inventory →</button>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Stats</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Revenue</p>
                                        <p className="font-mono text-green-400">₹{financeMetrics.revenue.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Active Leads</p>
                                        <p className="font-mono text-blue-400">{businessMetrics.leads.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Inventory':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-200">Inventory Management</h2>
                            <InventorySyncWrapper />
                        </div>
                        <InventoryView inventory={inventory} />
                    </div>
                );
            case 'Market':
                return <MarketView marketPrices={marketPrices} />;
            case 'Quality':
                return <QualityLab />;
            case 'Finance':
                return <FinanceView metrics={financeMetrics} businessData={businessMetrics} />;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0F1115] text-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#161b22] border-r border-gray-800 flex flex-col fixed h-full z-10">
                <div className="h-16 flex items-center px-6 border-b border-gray-800">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50 mr-2"></div>
                    <h1 className="font-bold text-lg tracking-tight">D Farms <span className="text-emerald-500">OS</span></h1>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                }`}
                        >
                            <span className="text-lg">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">OP</div>
                        <div>
                            <p className="text-sm font-medium text-gray-200">Operator</p>
                            <p className="text-xs text-gray-500">Shift: Day</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
}
