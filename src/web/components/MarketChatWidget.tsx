'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, TrendingUp, DollarSign, BarChart3, Package, Box, AlertCircle, CheckCircle2 } from 'lucide-react';

// Type definitions
type MessageType = 'text' | 'market_card' | 'inventory_card' | 'loading';
type Sender = 'user' | 'agent';

interface Message {
    id: string;
    text: string;
    sender: Sender;
    type: MessageType;
    data?: any;
    timestamp: Date;
}

interface InventoryItem {
    id: number;
    batch_id: string;
    pulse_type: string;
    grade: string;
    weight_kg: string;
    status: string;
    updated_at: string;
}

export default function MarketChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: "Hi! I'm your D-Farms Assistant. I can help you with Market Intelligence and Inventory management.",
            sender: 'agent',
            type: 'text',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Auto-scroll
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    const addMessage = (text: string, sender: Sender, type: MessageType = 'text', data?: any) => {
        setMessages(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            text,
            sender,
            type,
            data,
            timestamp: new Date()
        }]);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        addMessage(userMsg, 'user');
        setInput("");
        setIsLoading(true);

        try {
            const lowerMsg = userMsg.toLowerCase();

            // Intention Detection
            const isInventoryIntent = lowerMsg.includes('inventory') || lowerMsg.includes('stock') || lowerMsg.includes('quantity') || lowerMsg.includes('batch') || lowerMsg.includes('do we have') || lowerMsg.includes('check for');
            const isMarketIntent = lowerMsg.includes('price') || lowerMsg.includes('market') || lowerMsg.includes('trend') || lowerMsg.includes('forecast') || lowerMsg.includes('buy') || lowerMsg.includes('sell');

            // Commodity Detection
            const commodities = [
                'wheat', 'rice', 'bajra', 'tur dal', 'masur dal', 'moong', 'chana', 'toor',
                'urad', 'sugar', 'jowar', 'maize', 'soybean', 'cotton'
            ];
            const sortedCommodities = [...commodities].sort((a, b) => b.length - a.length);
            const containedCommodity = sortedCommodities.find(c => new RegExp(`\\b${c}\\b`, 'i').test(lowerMsg));

            // Logic:
            // 1. Explicit Inventory Intent OR (No Market Intent AND Commodity mentioned -> Assume Inventory/Stock check)
            const isInventoryQuery = isInventoryIntent || (!isMarketIntent && containedCommodity);

            // 2. Explicit Market Intent
            const isMarketQuery = isMarketIntent;

            // 1. Inventory Handling
            if (isInventoryQuery) {
                // Conversational wrapper
                const wrappers = [
                    "Let me check the warehouse data for you...",
                    "Accessing real-time inventory records...",
                    "Checking our current stock levels..."
                ];
                addMessage(wrappers[Math.floor(Math.random() * wrappers.length)], 'agent');

                // Fetch data
                const res = await fetch('/api/inventory');
                const data = await res.json();

                if (data.inventory) {
                    let items: InventoryItem[] = data.inventory;

                    // Filter if specific commodity mentioned
                    if (containedCommodity) {
                        items = items.filter(i => i.pulse_type.toLowerCase().includes(containedCommodity));
                    }

                    if (items.length > 0) {
                        addMessage(`Found ${items.length} relevant batch${items.length === 1 ? '' : 'es'}:`, 'agent', 'inventory_card', { items, filter: containedCommodity });
                    } else {
                        addMessage(`I couldn't find any stock matching "${containedCommodity || 'your query'}".`, 'agent');
                    }
                } else {
                    addMessage("I'm having trouble accessing inventory records right now.", 'agent');
                }
            }
            // 2. Market Handling
            else if (isMarketQuery) {
                // Commodity detection is already done above
                const matchedCommodity = containedCommodity;

                if (matchedCommodity) {
                    // Conversational wrapper
                    const wrappers = [
                        `Analyzing market trends for ${matchedCommodity}...`,
                        `Pulling latest price data for ${matchedCommodity}...`,
                        `Here is the market intelligence report for ${matchedCommodity}...`
                    ];
                    addMessage(wrappers[Math.floor(Math.random() * wrappers.length)], 'agent');

                    const res = await fetch(`/api/insights?commodity=${matchedCommodity}`);
                    const data = await res.json();

                    if (data.insights && data.insights.length > 0) {
                        addMessage('Market Analysis:', 'agent', 'market_card', data.insights[0]);
                    } else {
                        addMessage(`I don't have recent data for ${matchedCommodity}.`, 'agent');
                    }
                } else {
                    addMessage("Which commodity are you interested in? I can check Wheat, Rice, Tur Dal, and more.", 'agent');
                }
            }
            // 3. Help / Greeting
            else if (lowerMsg.includes('help') || lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
                addMessage(
                    "I can help you with:\n\n" +
                    "📊 **Market Intelligence**\n'Price of wheat', 'Rice trends', 'Should I buy Tur Dal?'\n\n" +
                    "📦 **Inventory Management**\n'Show inventory', 'Stock of Chana', 'Check warehouse'",
                    'agent'
                );
            }
            // 4. Default Fallback
            else {
                addMessage("I understand market prices and inventory. Try asking 'Show inventory' or 'Wheat price'.", 'agent');
            }

        } catch (err) {
            console.error(err);
            addMessage("Sorry, I encountered an error while processing your request.", 'agent');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full p-3 shadow-2xl transition-all hover:scale-105 border border-emerald-400/30 overflow-hidden w-12 hover:w-48 h-12 whitespace-nowrap"
                    style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}
                >
                    <MessageCircle className="w-6 h-6 shrink-0 group-hover:rotate-12 transition-transform" />
                    <span className="font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">D-Farms Assistant</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden transition-all h-[600px] backdrop-blur-md">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-900/90 to-teal-900/90 p-4 border-b border-gray-700/50 flex justify-between items-center backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-100 flex items-center gap-2 text-sm">
                                    D-Farms Assistant
                                </h3>
                                <p className="text-[10px] text-emerald-200/80 uppercase tracking-wider font-semibold">Online • AI Agent</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900 to-black/90 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[90%] ${msg.sender === 'user' ? 'ml-8' : 'mr-2'}`}>
                                    {/* Text Bubble */}
                                    {msg.type === 'text' && (
                                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                            ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-br-sm'
                                            : 'bg-gray-800/80 border border-gray-700 text-gray-200 rounded-bl-sm'
                                            }`}>
                                            <div className="whitespace-pre-line">{msg.text}</div>
                                        </div>
                                    )}

                                    {/* Market Card */}
                                    {msg.type === 'market_card' && msg.data && (
                                        <div className="bg-gray-800/90 border border-emerald-500/30 rounded-xl overflow-hidden shadow-lg mt-1">
                                            <div className="p-3 bg-emerald-900/20 border-b border-emerald-500/10 flex justify-between items-center">
                                                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                                                    <TrendingUp className="w-3.5 h-3.5" /> {msg.data.commodity}
                                                </span>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${msg.data.recommendation === 'BUY' ? 'bg-green-500/20 text-green-400' :
                                                    msg.data.recommendation === 'SELL' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {msg.data.recommendation}
                                                </span>
                                            </div>
                                            <div className="p-4 space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-xs text-gray-400 mb-0.5">Current Price</p>
                                                        <p className="text-xl font-bold text-white">₹{parseFloat(msg.data.current_price).toFixed(2)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-400 mb-0.5">Confidence</p>
                                                        <p className="text-sm font-medium text-emerald-300">{msg.data.confidence_score}%</p>
                                                    </div>
                                                </div>

                                                {msg.data.multi_factor_analysis && (
                                                    <div className="space-y-1.5 pt-2 border-t border-gray-700/50">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-400">Analysis Score</span>
                                                            <span className="text-gray-300 font-mono">{msg.data.multi_factor_analysis.combined_score > 0 ? '+' : ''}{msg.data.multi_factor_analysis.combined_score}</span>
                                                        </div>
                                                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden flex">
                                                            <div
                                                                className={`h-full ${msg.data.multi_factor_analysis.combined_score > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                                style={{ width: `${Math.min(Math.abs(msg.data.multi_factor_analysis.combined_score), 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="space-y-1 pt-1">
                                                    {msg.data.key_factors.slice(0, 2).map((factor: string, i: number) => (
                                                        <div key={i} className="flex gap-2 items-start text-xs text-gray-300">
                                                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                            <span>{factor}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Inventory Card */}
                                    {msg.type === 'inventory_card' && msg.data && (
                                        <div className="bg-gray-800/90 border border-blue-500/30 rounded-xl overflow-hidden shadow-lg mt-1">
                                            <div className="p-3 bg-blue-900/20 border-b border-blue-500/10 flex justify-between items-center">
                                                <span className="font-bold text-blue-400 flex items-center gap-1.5">
                                                    <Package className="w-3.5 h-3.5" /> Warehouse Stock
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {msg.data.items.length} Batch{msg.data.items.length !== 1 ? 'es' : ''}
                                                </span>
                                            </div>
                                            <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
                                                {msg.data.items.map((item: InventoryItem) => (
                                                    <div key={item.id} className="p-3 border-b border-gray-700/50 hover:bg-white/5 transition-colors">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="font-medium text-gray-200">{item.pulse_type}</span>
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${item.status === 'Raw' ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' :
                                                                item.status === 'Processing' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
                                                                    'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                                                                }`}>
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-xs text-gray-400">
                                                            <span>{item.weight_kg} kg</span>
                                                            <span className="font-mono">{item.batch_id}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-2 bg-gray-900/30 border-t border-gray-700/50 text-center">
                                                <p className="text-[10px] text-gray-500">Total Quantity: {msg.data.items.reduce((acc: number, item: InventoryItem) => acc + parseFloat(item.weight_kg), 0).toFixed(0)} kg</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className={`text-[10px] mt-1 text-gray-500 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                        {msg.sender === 'user' ? 'You' : 'Assistant'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-800/80 border border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="px-4 py-3 bg-gray-900/80 border-t border-gray-800 flex gap-2 overflow-x-auto backdrop-blur-sm scrollbar-hide">
                        <button
                            onClick={() => setInput("What's the price of wheat?")}
                            className="flex-shrink-0 text-xs px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded-full border border-gray-700 hover:border-emerald-500/50 transition-all"
                        >
                            <DollarSign className="w-3 h-3 inline mr-1 text-emerald-500" />
                            Wheat Price
                        </button>
                        <button
                            onClick={() => setInput("Show inventory")}
                            className="flex-shrink-0 text-xs px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded-full border border-gray-700 hover:border-blue-500/50 transition-all"
                        >
                            <Package className="w-3 h-3 inline mr-1 text-blue-500" />
                            Inventory
                        </button>
                        <button
                            onClick={() => setInput("Market trends for rice")}
                            className="flex-shrink-0 text-xs px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded-full border border-gray-700 hover:border-purple-500/50 transition-all"
                        >
                            <TrendingUp className="w-3 h-3 inline mr-1 text-purple-500" />
                            Rice Trends
                        </button>
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-gray-900 border-t border-gray-700/50 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about details..."
                            className="flex-1 bg-gray-800/50 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 border border-gray-700 placeholder-gray-600 transition-all hover:bg-gray-800"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2.5 transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
