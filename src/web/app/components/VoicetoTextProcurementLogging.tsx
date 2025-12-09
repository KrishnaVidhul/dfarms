jsx
import React, { useState } from 'react';
import { Mic2 } from 'lucide-react';
import { useTheme } from 'next-themes';

const VoiceToTextLogging = () => {
  const { theme } = useTheme();
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const recordAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let audioChunks = [];

      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        transcribeAudio(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, 30000); // Record for 30 seconds
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const transcribeAudio = async (audioUrl) => {
    try {
      const response = await fetch(`/api/transcribe?audioUrl=${audioUrl}`);
      const data = await response.json();
      setTranscript(data.transcription);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  return (
    <div className={`p-6 bg-${theme === 'dark' ? 'gray-800' : 'white'} rounded-lg shadow-md flex items-center space-x-4 transition-colors duration-300 ease-in-out hover:bg-gray-700 dark:hover:bg-white`}>
      {isRecording ? (
        <Mic2 className="w-6 h-6 text-red-500 animate-bounce" />
      ) : (
        <Mic2
          className="w-6 h-6 text-blue-500 cursor-pointer"
          onClick={recordAudio}
        />
      )}
      <div>
        <p className={`text-${theme === 'dark' ? 'gray-300' : 'gray-700'} font-medium`}>Voice to Text Logging</p>
        {transcript && (
          <p className={`text-${theme === 'dark' ? 'gray-200' : 'gray-600'}`}>{transcript}</p>
        )}
      </div>
    </div>
  );
};

export default VoiceToTextLogging;
