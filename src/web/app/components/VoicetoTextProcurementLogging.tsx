jsx
import React, { useState } from 'react';
import { LuMicrophone2 } from 'lucide-react';

const VoiceToTextProcurement = () => {
  const [transcript, setTranscript] = useState('');

  const handleVoiceCommand = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Web Speech API is not supported by your browser.');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      // Here you can add the logic to process the voice command and log it
    };

    recognition.onerror = (event) => {
      console.error('Error occurred: ', event.error);
    };

    recognition.onend = () => {
      console.log('Speech recognition service disconnected');
    };

    recognition.start();
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-md shadow-lg">
      <h2 className="text-xl font-bold mb-2">Voice-to-Text Procurement Logging</h2>
      <button
        onClick={handleVoiceCommand}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
      >
        <LuMicrophone2 className="mr-2" />
        Record Voice Command
      </button>
      {transcript && (
        <div className="mt-4 bg-gray-800 p-3 rounded-lg">
          <p>Transcript:</p>
          <pre>{transcript}</pre>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextProcurement;
