// @ts-nocheck

"use client";

import React, { useState, useEffect } from "react";
import { Activity, Box, Circle, User } from "lucide-react";
import clsx from "clsx";
import tailwindMerge from "tailwind-merge";

const VoiceToTextProcurementLogging = () => {
  const [logEntries, setLogEntries] = useState([
    { id: 1, timestamp: new Date().toISOString(), user: "John Doe", action: "Voice-to-text transcription completed" },
    { id: 2, timestamp: new Date().substr(0, 10), user: "Jane Smith", action: "New procurement order received" },
  ]);

  useEffect(() => {
    // Mock data fetching
    const mockData = [
      { id: 3, timestamp: new Date().toISOString(), user: "Mike Johnson", action: "Voice-to-text transcription started" },
      { id: 4, timestamp: new Date().substr(0, 10), user: "Emily White", action: "Procurement order processed" },
    ];
    setLogEntries([...logEntries, ...mockData]);
  }, []);

  return (
    <div className={tailwindMerge("bg-dark-900 text-white p-6 rounded-lg shadow-lg",)}>
      <h2 className="text-xl font-semibold mb-4">Voice-to-Text Procurement Logging</h2>
      <ul className="space-y-2">
        {logEntries.map((entry) => (
          <li
            key={entry.id}
            className={tailwindMerge("bg-dark-700 p-3 rounded-lg flex items-center justify-between",)}
          >
            <div>
              <p className="text-sm font-semibold">{entry.user}</p>
              <p className="text-xs text-gray-400">{entry.action}</p>
            </div>
            <span className={tailwindMerge("text-gray-500")}>{entry.timestamp}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoiceToTextProcurementLogging;