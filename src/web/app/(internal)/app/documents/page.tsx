'use client';

import React, { useState } from 'react';
import { Folder, FileText, Download, Search, Filter } from 'lucide-react';

export default function DocumentsPage() {
    const [docs] = useState([
        { id: 1, name: 'Invoice_INV-2024-001.pdf', type: 'Invoice', date: '2025-12-08', size: '1.2 MB' },
        { id: 2, name: 'Q4_Financial_Report.pdf', type: 'Report', date: '2025-11-30', size: '4.5 MB' },
        { id: 3, name: 'FSSAI_Certificate_2025.pdf', type: 'License', date: '2025-01-15', size: '2.8 MB' },
        { id: 4, name: 'Employee_Handbook_v2.pdf', type: 'HR', date: '2025-06-01', size: '3.1 MB' },
    ]);

    return (
        <main className="space-y-6">
            <header className="flex justify-between items-end pb-6 border-b border-[#1F242C]">
                <div>
                    <h1 className="text-2xl font-bold text-white">Documents</h1>
                    <p className="text-zinc-400 text-sm mt-1">Manage invoices, licenses, and reports.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search files..."
                            className="bg-[#161B22] border border-[#1F242C] text-sm text-gray-200 rounded-lg pl-9 pr-4 py-2 focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Folders */}
                {['Invoices', 'Licenses', 'Reports', 'HR'].map((folder) => (
                    <div key={folder} className="bg-[#161B22] border border-[#1F242C] p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:border-emerald-500/50 transition-colors group">
                        <div className="bg-blue-500/10 p-2.5 rounded-lg text-blue-400 group-hover:text-blue-300">
                            <Folder size={24} />
                        </div>
                        <span className="font-medium text-gray-300">{folder}</span>
                    </div>
                ))}
            </div>

            {/* File List */}
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#0d1117] text-zinc-500 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Date Modified</th>
                            <th className="px-6 py-4">Size</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F242C]">
                        {docs.map((doc) => (
                            <tr key={doc.id} className="group hover:bg-[#1F242C]/50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <FileText size={18} className="text-emerald-500" />
                                    <span className="text-sm text-gray-200 font-medium group-hover:text-white">{doc.name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-xs">{doc.type}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-zinc-400">{doc.date}</td>
                                <td className="px-6 py-4 text-sm text-zinc-500">{doc.size}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-zinc-500 hover:text-white p-2 hover:bg-zinc-700 rounded transition-colors">
                                        <Download size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
