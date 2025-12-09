import React, { useState } from 'react';
import { Mic2 } from 'lucide-react';

const VoiceToTextLogging = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = new MediaRecorder(navigator.mediaDevices.getUserMedia({ audio: true }));
  let recordedChunks = [];

  const startRecording = () => {
    setIsRecording(true);
    mediaRecorder.start();
    recordedChunks = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
      fetch('https://api.speechtotextservice.com/transcribe', {
        method: 'POST',
        body: audioBlob,
        headers: {
          'Content-Type': 'audio/wav',
        },
      })
        .then((response) => response.json())
        .then((data) => onTranscription(data.transcript))
        .catch((error) => console.error('Error transcribing audio:', error));
    };
  };

  return (
    <button
      onClick={() => isRecording ? mediaRecorder.stop() : startRecording()}
      className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none transition duration-300"
      aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
    >
      {isRecording ? <Mic2 className="w-5 h-5 mr-2" /> : <Mic2 className="w-5 h-5 mr-2" />}
      {isRecording ? 'Stop Recording' : 'Start Recording'}
    </button>
  );
};

export default VoiceToTextLogging;