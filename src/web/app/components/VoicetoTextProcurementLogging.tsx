jsx
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceToTextProcurement = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        setTranscript(event.results[0][0].transcript);
      };

      recognition.onerror = (error) => {
        console.error('Recognition error:', error);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      navigator.mediaDevices.getUserMedia({ audio: false });
    }
    setIsRecording(false);
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`flex items-center space-x-2 ${isRecording ? 'text-red-500' : 'text-green-500'} hover:text-white transition`}
      >
        {isRecording ? <MicOff size="1.5rem" /> : <Mic size="1.5rem" />}
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div className="flex flex-col">
        <p className="text-lg font-semibold">Transcript:</p>
        <p className="text-base">{transcript}</p>
      </div>
    </div>
  );
};

export default VoiceToTextProcurement;
