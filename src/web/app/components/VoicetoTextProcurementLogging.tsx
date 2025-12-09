jsx
import React, { useState } from 'react';
import LucideRecordCircle from '@lucide/react/record-circle';
import LucideStopCircle from '@lucide/react/stop-circle';

const VoiceToTextLogging = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const audioChunks = [];
          audioChunks.push(event.data);
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const formData = new FormData();
          formData.append('file', audioBlob);

          // Simulate API call to recognize speech
          setTimeout(() => {
            setTranscription('Fetching transcription...');
            setTimeout(() => {
              setTranscription('Finalized transcription goes here.');
              setIsRecording(false);
            }, 2000);
          }, 1000);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  return (
    <div className="bg-[#121212] p-6 rounded-lg shadow-lg">
      <h2 className="text-white text-xl font-bold mb-4">Voice-to-Text Procurement Logging</h2>
      <p className="text-gray-300 text-base mb-4">
        Capture and log procurement requests using voice.
      </p>
      <div className="flex items-center justify-between">
        {isRecording ? (
          <LucideStopCircle
            size={24}
            color="#FF5722"
            onClick={() => setIsRecording(false)}
          />
        ) : (
          <LucideRecordCircle
            size={24}
            color="#34D399"
            onClick={startRecording}
          />
        )}
        <button
          className="bg-[#34D399] text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-[#28a745]"
          disabled={!isRecording}
        >
          Stop Recording
        </button>
      </div>
      {transcription && (
        <p className="text-gray-300 text-base mt-4">
          Transcription: {transcription}
        </p>
      )}
    </div>
  );
};

export default VoiceToTextLogging;
