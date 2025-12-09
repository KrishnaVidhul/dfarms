// @ts-nocheck

import React, { useState } from 'react';
import { Activity, Mic } from 'lucide-react';
import clsx from 'clsx';

export default function VoiceToTextProcurementLogging() {
  const [transcript, setTranscript] = useState('');

  const handleVoiceInput = async (event) => {
    event.preventDefault();
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcriptBuffer = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setTranscript(transcriptBuffer);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.onend = () => {
        // You can add your logic here to send the transcript for logging
      };

      recognition.start();
    } else {
      alert('Sorry, your browser does not support speech recognition.');
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Voice-to-Text Procurement Logging</h2>
      <button
        onClick={handleVoiceInput}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Start Recording
      </button>
      {transcript && (
        <div className="mt-4 bg-gray-800 p-3 rounded">
          <p className="font-semibold">Transcript:</p>
          <pre>{transcript}</pre>
        </div>
      )}
    </div>
  );
}