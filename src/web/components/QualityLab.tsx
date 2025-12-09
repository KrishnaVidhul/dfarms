
'use client';

import { useState } from 'react';

export default function QualityLab() {
    const [uploadstatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
    const [result, setResult] = useState<any>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show Preview
        setImagePreview(URL.createObjectURL(file));
        setUploadStatus('uploading');

        const formData = new FormData();
        formData.append('file', file);

        try {
            // 1. Upload File
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            setUploadStatus('processing');

            // 2. Poll for Results (Implementation TBD - for now just showing success)
            // Ideally, the upload trigger sends a message to IPC, and we poll an endpoint.
            // But for this MVP, let's assume the API waits for the agent (slow) or just confirms upload.

            // Since we want immediate feedback, we might need the API to actually CALL the agent synchronously 
            // or we poll. Agent might be slow with Vision models.
            // Let's rely on the API returning the result if it waits, or a separate polling mechanism.
            // Given the architecture, the Agent reads IPC. Validating that via HTTP is tricky without a loop.
            // Let's simplisticly wait for the API response which we will code to wait for IPC response.

            setResult(data.analysis);
            setUploadStatus('done');

        } catch (err) {
            console.error(err);
            setUploadStatus('error');
        }
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Area */}
                <div>
                    <h3 className="text-lg font-medium mb-4 text-gray-300">Upload Sample</h3>

                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded shadow-md" />
                        ) : (
                            <div className="text-gray-400">
                                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-2 text-sm">Drag and drop or click to upload</p>
                            </div>
                        )}
                    </div>

                    {uploadstatus === 'uploading' && <p className="mt-2 text-blue-400 text-sm animate-pulse">Uploading...</p>}
                    {uploadstatus === 'processing' && <p className="mt-2 text-yellow-400 text-sm animate-pulse">Agent Analyzing (This may take 10-20s)...</p>}
                    {uploadstatus === 'error' && <p className="mt-2 text-red-400 text-sm">Analysis failed. Please try again.</p>}
                </div>

                {/* Results Area */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 flex flex-col justify-center min-h-[250px]">
                    {uploadstatus === 'done' && result ? (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-gray-400 font-medium uppercase text-xs tracking-wider">Quality Grade</h4>
                                <span className={`text-4xl font-bold ${result.grade === 'A' ? 'text-green-400' : result.grade === 'B' ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {result.grade}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-400 text-sm">Broken Grains</span>
                                    <span className="text-gray-200 font-mono">{result.defects?.broken}%</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-400 text-sm">Discoloration</span>
                                    <span className="text-gray-200 font-mono">{result.defects?.discoloration}</span>
                                </div>
                                <div className="mt-4 bg-gray-800 p-3 rounded text-sm text-gray-300 italic">
                                    "{result.defects?.summary || 'No summary provided.'}"
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            {uploadstatus === 'processing' ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span>Vision Model is thinking...</span>
                                </div>
                            ) : (
                                <span>Ready for Analysis</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
