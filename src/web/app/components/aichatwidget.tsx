// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none"
      >
        <MessageCircle size={24} />
      </button>
      {isOpen && (
        <div className="absolute bottom-12 right-4 bg-gray-900 rounded-lg shadow-lg w-full max-w-xs overflow-hidden">
          <div className="bg-gray-800 text-white p-3 border-b border-gray-700">
            AI Chat
          </div>
          <div className="max-h-48 overflow-y-auto p-2 space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className="bg-gray-700 p-2 rounded-lg max-w-sm mx-auto text-center">
                {msg}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-3 space-y-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full p-2 border rounded-lg focus:outline-none"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AiChatWidget;