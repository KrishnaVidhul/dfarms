import React from 'react';
import { getInventory, getMarketPrices, getFinanceMetrics, getBusinessMetrics } from '../../../lib/db';
import KPIGrid from '../../../components/dashboard/KPIGrid';
import PriceTrendChart from '../../../components/dashboard/PriceTrendChart';
import ActivityFeed from '../../../components/dashboard/ActivityFeed';
import ChatComponent from '../../components/ChatComponent';

// Force dynamic to ensure data is fresh on refresh
export const dynamic = 'force-dynamic';

export default async function Page() {
  const inventory = await getInventory();
  const marketPrices = await getMarketPrices();
  const financeMetrics = await getFinanceMetrics();
  const businessMetrics = await getBusinessMetrics();

  // Aggregate metrics for KPI Grid
  const metrics = {
    finance: financeMetrics,
    business: businessMetrics,
    inventoryCount: inventory.length
  };

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <KPIGrid metrics={metrics} />

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[350px] lg:auto-rows-[450px]">

        {/* Left: Chat Agent (Takes 1 Col) */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-lg overflow-hidden flex flex-col shadow-lg">
          <div className="p-4 border-b border-[#1F242C] bg-[#0d1117] flex justify-between items-center">
            <h3 className="font-semibold text-gray-200 text-sm">Operations Agent</h3>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          </div>
          <div className="flex-1 relative">
            <ChatComponent />
          </div>
        </div>

        {/* Middle: Price Trend (Takes 1 Col) */}
        <PriceTrendChart data={marketPrices} />

        {/* Right: Activity Feed (Takes 1 Col) */}
        <ActivityFeed />
      </div>
    </div>
  );
}
