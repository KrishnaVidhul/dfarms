'use client';

import { useState } from 'react';
import { Upload, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { submitQualityTest } from '../../app/actions';

interface Batch {
    id: number;
    batch_code: string;
    commodity_name: string;
    current_stage: string;
}

export default function QualityTestForm({ batches }: { batches: Batch[] }) {
    const [selectedBatch, setSelectedBatch] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ message?: string; error?: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setResult(null);

        try {
            const res = await submitQualityTest(formData);
            setResult(res);
            if (res.message) {
                // Reset form optionally or keep for review
            }
        } catch (e) {
            setResult({ error: 'Unexpected error occurred' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-6">New Quality Test</h2>

            <form action={handleSubmit} className="space-y-6">

                {/* Batch Selector */}
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Select Batch</label>
                    <select
                        name="batchId"
                        required
                        className="w-full bg-[#0d1117] border border-[#1F242C] text-zinc-200 rounded-md py-2 px-3 focus:outline-none focus:border-emerald-500/50"
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                    >
                        <option value="">-- Select a Batch --</option>
                        {batches.map(b => (
                            <option key={b.id} value={b.id}>
                                {b.batch_code} ({b.commodity_name}) - {b.current_stage}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left: Manual Entry */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider border-b border-[#1F242C] pb-2">Manual Entry</h3>

                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Moisture %</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="moisture"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    required
                                    className="w-full bg-[#0d1117] border border-[#1F242C] text-white rounded p-2 text-sm focus:border-emerald-500"
                                    placeholder="e.g. 11.5"
                                />
                                <span className="absolute right-3 top-2 text-zinc-600 text-xs">%</span>
                            </div>
                            <p className="text-[10px] text-zinc-600 mt-1">Threshold: &gt;12% triggers drying</p>
                        </div>

                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Foreign Matter %</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="foreignMatter"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    required
                                    className="w-full bg-[#0d1117] border border-[#1F242C] text-white rounded p-2 text-sm focus:border-emerald-500"
                                    placeholder="e.g. 1.2"
                                />
                                <span className="absolute right-3 top-2 text-zinc-600 text-xs">%</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-zinc-400 mb-1">Admixture %</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="admixture"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    className="w-full bg-[#0d1117] border border-[#1F242C] text-white rounded p-2 text-sm focus:border-emerald-500"
                                    placeholder="e.g. 0.5"
                                />
                                <span className="absolute right-3 top-2 text-zinc-600 text-xs">%</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: AI Verification (Upload) */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider border-b border-[#1F242C] pb-2">AI Verification</h3>

                        <div className="border-2 border-dashed border-[#1F242C] rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-[#1F242C]/30 transition-colors cursor-pointer group">
                            <Upload className="w-8 h-8 text-zinc-600 group-hover:text-emerald-500 mb-3 transition-colors" />
                            <p className="text-zinc-400 text-sm font-medium">Upload Sample Image</p>
                            <p className="text-zinc-600 text-xs mt-1">AI will analyze grain quality</p>
                        </div>

                        <div className="bg-[#0d1117] p-3 rounded border border-[#1F242C] flex items-start gap-3 opacity-60">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-zinc-600" />
                            <p className="text-xs text-zinc-500">AI verification is currently in beta mode. Manual inputs will override AI suggestions.</p>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-[#1F242C] flex items-center justify-between">
                    <div>
                        {result?.message && (
                            <div className="flex items-center gap-2 text-emerald-400 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                {result.message}
                            </div>
                        )}
                        {result?.error && (
                            <div className="flex items-center gap-2 text-red-400 text-sm">
                                <AlertTriangle className="w-4 h-4" />
                                {result.error}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !selectedBatch}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Submitting...' : 'Submit Test Results'}
                    </button>
                </div>
            </form>
        </div>
    );
}
