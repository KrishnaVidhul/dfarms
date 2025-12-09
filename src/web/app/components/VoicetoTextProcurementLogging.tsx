jsx
import React, { useState } from 'react';
import { Mic, FilePlus2 } from 'lucide-react';

const VoiceToTextProcurementLogging = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      let audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);

        // Simulate uploading to server
        fetch('/api/voice-to-text', {
          method: 'POST',
          body: formData,
        })
        .then(response => response.json())
        .then(data => {
          setTranscript(data.transcript);
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to record audio:', err);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      // Assuming the media recorder is defined and started
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Voice-to-Text Procurement Logging</h2>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center ${
          isRecording && 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {isRecording ? <Mic className="mr-2" /> : <FilePlus2 className="mr-2" />}
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {transcript && (
        <div className="bg-gray-700 p-4 mt-4 rounded-lg shadow-md">
          <p className="text-white text-base font-semibold">Transcript:</p>
          <pre className="text-gray-200 whitespace-pre-wrap">{transcript}</pre>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextProcurementLogging;
