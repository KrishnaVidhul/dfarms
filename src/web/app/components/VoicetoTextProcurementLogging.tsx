jsx
import React, { useState } from 'react';
import { HiSpeakerWave } from 'lucide-react';
import { IoIosArrowBack } from 'lucide-react';

const VoiceToTextLogging = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Web Speech API is not supported by your browser.');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsRecording(true);
    recognition.onerror = (event) => console.error(event.error);
    recognition.onend = () => setIsRecording(false);

    recognition.onresult = (event) => {
      const transcriptResult = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setTranscript(transcriptResult + ' ');
    };

    recognition.start();
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <header className="flex justify-between items-center mb-4">
        <button className="text-xl" onClick={() => {}}>
          <IoIosArrowBack />
        </button>
        <h2 className="text-xl font-bold">Voice-to-Text Logging</h2>
        <button disabled={isRecording} onClick={startRecording}>
          {isRecording ? (
            <HiSpeakerWave className="animate-bounce text-red-600" size={32} />
          ) : (
            <HiSpeakerWave className="text-green-500" size={32} />
          )}
        </button>
      </header>
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-lg">{transcript}</p>
      </div>
    </div>
  );
};

export default VoiceToTextLogging;
