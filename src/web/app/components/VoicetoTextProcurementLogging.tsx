jsx
import React, { useState } from 'react';
import { Mic, Microphone2Off } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

const VoiceToTextProcurementLogging = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { isDarkMode } = useTheme();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      let partialTranscript = '';
      mediaRecorder.ondataavailable = (event) => {
        if (typeof event.data === 'string') {
          partialTranscript += event.data;
        } else if (event.data.size > 0) {
          const audioBlob = event.data;
          // Use Web Speech API to convert speech to text
          const recognition = new webkitSpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.onresult = (event) => {
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              partialTranscript += event.results[i][0].transcript;
            }
            setTranscript(partialTranscript);
          };
          recognition.onerror = (error) => {
            console.error('Recognition error:', error);
          };
          recognition.onend = () => {
            mediaRecorder.stop();
            setIsRecording(false);
          };
          recognition.start();
        }
      };

      mediaRecorder.onstop = () => {
        setTranscript(partialTranscript);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className={`p-6 rounded-lg shadow-md bg-${isDarkMode ? 'dark' : 'white'} text-${isDarkMode ? 'white' : 'black'}`}>
      <h2 className="text-xl font-bold">Voice-to-Text Procurement Logging</h2>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`mt-4 p-3 rounded-lg border hover:bg-${isDarkMode ? 'gray-700' : 'gray-100'} text-${isDarkMode ? 'white' : 'black'}`}
        disabled={!navigator.mediaDevices.getUserMedia}
      >
        {isRecording ? (
          <Microphone2Off className="w-6 h-6 mr-2" />
        ) : (
          <Mic className="w-6 h-6 mr-2" />
        )}
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {transcript && (
        <div className="mt-4 bg-${isDarkMode ? 'gray-800' : 'gray-100'} p-3 rounded-lg border">
          <p className="text-sm">Transcript:</p>
          <pre className="mt-2">{transcript}</pre>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextProcurementLogging;
