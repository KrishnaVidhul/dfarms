jsx
import React, { useState, useEffect } from 'react';
import { HiOutlineMicrophone, HiOutlineStopCircle } from 'lucide-react';

const VoiceToTextProcurement = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  let recognition;

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
      };

      recognition.onerror = (error) => {
        console.error('Speech Recognition error:', error);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    } else {
      console.error('Web Speech API not supported');
    }
  }, []);

  const startRecording = () => {
    if (recognition && !isRecording) {
      setIsRecording(true);
      recognition.start();
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      setIsRecording(false);
      recognition.stop();
    }
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg flex items-center justify-between">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2"
      >
        {isRecording ? (
          <>
            <HiOutlineStopCircle size={16} />
            Stop Recording
          </>
        ) : (
          <>
            <HiOutlineMicrophone size={16} />
            Start Recording
          </>
        )}
      </button>
      <div className="flex-1 text-white pl-4">
        {transcript}
      </div>
    </div>
  );
};

export default VoiceToTextProcurement;
