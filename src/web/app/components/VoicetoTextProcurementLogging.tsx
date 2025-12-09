jsx
import React, { useState } from 'react';
import { Mic, Microphone2 } from 'lucide-react';
import { useTheme } from 'next-themes';

const VoiceToTextProcurementLogging = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { theme, setTheme } = useTheme();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const audioBlob = event.data;
          const audioUrl = URL.createObjectURL(audioBlob);
          const recognition = new webkitSpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';
          recognition.onresult = (event) => {
            setTranscript(event.results[0][0].transcript);
          };
          recognition.onerror = (event) => {
            console.error('Recognition error:', event.error);
          };
          recognition.start();
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
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      });
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md max-w-[500px] mx-auto">
      <h2 className="text-xl font-bold mb-4">Voice-to-Text Procurement Logging</h2>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        {isRecording ? <Microphone2 /> : <Mic />}
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Transcript:</h3>
        <pre className="bg-gray-800 p-2 rounded-md overflow-auto max-h-40">{transcript}</pre>
      </div>
    </div>
  );
};

export default VoiceToTextProcurementLogging;
