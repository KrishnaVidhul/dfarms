jsx
import React, { useState } from 'react';
import { Mic2 } from 'lucide-react';
import { useTheme } from 'next-themes';

const VoiceToTextProcurementLogging = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { theme } = useTheme();

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        setTranscript(event.results[0][0].transcript);
      };
      recognition.onerror = (event) => {
        console.log('Speech Recognition Error:', event.error);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
      recognition.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Mic access denied. Please give permission.');
    }
  };

  const stopRecording = () => {
    recognition.stop();
  };

  return (
    <div className="bg-[#101213] text-white p-4 rounded-lg shadow-md flex items-center justify-between">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`flex items-center space-x-2 ${
          isRecording ? 'text-red-500' : 'text-green-500'
        }`}
      >
        {isRecording ? (
          <>
            <Mic2 size={18} />
            Stop Recording
          </>
        ) : (
          <>
            <Mic2 size={18} />
            Start Recording
          </>
        )}
      </button>
      <div className="flex items-center space-x-2">
        {transcript && (
          <p className="text-sm font-medium">{transcript}</p>
        )}
      </div>
    </div>
  );
};

export default VoiceToTextProcurementLogging;
