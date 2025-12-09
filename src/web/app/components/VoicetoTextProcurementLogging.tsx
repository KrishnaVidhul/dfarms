jsx
import React, { useState } from 'react';
import { Mic2 } from 'lucide-react';

const VoiceToTextLogging = () => {
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    if (typeof window.MediaRecorder === 'undefined') {
      alert('Your browser does not support media recording.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = event => {
        const audioChunks = [];
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const audioBuffer = new AudioContext().decodeAudioData(reader.result).then(buffer => {
            // Convert buffer to text using a speech recognition API
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            recognition.onresult = result => {
              setTranscription(result.results[0][0].transcript);
            };
            recognition.onerror = error => {
              console.error('Error during speech recognition:', error);
            };
            recognition.start();
          });
        };
        reader.readAsArrayBuffer(audioBlob);
      };
      recorder.onstop = () => {
        setIsRecording(false);
      };
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      // Assuming there's a way to stop the MediaRecorder
      // This is just a placeholder, as MediaRecorder does not have a direct stop method
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Voice-to-Text Logging</h2>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
          isRecording ? 'bg-red-500 hover:bg-red-700' : ''
        }`}
      >
        {isRecording ? <Mic2 className="inline" /> : <Mic2 className="inline" />}{' '}
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {transcription && (
        <div className="mt-4 bg-gray-700 p-3 rounded">
          <p className="text-white text-sm">{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextLogging;
