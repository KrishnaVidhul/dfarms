import React from 'react';
import { getInventory } from '../../../../lib/db';
import InventoryView from '../../../../components/dashboard/InventoryView';
import InventorySyncWrapper from '../../../../components/InventorySyncWrapper';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
    const inventory = await getInventory();

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-[#161B22] p-4 rounded-lg border border-[#1F242C]">
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Inventory Management</h1>
                    <p className="text-xs text-zinc-500 mt-1">Real-time stock levels and FEFO tracking</p>
                </div>
                <InventorySyncWrapper />
            </div>
            <InventoryView inventory={inventory} />
        </div>
    );
}
