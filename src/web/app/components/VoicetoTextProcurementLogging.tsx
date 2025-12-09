jsx
import React, { useState } from 'react';
import { Mic2 } from 'lucide-react';
import { useTheme } from 'next-themes';

const VoiceToTextProcurementLogging = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { theme } = useTheme();

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
        formData.append('file', audioBlob);

        fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        })
        .then(response => response.json())
        .then(data => {
          setTranscript(data.transcript);
        })
        .catch(error => console.error('Error transcribing:', error));

        audioChunks = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied: ', err);
    }
  };

  const stopRecording = () => {
    if (audioRecorder) {
      audioRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className={`bg-${theme === 'dark' ? 'gray-900' : 'white'} text-${
      theme === 'dark' ? 'gray-200' : 'black'
    } rounded-lg shadow-md p-4 flex items-center justify-between`}>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="flex items-center gap-2"
      >
        {isRecording ? (
          <>
            <Mic2 className="text-red-500" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic2 />
            Start Recording
          </>
        )}
      </button>
      {transcript && (
        <div className="flex flex-col max-w-md">
          <p className="font-semibold">Transcript:</p>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextProcurementLogging;
