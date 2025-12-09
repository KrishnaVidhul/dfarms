jsx
import React, { useState } from 'react';
import { Mic2, MessageCircle } from 'lucide-react';

const VoiceToTextProcurement = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = async () => {
    if (typeof MediaRecorder === 'undefined') {
      alert('Your browser does not support media recording.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      let录音数据 = [];

      mediaRecorder.ondataavailable = (event) => {
        录音数据.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const 录音Blob = new Blob(录音数据, { type: 'audio/wav' });
        const 录音URL = URL.createObjectURL(录音Blob);

        // Convert audio to text
        fetch('https://api.speechtotext.com/transcribe', {
          method: 'POST',
          body: 录音Blob,
          headers: {
            'Content-Type': 'audio/wav',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setTranscript(data.transcript);
          });
      };

      mediaRecorder.start();
      setIsRecording(true);

      const 停止录音 = () => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      };

      setTimeout(停止录音, 10000); // Stop after 10 seconds for demo purposes
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  return (
    <div className="bg-[#121214] p-6 rounded-lg shadow-md flex items-center justify-between w-full max-w-md mx-auto">
      <div>
        <h3 className="text-white font-bold text-base">Voice-to-Text Procurement Logging</h3>
        <p className="text-gray-400 text-sm mt-1">Transcribe procurement requests with voice commands.</p>
      </div>
      <button
        onClick={startRecording}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
          isRecording ? 'bg-red-500 hover:bg-red-600' : ''
        }`}
      >
        {isRecording ? <Mic2 className="mr-1" /> : <MessageCircle className="mr-1" />}
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {transcript && (
        <div className="mt-4 bg-gray-600 text-white p-3 rounded-lg shadow-md">
          <p>Transcription:</p>
          <pre>{transcript}</pre>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextProcurement;
