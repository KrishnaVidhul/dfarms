jsx
import { useState, useEffect } from 'react';
import { VoiceRecognition } from 'speech-recognition-api-wrapper';
import LucideMic from 'lucide-react';
import { useTheme } from 'next-themes';

const VoiceToTextProcurement = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);

  const startListening = () => {
    setIsRecording(true);
    VoiceRecognition.startListening();
  };

  const stopListening = () => {
    setIsRecording(false);
    VoiceRecognition.stopListening();
  };

  useEffect(() => {
    VoiceRecognition.onResult((result) => {
      setTranscript(result);
    });

    return () => {
      VoiceRecognition.abortListening();
    };
  }, []);

  return (
    <div className="p-4 bg-gray-800 dark:bg-black rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Voice-to-Text Procurement Logging</h2>
      <div className="flex items-center justify-between border p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition duration-300">
        <button
          onClick={isRecording ? stopListening : startListening}
          className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-full focus:outline-none ${
            isRecording ? 'bg-red-500' : ''
          }`}
        >
          {isRecording ? <LucideMic className="mr-2" /> : <LucideMic className="mr-2 transform rotate-180" />}
          {isRecording ? 'Stop Listening' : 'Start Listening'}
        </button>
      </div>
      <div className="mt-4 p-2 bg-gray-700 dark:bg-gray-600 rounded-lg">
        <p className="text-white font-semibold">Transcript:</p>
        <p className="text-gray-300">{transcript}</p>
      </div>
    </div>
  );
};

export default VoiceToTextProcurement;
