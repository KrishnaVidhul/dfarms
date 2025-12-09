jsx
import React, { useState } from 'react';
import LucidePhoneIncoming from 'lucide-react';
import { useTheme } from 'next-themes';

const VoiceToTextProcurementLogging = () => {
  const [transcription, setTranscription] = useState('');
  const { theme } = useTheme();

  const handleVoiceInput = async (event) => {
    if (theme === 'dark') {
      event.currentTarget.style.color = '#FFFFFF';
    }
    const audioContext = new AudioContext();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      source.connect(processor);
      processor.connect(audioContext.destination);

      let recognition;
      if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
      } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
      }

      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcription += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscription(transcription + ' ' + interimTranscript);
      };

      recognition.onerror = (event) => {
        if (event.error === 'no-speech') {
          console.log('No speech detected. Please try again.');
        } else if (event.error === 'audio-capture') {
          console.log('Permission denied to access microphone. Please allow access and try again.');
        }
      };

      recognition.onend = () => {
        source.disconnect();
        processor.disconnect();
        audioContext.close();
      };

      recognition.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-md max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Voice-to-Text Procurement Logging</h2>
        <LucidePhoneIncoming size={24} />
      </div>
      <div className="bg-gray-800 p-3 rounded-lg" onClick={handleVoiceInput} style={{ cursor: 'pointer' }}>
        {transcription || 'Click to start recording...'}
      </div>
    </div>
  );
};

export default VoiceToTextProcurementLogging;
