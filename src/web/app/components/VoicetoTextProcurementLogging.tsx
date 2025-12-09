jsx
import React, { useState } from 'react';
import { Mic2, CheckCircle2 } from 'lucide-react';
import 'tailwindcss/tailwind.css';

const VoiceToTextProcurementLogging = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  const startRecording = async () => {
    try {
      if (!('webkitSpeechRecognition' in window)) {
        alert('Web Speech API is not supported by your browser.');
        return;
      }

      const permissionResult = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      setIsRecording(true);

      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscription(transcript);
      };

      recognition.onerror = (error) => {
        if (error.name === 'NotAllowedError') {
          alert('Please grant microphone permission.');
        } else {
          console.error('Speech recognition error:', error);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.stop();
    }

    setIsRecording(false);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-white mb-4">Voice-to-Text Procurement Logging</h2>
      {isRecording ? (
        <button
          onClick={stopRecording}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Stop Recording
        </button>
      ) : hasPermission ? (
        <button
          onClick={startRecording}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Start Recording <Mic2 className="ml-2 h-4 w-4" />
        </button>
      ) : (
        <p className="text-red-500">Please grant microphone permission.</p>
      )}
      {transcription && (
        <div className="mt-4 bg-gray-700 p-3 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Transcription</h3>
          <p className="text-white">{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextProcurementLogging;
