jsx
import React, { useState } from 'react';
import { Mic2, CheckCircle } from 'lucide-react';

const VoiceToTextLogging = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = async () => {
    try {
      if (typeof window.MediaRecorder === 'undefined') {
        alert('MediaRecorder API not supported in this browser.');
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      let recordedChunks = [];
      
      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          const base64String = reader.result.split(',')[1];
          setTranscript(await fetchVoiceToText(base64String));
          setIsRecording(false);
        };
        
        reader.readAsDataURL(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Failed to access microphone. Please check your permissions.');
    }
  };

  const fetchVoiceToText = async (audioBase64) => {
    // Simulate API call for voice-to-text conversion
    return new Promise(resolve => setTimeout(() => resolve('Converted Text'), 2000));
  };

  return (
    <div className="bg-[#1e1e1e] text-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
      <h3 className="text-xl font-bold mb-4">Voice-to-Text Procurement Logging</h3>
      <button
        onClick={isRecording ? () => {} : startRecording}
        disabled={false}
        className={`flex items-center space-x-2 p-2 rounded-lg text-white ${
          isRecording ? 'bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isRecording ? <CheckCircle size={18} /> : <Mic2 size={18} />}
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {transcript && (
        <div className="mt-4 bg-[#2b2b2b] p-3 rounded-lg shadow-md">
          <p className="text-sm">Transcript:</p>
          <pre className="text-white">{transcript}</pre>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextLogging;
