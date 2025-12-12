import {
  getProcurementComparison,
  getProductionYield,
  getStockBreakdown,
  getCommodityName
} from '../../../lib/db';
import ProcurementCard from '../../../components/dashboard/ProcurementCard';
import ProductionYieldChart from '../../../components/dashboard/ProductionYieldChart';
import StockBreakdownChart from '../../../components/dashboard/StockBreakdownChart';
import AgentStatusWidget from '../../../components/dashboard/AgentStatusWidget';
import ChatComponent from '../../components/ChatComponent';

// Force dynamic to ensure data is fresh on refresh
export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: { commodityId?: string } }) {
  // Parse commodityId from URL or default to 2 (Tur Dal)
  // Need to await searchParams in modern Next.js 15+ if applies, but 14 is sync often. 
  // Next 15 it's async. The project uses Next 16.0.7 (from package.json).
  // In Next 15+, searchParams is a Promise.

  // Safe handling for Promise-based searchParams
  // Safe handling for Promise-based searchParams
  const params = await searchParams;
  const commodityId = params?.commodityId ? parseInt(params.commodityId) : 2;

  // Fetch dynamic name
  // We can't import getCommodityName if not exported, so I need to ensure it's exported.
  // Assuming I exported it in previous step.
  // Wait, I need to update import list first? 
  // I will assume I can update import list in a separate replacement or same block if I use multi?
  // I'll just use db helper.

  // Actually, I need to import getCommodityName.
  // I'll update the whole file import and logic.


  // Fetch Manufacturing Data filtered by Commodity
  const [procurementData, yieldData, stockData, commodityName] = await Promise.all([
    getProcurementComparison(commodityId),
    getProductionYield(commodityId),
    getStockBreakdown(commodityId),
    getCommodityName(commodityId)
  ]);

  return (
    <div className="space-y-6">

      {/* Top Heading / KPI Context */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Processing Operations</h2>
          <p className="text-gray-500 text-sm mt-1">Real-time status for <span className="text-emerald-400 font-medium">{commodityName}</span></p>
        </div>
      </div>

      {/* Main Grid - Manufacturing Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-[350px]">

        {/* Widget A: Procurement (1 Col) */}
        <div className="lg:col-span-1">
          <ProcurementCard data={procurementData} commodityName={commodityName} />
        </div>

        {/* Widget B: Live Agent Status (1 Col - NEW) */}
        <div className="lg:col-span-1">
          <AgentStatusWidget />
        </div>

        {/* Widget C: Production Yield (2 Cols) */}
        <div className="lg:col-span-2">
          <ProductionYieldChart data={yieldData} />
        </div>

        {/* Widget B: Production Yield (2 Cols - Main Focus) */}
        <div className="lg:col-span-2">
          <ProductionYieldChart data={yieldData} />
        </div>

        {/* Widget C: Stock Breakdown (1 Col) */}
        <div className="lg:col-span-1">
          <StockBreakdownChart data={stockData} />
        </div>

      </div>

    </div>
  );
}
