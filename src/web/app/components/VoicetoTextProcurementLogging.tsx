import React, { useState } from 'react';
import { MicIcon } from 'lucide-react';

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

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      setIsListening(true);
    } else {
      alert('Your browser does not support speech recognition.');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      startListening();
    }
  };

  return (
    <div className="bg-[#1e293b] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Voice-to-Text Procurement Logging</h2>
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Type or speak your procurement details here..."
        className="w-full p-2 text-white bg-[#374151] rounded-lg shadow-sm focus:outline-none"
        onKeyPress={handleKeyPress}
      />
      <button
        onClick={startListening}
        disabled={isListening}
        className={`mt-4 py-2 px-4 font-semibold rounded-lg ${
          isListening ? 'bg-[#4b5563] pointer-events-none' : 'bg-[#5f7280]'
        }`}
      >
        {isListening ? <MicIcon className="mr-2" /> : ''}
        {isListening ? 'Listening...' : 'Start Listening'}
      </button>
    </div>
  );
};

export default VoiceToTextLogging;