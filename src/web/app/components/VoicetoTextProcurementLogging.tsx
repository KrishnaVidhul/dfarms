jsx
import React, { useState } from 'react';
import { Mic2, MicOff } from 'lucide-react';
import { useTheme } from 'next-themes';

const VoiceToTextLogging = () => {
  const { theme } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleStartRecording = async () => {
    if (typeof window.MediaRecorder === 'undefined') {
      alert('Your browser does not support media recording.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const audioData = reader.result;
            // Convert audio data to text using a transcription API
            fetch('https://api.example.com/transcribe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ audioData }),
            })
            .then(response => response.json())
            .then(data => {
              setTranscript(prevTranscript => prevTranscript + data.text);
            });
          };
          reader.readAsDataURL(event.data);
        }
      };

      recorder.onstop = () => {
        setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const handleStopRecording = () => {
    if (!isRecording) return;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaSource = new MediaSource();
        const videoElement = document.createElement('video');
        videoElement.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', () => {
          const sourceBuffer = mediaSource.addSourceBuffer('audio/mp4; codecs="mp4a.40.2"');
          stream.getTracks().forEach(track => track.stop());
          sourceBuffer.appendBuffer(new Uint8Array(0));
        });
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });

    setIsRecording(false);
  };

  return (
    <div className={`bg-[${theme === 'dark' ? '#121212' : '#ffffff'}] text-white p-4 rounded-lg shadow-md relative`}>
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className="flex items-center space-x-2 px-4 py-2 bg-[${theme === 'dark' ? '#333333' : '#e0e0e0'}] text-white rounded-full hover:bg-opacity-80 transition"
      >
        {isRecording ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic2 className="w-5 h-5" />
        )}
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {transcript && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Transcription</h3>
          <p className="bg-[${theme === 'dark' ? '#282c34' : '#f0f0f0'}] p-4 rounded-lg shadow-md text-sm">
            {transcript}
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextLogging;
