import React, { useState } from "react";
import { Mic2 } from 'lucide-react';
import { useTheme } from "next-themes";

const VoiceToTextProcurement = () => {
  const [transcription, setTranscription] = useState('');
  const { theme } = useTheme();

  const handleVoiceCommand = async (e) => {
    e.preventDefault();
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      let chunks = [];
      mediaRecorder.ondataavailable = event => chunks.push(event.data);

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const response = await fetch('https://api.speech-to-text.com/endpoint', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ audioData: reader.result.split(',')[1] })
            });
            const result = await response.json();
            setTranscription(result.text);
          } catch (error) {
            console.error('Error transcribing:', error);
          }
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorder.start();

      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000); // Stop after 5 seconds
    } catch (err) {
      console.error("The following gUM error occurred: " + err);
    }
  }

  return (
    <div className={`bg-${theme === 'dark' ? 'gray-900' : 'white'} text-${theme === 'dark' ? 'white' : 'black'} rounded-lg shadow-md p-6 flex items-center justify-between`}>
      <button
        onClick={handleVoiceCommand}
        className="bg-${theme === 'dark' ? 'blue-500' : 'blue-200'} hover:bg-${theme === 'dark' ? 'blue-700' : 'blue-300'} text-white font-semibold py-2 px-4 rounded"
      >
        <Mic2 className="mr-2" />
        Voice Command
      </button>
      {transcription && (
        <div className="flex flex-col">
          <span className="text-gray-500">Transcription:</span>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
}

export default VoiceToTextProcurement;