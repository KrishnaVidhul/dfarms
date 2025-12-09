jsx
import React, { useState } from 'react';
import LucideVoice as VoiceIcon from 'lucide-react/LucideVoice';
import { Switch } from '@headlessui/react';

const VoiceToTextLogging = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = async () => {
    try {
      if (typeof window.MediaRecorder === 'undefined') {
        throw new Error('MediaRecorder API not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      let audioChunks = [];

      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result;
          fetch('/api/transcribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ audioData: dataUrl })
          }).then(response => response.json()).then(data => {
            setTranscript(data.transcript);
          });
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      return () => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      startRecording();
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-[#121313] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow dark:bg-[#1e1f20]">
      <h2 className="text-xl font-bold mb-4 text-white">Voice-to-Text Procurement Logging</h2>
      <div className="flex items-center justify-between">
        <button
          onClick={toggleRecording}
          className={`bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2 px-4 rounded-lg focus:outline-none transition-colors ${isRecording ? 'bg-[#1e1f20]' : ''}`}
        >
          <VoiceIcon className="mr-2" />
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {transcript && (
          <div className="text-gray-300 text-sm">
            <p>Transcript:</p>
            <pre className="bg-[#1e1f20] p-2 rounded-lg overflow-auto max-h-48 shadow-inner">
              {transcript}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceToTextLogging;
