jsx
import React, { useState } from 'react';
import { Mic2, FilePlus2 } from 'lucide-react';

const VoiceToTextProcurement = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const audioBlob = new Blob([reader.result], { type: 'audio/wav' });
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.wav');

            // Simulate API call
            fetch('/api/voice-to-text', {
              method: 'POST',
              body: formData,
            })
              .then(response => response.json())
              .then(data => {
                setTranscript(prevTranscript => prevTranscript + data.transcript);
              });
          };
          reader.readAsArrayBuffer(event.data);
        }
      };

      mediaRecorder.onstop = () => setIsRecording(false);

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const audioChunks = [];

        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event =>
          audioChunks.push(event.data);

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.wav');

          // Simulate API call
          fetch('/api/voice-to-text', {
            method: 'POST',
            body: formData,
          })
            .then(response => response.json())
            .then(data => {
              setTranscript(prevTranscript => prevTranscript + data.transcript);
            });
        };

        mediaRecorder.stop();
        setIsRecording(false);
      });
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg flex items-center space-x-2">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none ${
          isRecording ? 'bg-red-500 hover:bg-red-600' : ''
        }`}
      >
        {isRecording ? <Mic2 size={18} /> : <FilePlus2 size={18} />}
      </button>
      <div className="flex-grow overflow-hidden">
        <textarea
          value={transcript}
          onChange={e => setTranscript(e.target.value)}
          className="w-full h-24 p-2 bg-gray-800 text-white border-none rounded-md focus:outline-none resize-none"
          placeholder="Transcript will appear here..."
        />
      </div>
    </div>
  );
};

export default VoiceToTextProcurement;
