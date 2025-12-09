jsx
import React, { useState, useEffect } from 'react';
import { Mic, FileX2 } from 'lucide-react';
import { formatDateTime } from '../utils/dateUtils';

const VoiceToTextProcurement = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [audioChunks, setAudioChunks] = useState([]);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        recognizeSpeech(audioUrl);
      };

      setAudioChunks([]);
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setIsRecording(false);
    }
  };

  let recorder;

  const recognizeSpeech = async (audioUrl) => {
    try {
      const response = await fetch('/api/recognize-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to recognize speech');
      }

      const data = await response.json();
      setTranscription(data.transcription);
    } catch (error) {
      console.error('Error recognizing speech:', error);
      setTranscription('');
    }
  };

  const handleToggleRecording = () => {
    setIsRecording((prevIsRecording) => !prevIsRecording);
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <button
        onClick={handleToggleRecording}
        className={`flex items-center gap-2 ${
          isRecording ? 'text-red-500' : 'text-green-400'
        }`}
      >
        {isRecording ? (
          <>
            <FileX2 />
            Stop Recording
          </>
        ) : (
          <>
            <Mic />
            Start Recording
          </>
        )}
      </button>
      <div className="flex flex-col">
        <span className="text-lg font-bold">Transcription:</span>
        <pre className="mt-2 text-sm whitespace-pre-wrap">{transcription}</pre>
      </div>
    </div>
  );
};

export default VoiceToTextProcurement;
