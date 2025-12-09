// @ts-nocheck

import React, { useState } from 'react';
import { Mic } from 'lucide-react';

const VoiceToTextProcurementLogging = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const audioBlob = event.data;
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result.split(',')[1];
            fetch('https://api.speechtotext.com/recognize', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ audioBase64: base64Audio }),
            })
              .then((response) => response.json())
              .then((data) => {
                setTranscript(data.transcript);
              });
          };
          reader.readAsDataURL(audioBlob);
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

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-white mb-4">Voice-to-Text Procurement Logging</h2>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
      >
        {isRecording ? (
          <>
            <Mic className="mr-2" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="mr-2" />
            Start Recording
          </>
        )}
      </button>
      {transcript && (
        <div className="mt-4 bg-gray-700 p-4 rounded-md">
          <p className="text-white font-semibold">Transcript:</p>
          <p className="text-white">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextProcurementLogging;