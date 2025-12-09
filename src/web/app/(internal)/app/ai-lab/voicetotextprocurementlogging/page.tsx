// @ts-nocheck

import React, { useState } from 'react';
import { LucideMicrophone2 } from 'lucide-react';

const VoiceToTextProcurementLogging = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Web Speech API is not supported by your browser.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
    };

    recognition.start();
  };

  const stopListening = () => {
    if ('webkitSpeechRecognition' in window) {
      (window as any).webkitSpeechRecognition.stop();
    }
    setIsListening(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <button
        onClick={isListening ? stopListening : startListening}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {isListening ? <LucideMicrophone2 className="w-6 h-6 mr-2" /> : 'Start Listening'}
      </button>
      {transcript && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <p>Transcript:</p>
          <pre className="text-white">{transcript}</pre>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextProcurementLogging;