jsx
import React, { useState } from 'react';
import { MicIcon, StopCircleIcon } from 'lucide-react';

const VoiceToTextLogging = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const audioBlob = event.data;
          // Convert the audio blob to text using a speech-to-text service
          convertAudioToText(audioBlob);
        }
      };

      mediaRecorder.onstop = () => {
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      mediaRecorder.stop();
    }
  };

  const convertAudioToText = (audioBlob) => {
    // Use a speech-to-text service like Web Speech API or a third-party service
    const reader = new FileReader();
    reader.onloadstart = () => console.log('Reading file...');
    reader.onloadend = async () => {
      const audioDataUrl = reader.result;
      // Convert the audio data URL to text using a speech-to-text service
      // Example: Using Web Speech API
      if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.onresult = (event) => {
          setTranscript(event.results[0][0].transcript);
        };
        recognition.onerror = (event) => {
          console.error('Recognition error:', event);
        };
        recognition.start();
      } else {
        console.error('Web Speech API not supported');
      }
    };
    reader.readAsDataURL(audioBlob);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Voice-to-Text Procurement Logging</h2>
      <div className="flex items-center justify-between">
        {isRecording ? (
          <StopCircleIcon
            onClick={stopRecording}
            className="w-8 h-8 text-red-500 cursor-pointer"
          />
        ) : (
          <MicIcon
            onClick={startRecording}
            className="w-8 h-8 text-blue-500 cursor-pointer"
          />
        )}
      </div>
      {transcript && (
        <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
          <p className="text-base font-medium text-black dark:text-white">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextLogging;
