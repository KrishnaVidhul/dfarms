'use client';

import { useState } from 'react';
import { Terminal, PenTool, Bug, Lightbulb, X, Send } from 'lucide-react';

export default function TaskAssignment() {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const templates = [
        {
            id: 'feature',
            icon: Lightbulb,
            label: 'New Feature',
            color: 'text-yellow-400',
            text: "As a [User Role], I want [Feature Name] so that [Benefit/Value].\n\nAcceptance Criteria:\n1. \n2. "
        },
        {
            id: 'ui',
            icon: PenTool,
            label: 'UI Polish',
            color: 'text-blue-400',
            text: "The [Page/Component] looks unprofessional.\n\nPlease update the [Element] to match [Style/Reference].\n\nCurrent issue: "
        },
        {
            id: 'bug',
            icon: Bug,
            label: 'Bug Report',
            color: 'text-red-400',
            text: "When I click [Button/Link], nothing happens (or unexpected behavior).\n\nExpected: [Expected Result]\nActual: [Actual Result]\n\nSteps to reproduce:\n1. "
        }
    ];

    const applyTemplate = (tpl: typeof templates[0]) => {
        setSelectedTemplate(tpl.id);
        setPrompt(tpl.text);
    };

    const handleSubmit = async () => {
        // In a real app, this would POST to an API or Agent endpoint
        console.log("Dispatching task:", prompt);
        alert("Task dispatched to Agent Queue! (Simulation)");
        setIsOpen(false);
        setPrompt('');
        setSelectedTemplate(null);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
            >
                <Terminal size={16} />
                Assign Work
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 w-full max-w-2xl border border-zinc-700 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-zinc-800">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Terminal className="text-emerald-500" />
                                    Agent Command Center
                                </h2>
                                <p className="text-zinc-400 text-sm mt-1">Dispatch tasks to your AI workforce</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto flex-1">

                            {/* Templates */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                {templates.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => applyTemplate(t)}
                                        className={`p-4 rounded-lg border text-left transition-all ${selectedTemplate === t.id
                                                ? 'bg-zinc-800 border-emerald-500 ring-1 ring-emerald-500'
                                                : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900'
                                            }`}
                                    >
                                        <t.icon className={`mb-3 ${t.color}`} size={24} />
                                        <div className="font-semibold text-zinc-200 text-sm">{t.label}</div>
                                    </button>
                                ))}
                            </div>

                            {/* Text Area */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Task Details</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="w-full h-48 bg-black border border-zinc-700 rounded-lg p-4 text-zinc-300 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none placeholder-zinc-700"
                                    placeholder="Describe the task for the agent..."
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-900 rounded-b-xl">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!prompt.trim()}
                                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
                            >
                                <Send size={16} />
                                Dispatch Agent
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
