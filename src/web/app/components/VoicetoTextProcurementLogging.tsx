jsx
import React, { useState, useEffect } from 'react';
import { Mic, CheckCircle2 } from 'lucide-react';

const VoiceToTextProcurementLogging = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    let recognition;

    if ('webkitSpeechRecognition' in window) {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        setText(transcript);
      };
      recognition.onerror = (error) => {
        console.error('Error occurred during speech recognition:', error);
      };
    } else if ('SpeechRecognition' in window) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        setText(transcript);
      };
      recognition.onerror = (error) => {
        console.error('Error occurred during speech recognition:', error);
      };
    }

    if (recognition) {
      recognition.onend = () => setIsRecording(false);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (!isRecording && 'webkitSpeechRecognition' in window) {
      setIsRecording(true);
      recognition.start();
    } else if (!isRecording && 'SpeechRecognition' in window) {
      setIsRecording(true);
      recognition.start();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognition.stop();
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        {text ? (
          <p className="font-semibold">{text}</p>
        ) : (
          <p className="opacity-75">Start speaking...</p>
        )}
      </div>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
      >
        {isRecording ? (
          <>
            <Mic className="mr-2" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="mr-2" />
            Start Recording
          </>
        )}
      </button>
    </div>
  );
};

export default VoiceToTextProcurementLogging;
