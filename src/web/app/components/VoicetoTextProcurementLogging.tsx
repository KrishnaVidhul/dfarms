jsx
import React, { useState } from 'react';
import LucideMicrophone from 'lucide-react';
import LucideCheckCircle from 'lucide-react';
import LucideXCircle from 'lucide-react';

const VoiceToTextProcurement = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const audioChunks = [];
          mediaRecorder.addEventListener('dataavailable', (e) => audioChunks.push(e.data));
          mediaRecorder.stop();
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          convertSpeechToText(audioBlob);
        }
      };

      mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    setStatus('Converting...');
  };

  const convertSpeechToText = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');

    try {
      const response = await fetch('/api/voice-to-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const result = await response.json();
      setTranscript(result.transcript);
      setStatus('Converted!');
    } catch (error) {
      console.error('Error converting speech to text:', error);
      setStatus('Failed to convert.');
    }
  };

  return (
    <div className="bg-[#121214] p-8 rounded-lg shadow-md flex flex-col items-center justify-center space-y-6">
      <LucideMicrophone
        size={32}
        strokeWidth={2.5}
        color="#fff"
        onClick={() => {
          if (!isRecording) startRecording();
          else stopRecording();
        }}
        className={`cursor-pointer ${isRecording ? 'text-[#0ea5e9]' : 'text-white'}`}
      />
      <div className="text-center">
        <h2 className="text-lg font-bold text-white mb-2">{isRecording ? 'Recording...' : 'Voice-to-Text Procurement'}</h2>
        {status && <p className={`text-sm ${status.includes('Failed') ? 'text-red-500' : status.includes('Converted') ? 'text-green-500' : 'text-gray-300'}`}>{status}</p>}
      </div>
      {transcript && (
        <div className="bg-[#2c2c34] p-4 rounded-lg w-full">
          <pre className="text-white overflow-y-auto max-h-64">{transcript}</pre>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextProcurement;
