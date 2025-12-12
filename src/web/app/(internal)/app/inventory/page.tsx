import React from 'react';
import { getBatches } from '../../../../lib/db';
import InventoryBoard from '../../../../components/inventory/InventoryBoard';
import InventorySyncWrapper from '../../../../components/InventorySyncWrapper';

export const dynamic = 'force-dynamic';

export default async function InventoryPage({ searchParams }: { searchParams: { commodityId?: string } }) {
    // Safe Promise handling for Next 15+ searchParams
    const params = await searchParams;
    const commodityId = params?.commodityId ? parseInt(params.commodityId) : 2;

    const batches = await getBatches(commodityId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#161B22] p-4 rounded-lg border border-[#1F242C]">
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Inventory Management</h1>
                    <p className="text-xs text-zinc-500 mt-1">Real-time stock tracking by Processing Stage</p>
                </div>
                <InventorySyncWrapper />
            </div>

            <InventoryBoard batches={batches} commodityId={commodityId} />
        </div>
    );
}
