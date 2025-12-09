jsx
import React, { useState } from 'react';
import { Mic, Volume2 } from 'lucide-react';

const VoiceToTextLogging = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = () => {
    if (window.MediaRecorder) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          let audioChunks = [];

          mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const formData = new FormData();
            formData.append('file', audioBlob);

            fetch('/api/voice-to-text', {
              method: 'POST',
              body: formData,
            })
            .then(response => response.json())
            .then(data => {
              onTranscription(data.transcript);
              setTranscript('');
            });
          };

          mediaRecorder.start();
          setIsRecording(true);
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
        });
    } else {
      console.error('MediaRecorder is not supported in this browser');
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-center items-center space-x-2">
      {isRecording ? (
        <button onClick={stopRecording} className="p-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 transition duration-150 ease-in-out">
          Stop
        </button>
      ) : (
        <button onClick={startRecording} className="p-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300 transition duration-150 ease-in-out">
          Start
        </button>
      )}
      <Mic size={24} className="text-gray-400" />
    </div>
  );
};

export default VoiceToTextLogging;
