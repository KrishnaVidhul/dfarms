import React from 'react';
import { getMarketPrices } from '../../../../lib/db';
import MarketView from '../../../../components/dashboard/MarketView';

export const dynamic = 'force-dynamic';

export default async function MarketPage() {
    const marketPrices = await getMarketPrices();

    return (
        <div className="space-y-4">
            <div className="bg-[#161B22] p-4 rounded-lg border border-[#1F242C]">
                <h1 className="text-xl font-bold text-white mb-1">Market Intelligence</h1>
                <p className="text-xs text-zinc-500">Live APMC prices and forecast trends</p>
            </div>
            <MarketView marketPrices={marketPrices} />
        </div>
    );
}
