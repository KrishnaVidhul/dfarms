jsx
import React, { useState } from 'react';
import { Mic, CheckCircle2, XCircle2 } from 'lucide-react';

const VoiceToTextProcurement = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const startRecording = async () => {
    try {
      if (typeof window.MediaRecorder === 'undefined') throw new Error('Browser does not support MediaRecorder');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let chunks = [];

      mediaRecorder.ondataavailable = event => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(await blob.arrayBuffer());
        const recognizer = new PocketsphinxRecognizer(audioBuffer);
        recognizer.start();
        recognizer.onresult = result => {
          setTranscript(result.transcript);
          chunks = [];
          startRecording();
        };
        recognizer.onerror = error => setError(error.message);
      };

      mediaRecorder.onerror = error => setError(error.message);

      setIsRecording(true);
      mediaRecorder.start();
    } catch (err) {
      setError(err.message);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        stream.getTracks().forEach(track => track.stop());
      });
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md dark:bg-zinc-800">
      <h2 className="text-xl font-bold mb-4">Voice-to-Text Procurement Logging</h2>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isRecording ? 'text-red-500' : ''
        }`}
      >
        {isRecording ? <XCircle2 className="mr-2" /> : <Mic className="mr-2" />} {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {transcript && (
        <div className="mt-4 bg-gray-800 p-3 rounded-lg shadow-md">
          <p className="text-white">{transcript}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 bg-red-500 text-white p-3 rounded-lg shadow-md">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextProcurement;
