jsx
import React, { useState } from 'react';
import Lucide from 'lucide-react';

const VoiceToTextLogging = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        let recordedChunks = [];

        mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'audio/wav' });
          const reader = new FileReader();
          reader.onloadend = () => {
            const audioContext = new AudioContext();
            audioContext.decodeAudioData(reader.result, decodedData => {
              const recognizer = webkitSpeechRecognition || SpeechRecognition;
              const recognition = new recognizer();
              recognition.continuous = false;
              recognition.interimResults = true;
              recognition.lang = 'en-US';
              recognition.onresult = event => {
                for (let i = event.results.length - 1; i >= 0; i--) {
                  if (event.results[i].isFinal) {
                    setTranscript(prevTranscript => prevTranscript + event.results[i][0].transcript);
                  }
                }
              };
              recognition.onerror = error => console.error(error);
              recognition.start();
            });
          };
          reader.readAsArrayBuffer(blob);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.log('The microphone is not accessible. Please check your permissions.');
      }
    } else {
      console.log('Your browser does not support media devices API');
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.stop();
        setIsRecording(false);
      });
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Voice-to-Text Procurement Logging</h2>
      <div>
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-md flex items-center"
          >
            <Lucide.MicrophoneOff />
            Stop Recording
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md flex items-center"
          >
            <Lucide.Microphone />
            Start Recording
          </button>
        )}
      </div>
      {transcript && (
        <div className="mt-6 bg-gray-800 p-3 rounded-lg">
          <p className="text-sm">Transcript:</p>
          <pre className="text-white">{transcript}</pre>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextLogging;
