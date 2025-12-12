import React from 'react';
import { getBatches } from '../../../../lib/db';
import QualityTestForm from '../../../../components/quality/QualityTestForm';
import InventorySyncWrapper from '../../../../components/InventorySyncWrapper';

export const dynamic = 'force-dynamic';

export default async function QualityPage({ searchParams }: { searchParams: { commodityId?: string } }) {
    const params = await searchParams;
    const commodityId = params?.commodityId ? parseInt(params.commodityId) : 2;

    // Fetch batches for this commodity (Raw and Processing stages primarily relevant for testing?)
    // Or fetch all. Let's fetch all for the Commodity Context.
    const batches = await getBatches(commodityId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#161B22] p-4 rounded-lg border border-[#1F242C]">
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Quality Assurance</h1>
                    <p className="text-xs text-zinc-500 mt-1">Lab Testing & AI Verification</p>
                </div>
                <InventorySyncWrapper />
            </div>

            <QualityTestForm batches={batches} />
        </div>
    );
}
