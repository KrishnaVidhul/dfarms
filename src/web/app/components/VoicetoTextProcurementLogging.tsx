jsx
import React, { useState } from 'react';
import { Mic2 } from 'lucide-react';

const VoiceToTextLogging = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = async () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        setTranscript(event.results[0][0].transcript);
      };

      recognition.onerror = (error) => {
        console.error('Error:', error.message);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Sorry, your browser does not support speech recognition.');
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <div className="p-4 bg-zinc-800 text-white rounded-md shadow-lg">
      <h2 className="text-xl font-bold mb-3">Voice-to-Text Procurement Logging</h2>
      <button
        onClick={isListening ? stopListening : startListening}
        className={`flex items-center justify-center w-full py-2 px-4 bg-teal-500 text-white rounded-md transition-colors ${
          isListening ? 'bg-teal-700' : ''
        }`}
      >
        {isListening ? (
          <span>Stop Listening</span>
        ) : (
          <>
            <Mic2 className="mr-2 h-4 w-4" />
            <span>Start Listening</span>
          </>
        )}
      </button>
      <div className="mt-4 bg-zinc-700 rounded-lg p-3">
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default VoiceToTextLogging;
