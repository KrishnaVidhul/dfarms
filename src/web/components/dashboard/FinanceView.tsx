'use client';

import React from 'react';

interface FinanceProps {
    metrics: {
        revenue: number;
        profit: number;
        invoices: any[];
    };
    businessData: {
        leads: any[];
        compliance: any[];
    };
}

export default function FinanceView({ metrics, businessData }: FinanceProps) {
    return (
        <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-green-400">₹{metrics.revenue.toLocaleString()}</p>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Net Profit</h3>
                    <p className={`text-3xl font-bold ${metrics.profit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                        ₹{metrics.profit.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Leads & Compliance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* CRM Widget */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
                    <div className="px-6 py-4 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-200">Active Leads</h3>
                        <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded">Top 5</span>
                    </div>
                    <div className="p-4">
                        <ul className="space-y-3">
                            {businessData.leads.map((lead: any) => (
                                <li key={lead.id} className="flex justify-between items-center p-3 bg-gray-750 rounded-lg border border-gray-700 hover:border-gray-600">
                                    <div>
                                        <p className="font-medium text-gray-200 text-sm">{lead.name}</p>
                                        <p className="text-xs text-gray-500">{lead.status}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${lead.status === 'Closed-Won' ? 'bg-green-900 text-green-300' :
                                        lead.status === 'Negotiating' ? 'bg-blue-900 text-blue-300' :
                                            'bg-gray-600 text-gray-300'
                                        }`}>
                                        {lead.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Compliance Widget */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
                    <div className="px-6 py-4 border-b border-gray-700 bg-gray-900/50">
                        <h3 className="font-semibold text-gray-200">Compliance Tracker</h3>
                    </div>
                    <div className="p-4">
                        <ul className="space-y-3">
                            {businessData.compliance.map((item: any) => (
                                <li key={item.id} className="flex items-center gap-4 p-3 bg-gray-750 rounded-lg border border-gray-700">
                                    <div className={`w-3 h-3 rounded-full ${item.status === 'Active' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-200 text-sm">{item.license_name}</p>
                                        <p className="text-xs text-gray-400">Exp: {new Date(item.expiry_date).toLocaleDateString()}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Recent Invoices Table */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700 bg-gray-900/50">
                    <h3 className="font-semibold text-gray-200">Recent Invoices</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="text-gray-500 text-xs uppercase bg-gray-900">
                        <tr>
                            <th className="px-6 py-3">Invoice #</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 text-sm">
                        {metrics.invoices.map((inv: any) => (
                            <tr key={inv.id} className="hover:bg-gray-750">
                                <td className="px-6 py-4 font-mono text-gray-300">{inv.invoice_number}</td>
                                <td className="px-6 py-4 text-white font-medium">{inv.customer_name}</td>
                                <td className="px-6 py-4 text-right font-mono text-green-400">₹{parseFloat(inv.total_amount).toFixed(2)}</td>
                                <td className="px-6 py-4 text-right">
                                    <a href={inv.pdf_path} target="_blank" className="text-blue-400 hover:underline">PDF</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
