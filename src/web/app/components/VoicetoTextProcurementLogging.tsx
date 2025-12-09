jsx
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceToTextLogging = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = async () => {
    if (typeof window.MediaRecorder === 'undefined') {
      alert('MediaRecorder API not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      let recordedChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result.split(',')[1];
          const response = await fetch('https://api.speechtotextservice.com/transcribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ audio: base64data })
          });
          const data = await response.json();
          onTranscription(data.transcript);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="flex items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
      >
        {isRecording ? (
          <>
            <MicOff strokeWidth={2} size={18} className="mr-2" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic strokeWidth={2} size={18} className="mr-2" />
            Start Recording
          </>
        )}
      </button>
      {transcript && (
        <div className="max-w-sm text-white">
          Transcription: {transcript}
        </div>
      )}
    </div>
  );
};

export default VoiceToTextLogging;
