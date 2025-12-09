// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { Activity, Mic } from 'lucide-react';
import clsx from 'clsx';
import tailwindMerge from 'tailwind-merge';

const VoiceToTextProcurement = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    let recognition;

    if ('webkitSpeechRecognition' in window) {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        setTranscript(event.results[0][0].transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
      };
    }

    return () => {
      if (recognition) {
        recognition.onend = null;
        recognition.onerror = null;
      }
    };
  }, []);

  const startRecording = () => {
    if (!isRecording && 'webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.start();
      setIsRecording(true);
      recognition.onresult = (event) => {
        setTranscript(event.results[0][0].transcript);
        recognition.stop();
        setIsRecording(false);
      };
    }
  };

  return (
    <div
      className={tailwindMerge(
        'bg-gray-900 text-white p-4 rounded-lg shadow-md',
        isRecording && 'border border-green-500'
      )}
    >
      <h2 className="text-xl font-bold mb-3">Voice-to-Text Procurement Logging</h2>
      <div className="flex items-center">
        <Mic
          className={clsx(
            'w-6 h-6 mr-2',
            isRecording && 'animate-bounce'
          )}
        />
        <button
          onClick={startRecording}
          disabled={!'webkitSpeechRecognition' in window || isRecording}
          className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition"
        >
          {isRecording ? 'Recording...' : 'Start Recording'}
        </button>
      </div>
      <div className="mt-4">
        <p className="text-gray-300">Transcript:</p>
        <pre>{transcript}</pre>
      </div>
    </div>
  );
};

export default VoiceToTextProcurement;