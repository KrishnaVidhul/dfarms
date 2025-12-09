jsx
import React, { useState } from 'react';
import { Mic2 } from 'lucide-react';

const VoiceToTextProcurement = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      let audioChunks = [];

      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        
        recognition.onresult = event => {
          const transcriptText = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setTranscript(transcriptText);
        };

        recognition.onerror = error => {
          console.error('Error during speech recognition:', error);
        };

        recognition.start();
      };

      mediaRecorder.start();
      setIsRecording(true);

      const stopRecording = () => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
      };

      setTimeout(stopRecording, 10000); // Stop recording after 10 seconds
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <Mic2 className="mr-2" size={24} />
        {isRecording ? 'Recording...' : 'Start Recording'}
      </div>
      <button
        onClick={startRecording}
        disabled={isRecording}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isRecording ? 'Stop' : 'Record'}
      </button>
    </div>
  );
};

export default VoiceToTextProcurement;
