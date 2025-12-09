jsx
import React, { useState } from 'react';
import { LucideMicrophone2 } from 'lucide-react';
import './VoiceToTextProcurement.css';

const VoiceToTextProcurement = () => {
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

      recognition.onerror = (event) => {
        if (event.error === 'aborted') return;
        console.log(event.error, event.message);
      };

      recognition.start();
      setIsListening(true);
    } else {
      alert('Your browser does not support voice recognition.');
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <div className="p-4 bg-dark-mode rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2">Voice-to-Text Procurement Logging</h3>
      <button
        onClick={isListening ? stopListening : startListening}
        className={`flex items-center px-4 py-2 rounded-full text-white ${
          isListening ? 'bg-red-500' : 'bg-green-500'
        }`}
      >
        {isListening ? (
          <LucideMicrophone2 className="mr-2" />
        ) : (
          <LucideMicrophone2 className="mr-2 rotate-180" />
        )}
        {isListening ? 'Stop' : 'Start'}
      </button>
      <div className="mt-4 p-3 border rounded-lg bg-gray-700">
        <pre className="text-white">{transcript}</pre>
      </div>
    </div>
  );
};

export default VoiceToTextProcurement;


css
/* VoiceToTextProcurement.css */
body {
  background-color: #121212;
  color: white;
}

.bg-dark-mode {
  background-color: #1e1e1e;
}
