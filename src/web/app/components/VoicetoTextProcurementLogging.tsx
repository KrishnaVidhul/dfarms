jsx
import React, { useState } from 'react';
import { Mic, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

const VoiceToTextProcurementLogging = ({ onTranscription }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let recognition;
    if ('webkitSpeechRecognition' in window) {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event) => console.error('Speech Recognition Error:', event.error);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript.trim())
          .join('');
        setTranscription(transcript);
        onTranscription(transcript);
      };
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, [onTranscription]);

  const startListening = () => {
    if (!isListening && recognition) recognition.start();
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between">
      <button
        onClick={startListening}
        className={`flex items-center space-x-2 ${isListening ? 'text-green-500' : 'text-white'}`}
      >
        <Mic size={16} />
        {isListening ? 'Listening...' : 'Start Listening'}
      </button>
      {transcription && (
        <div className="ml-4 flex items-center space-x-2">
          <CheckCircle2 size={16} fill="#38A169" />
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextProcurementLogging;
