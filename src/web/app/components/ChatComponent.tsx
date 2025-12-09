'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatComponent() {
    const [command, setCommand] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e?: React.FormEvent, cmdOverride?: string) => {
        if (e) e.preventDefault();
        const cmdToSend = cmdOverride || command;
        if (!cmdToSend.trim()) return;

        setIsSending(true);
        setStatus('Processing request...');

        try {
            const res = await fetch('/api/command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: cmdToSend }),
            });

            if (res.ok) {
                setStatus('Command sent! Refreshing data...');
                setCommand('');
                // Wait a moment for the agent to process (mock delay if needed, or real IPC speed)
                // Then refresh the server components
                setTimeout(() => {
                    router.refresh();
                    setStatus('Dashboard Updated.');
                    setTimeout(() => setStatus(null), 3000);
                }, 2000);
            } else {
                setStatus('Failed to send command.');
            }
        } catch (error) {
            console.error(error);
            setStatus('Error sending command.');
        } finally {
            setIsSending(false);
        }
    };

    const handleQuickAction = (action: string) => {
        // Map visual chips to actual agent prompts
        const prompts: Record<string, string> = {
            'Buy Stock': 'Find price of Chana in Akola', // Example default action
            'Sell Stock': 'Sell 100kg Chana',
            'Check Grade': 'Check compliance for FSSAI',
            'Price Check': 'Find price of Tur Dal'
        };
        const cmd = prompts[action] || action;
        setCommand(cmd);
        // Optional: Auto-submit or let user edit? Let's auto-submit for "Quick" action feel
        // But maybe safer to just populate. User said "nothing happens", implying they expect action.
        // Let's populate and focus for now, or auto-submit if it's safe. 
        // For 'Price Check' auto-submit is fine. For 'Sell', maybe dangerous.
        // Let's Just Populate for safety, but give visual feedback.
        // ACTUALLY, User said "nothing happens". They likely expect it to DO something.
        // Let's auto-submit SAFE read-only queries, populate unsafe ones.

        if (action.includes('Check') || action.includes('Price')) {
            handleSubmit(undefined, cmd);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Smart Filter Chips moved here */}
            <div className="px-6 pt-4 flex gap-2 overflow-x-auto text-xs pb-4 border-b border-gray-800/50">
                <span className="text-gray-500 font-mono py-1">QUICK ACTIONS:</span>
                <button onClick={() => handleQuickAction('Buy Stock')} className="px-3 py-1 bg-emerald-900/30 border border-emerald-800 text-emerald-400 rounded-full hover:bg-emerald-800/50 transition">Buy Stock</button>
                <button onClick={() => handleQuickAction('Sell Stock')} className="px-3 py-1 bg-blue-900/30 border border-blue-800 text-blue-400 rounded-full hover:bg-blue-800/50 transition">Sell Stock</button>
                <button onClick={() => handleQuickAction('Check Grade')} className="px-3 py-1 bg-purple-900/30 border border-purple-800 text-purple-400 rounded-full hover:bg-purple-800/50 transition">Check Compliance</button>
                <button onClick={() => handleQuickAction('Price Check')} className="px-3 py-1 bg-orange-900/30 border border-orange-800 text-orange-400 rounded-full hover:bg-orange-800/50 transition">Price Check</button>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-end">
                {/* Status / Processing Indicator */}
                {status && (
                    <div className={`mb-4 p-3 rounded-lg flex items-center gap-3 ${status.includes('Failed') || status.includes('Error') ? 'bg-red-900/20 text-red-400 border border-red-800' : 'bg-gray-800 border border-gray-700 text-green-400'}`}>
                        {isSending ? (
                            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        <span className="text-sm font-mono">{status}</span>
                    </div>
                )}

                <form onSubmit={(e) => handleSubmit(e)} className="flex gap-4">
                    <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="Ask the agent (e.g., 'Add 100kg Chana' or 'Find Tur Dal Price')"
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                        disabled={isSending}
                    />
                    <button
                        type="submit"
                        disabled={isSending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSending ? 'Processing...' : 'Send'}
                        {!isSending && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                    </button>
                </form>
            </div>
        </div>
    );
}
