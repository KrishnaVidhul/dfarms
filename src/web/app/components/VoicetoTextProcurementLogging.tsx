jsx
import React, { useState } from 'react';
import { Mic2, XCircle } from 'lucide-react';

const VoiceToTextProcurement = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');

  const startListening = async () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);
      recognition.onerror = (event) => {
        console.error('Error: ' + event.error);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setTranscription(transcript);
      };

      recognition.start();
    } else {
      console.error('SpeechRecognition not supported in this browser.');
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <div className="bg-[#1a1b24] text-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Voice-to-Text Procurement Logging</h2>
      {isListening ? (
        <button
          onClick={stopListening}
          className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          Stop Listening <XCircle className="ml-2 h-5 w-5" />
        </button>
      ) : (
        <button
          onClick={startListening}
          className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          Start Listening <Mic2 className="ml-2 h-5 w-5" />
        </button>
      )}
      {transcription && (
        <div className="mt-4 bg-[#31333d] p-4 rounded-lg shadow-md">
          <p>Transcription:</p>
          <pre className="text-sm">{transcription}</pre>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextProcurement;
