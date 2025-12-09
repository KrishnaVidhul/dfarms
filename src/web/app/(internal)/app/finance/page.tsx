import React from 'react';
import { getFinanceMetrics, getBusinessMetrics } from '../../../../lib/db';
import FinanceView from '../../../../components/dashboard/FinanceView';

export const dynamic = 'force-dynamic';

export default async function FinancePage() {
    const financeMetrics = await getFinanceMetrics();
    const businessMetrics = await getBusinessMetrics();

    return (
        <div className="space-y-4">
            <div className="bg-[#161B22] p-4 rounded-lg border border-[#1F242C]">
                <h1 className="text-xl font-bold text-white mb-1">Finance & Operations</h1>
                <p className="text-xs text-zinc-500">Invoices, Leads, and Compliance Documents</p>
            </div>
            <FinanceView metrics={financeMetrics} businessData={businessMetrics} />
        </div>
    );
}
