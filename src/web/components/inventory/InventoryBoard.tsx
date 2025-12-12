'use client';

import { useState, useMemo } from 'react';
import { ArrowRight, Package, Timer, MapPin, AlertCircle, CheckCircle2, Plus, X } from 'lucide-react';
import { addBatch, processBatchAction } from '../../app/actions';

interface Batch {
    id: number;
    batch_code: string;
    commodity_id: number;
    weight_in_kg: number;
    current_stage: string;
    created_at: string;
    location?: string;
    quantity?: number;
}

const TABS = [
    { id: 'RAW', label: 'Raw Material', stages: ['RAW', 'STORED'] },
    { id: 'WIP', label: 'Work in Progress', stages: ['PROCESSING', 'DRYING', 'MILLING'] },
    { id: 'FINISHED', label: 'Finished Goods', stages: ['PACKED', 'PROCESSED'] }
];

export default function InventoryBoard({ batches, commodityId }: { batches: Batch[], commodityId: number }) {
    const [activeTab, setActiveTab] = useState('RAW');
    const [isAddOpen, setAddOpen] = useState(false);
    const [isProcessOpen, setProcessOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [isSubmitting, setSubmitting] = useState(false);

    const filteredBatches = useMemo(() => {
        const tab = TABS.find(t => t.id === activeTab);
        if (!tab) return [];
        return batches.filter(b =>
            tab.stages.includes(b.current_stage?.toUpperCase()) ||
            (activeTab === 'RAW' && !b.current_stage)
        );
    }, [batches, activeTab]);

    const getAge = (dateStr: string) => {
        const date = new Date(dateStr);
        const diff = Date.now() - date.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    async function handleAdd(formData: FormData) {
        setSubmitting(true);
        formData.append('commodityId', commodityId.toString());
        await addBatch(formData);
        setSubmitting(false);
        setAddOpen(false);
    }

    async function handleProcess(formData: FormData) {
        if (!selectedBatch) return;
        setSubmitting(true);
        formData.append('batchId', selectedBatch.id.toString());
        await processBatchAction(formData);
        setSubmitting(false);
        setProcessOpen(false);
        setSelectedBatch(null);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                {/* Tabs */}
                <div className="flex gap-1 bg-[#0d1117] p-1 rounded-lg border border-[#1F242C] w-fit">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === tab.id
                                ? 'bg-[#1F242C] text-white shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <button
                    onClick={() => setAddOpen(true)}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-semibold px-4 py-2 rounded-md transition-colors"
                >
                    <Plus size={16} />
                    Add Stock
                </button>
            </div>

            {/* Add Batch Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 glass-backdrop p-4">
                    <div className="bg-[#161B22] border border-[#1F242C] w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-[#1F242C] bg-[#0d1117]">
                            <h3 className="text-sm font-semibold text-white">Add Incoming Stock</h3>
                            <button onClick={() => setAddOpen(false)} className="text-zinc-400 hover:text-white"><X size={18} /></button>
                        </div>
                        <form action={handleAdd} className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">Quantity (kg)</label>
                                <input type="number" name="quantity" min="1" required className="w-full bg-[#0d1117] border border-[#1F242C] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. 5000" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">Purchase Price (₹/kg)</label>
                                <input type="number" name="price" min="0.1" step="0.01" required className="w-full bg-[#0d1117] border border-[#1F242C] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. 85.50" />
                            </div>
                            <button
                                disabled={isSubmitting}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-2 rounded-md transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Adding...' : 'Confirm Entry'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Process Batch Modal */}
            {isProcessOpen && selectedBatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 glass-backdrop p-4">
                    <div className="bg-[#161B22] border border-[#1F242C] w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-[#1F242C] bg-[#0d1117]">
                            <h3 className="text-sm font-semibold text-white">Complete Processing</h3>
                            <button onClick={() => { setProcessOpen(false); setSelectedBatch(null); }} className="text-zinc-400 hover:text-white"><X size={18} /></button>
                        </div>
                        <div className="p-4 bg-blue-900/10 border-b border-blue-500/20">
                            <p className="text-xs text-blue-200">Processing Batch <strong>{selectedBatch.batch_code}</strong>. Input = {selectedBatch.weight_in_kg}kg.</p>
                        </div>
                        <form action={handleProcess} className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">Final Output Quantity (kg)</label>
                                <input
                                    type="number"
                                    name="outputQty"
                                    max={selectedBatch.weight_in_kg} // Yield cant exceed 100% usually
                                    min="1"
                                    required
                                    className="w-full bg-[#0d1117] border border-[#1F242C] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    placeholder={`Max ${selectedBatch.weight_in_kg}`}
                                />
                                <p className="text-[10px] text-zinc-500 mt-1">This will confirm the batch as Finished Goods.</p>
                            </div>
                            <button
                                disabled={isSubmitting}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Processing...' : 'Complete & Calculate Yield'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="bg-[#161B22] border border-[#1F242C] rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#0d1117] text-xs font-semibold text-zinc-500 uppercase">
                        <tr>
                            <th className="px-6 py-4">Batch ID</th>
                            <th className="px-6 py-4">Quantity</th>
                            <th className="px-6 py-4">Stage</th>
                            <th className="px-6 py-4">Age</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F242C] text-sm">
                        {filteredBatches.map(batch => (
                            <tr key={batch.id} className="hover:bg-[#1F242C]/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-zinc-300">{batch.batch_code}</td>
                                <td className="px-6 py-4 font-mono text-emerald-400 font-medium">
                                    {(batch.quantity || batch.weight_in_kg).toLocaleString()} kg
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${batch.current_stage === 'DRYING' ? 'bg-amber-500/10 text-amber-500' :
                                        ['PACKED', 'PROCESSED'].includes(batch.current_stage || '') ? 'bg-blue-500/10 text-blue-500' :
                                            'bg-zinc-800 text-zinc-400'
                                        }`}>
                                        {batch.current_stage || 'RAW'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-zinc-400">
                                    <div className="flex items-center gap-2">
                                        <Timer className="w-3 h-3" />
                                        {getAge(batch.created_at)} days
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {activeTab !== 'FINISHED' && (
                                        <button
                                            onClick={() => { setSelectedBatch(batch); setProcessOpen(true); }}
                                            className="inline-flex items-center gap-1 text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded transition-colors border border-blue-500/20"
                                        >
                                            Process <ArrowRight className="w-3 h-3" />
                                        </button>
                                    )}
                                    {activeTab === 'FINISHED' && (
                                        <span className="text-emerald-500 text-xs">Completed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredBatches.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-zinc-600">
                                    <Package className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    No batches found in {activeTab} stage.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
