jsx
import React, { useState } from 'react';
import { HiMicrophone } from 'lucide-react';
import { useTheme } from 'next-themes';

const VoiceToTextLogging = () => {
  const { theme } = useTheme();
  const [transcript, setTranscript] = useState('');

  const startRecording = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Sorry, your browser does not support voice recognition.');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onresult = (event) => {
      const lastResult = event.results.length - 1;
      setTranscript((prevTranscript) => prevTranscript + event.results[lastResult][0].transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      recognition.start();
    };

    recognition.start();
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  return (
    <div
      className={`bg-${theme === 'dark' ? 'gray-900' : 'white'} text-${
        theme === 'dark' ? 'gray-300' : 'gray-800'
      } p-6 rounded-lg shadow-md flex items-center justify-between`}
    >
      <div className="flex flex-col">
        <HiMicrophone size={24} />
        <p className="mt-2">Voice to Text</p>
      </div>
      <button
        onClick={startRecording}
        className={`bg-${
          theme === 'dark' ? 'blue-500' : 'purple-500'
        } text-white px-4 py-2 rounded-full hover:bg-${
          theme === 'dark' ? 'blue-600' : 'purple-600'
        }`}
      >
        Start Recording
      </button>
      <div className="flex flex-col">
        <p className="text-sm">Transcript:</p>
        <pre className="mt-2 bg-${
          theme === 'dark' ? 'gray-800' : 'gray-100'
        } text-${
          theme === 'dark' ? 'gray-300' : 'gray-900'
        } p-2 rounded-lg break-all">
          {transcript}
        </pre>
        <button
          onClick={clearTranscript}
          className={`mt-2 bg-${
            theme === 'dark' ? 'red-500' : 'orange-500'
          } text-white px-4 py-2 rounded-full hover:bg-${
            theme === 'dark' ? 'red-600' : 'orange-600'
          }`}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default VoiceToTextLogging;
